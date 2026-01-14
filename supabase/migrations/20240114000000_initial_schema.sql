-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'master_admin', 'sales');
CREATE TYPE offer_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE attribute_type AS ENUM ('text', 'color', 'number');

-- 2. USERS & PROFILES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role DEFAULT 'sales',
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATALOG

CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id UUID REFERENCES public.categories(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id),
  name TEXT NOT NULL,
  model_code TEXT NOT NULL,
  description JSONB DEFAULT '{}'::jsonb, -- Structured specs
  base_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.attributes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL, -- e.g. "Diameter"
  type attribute_type DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.attribute_values (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  attribute_id UUID REFERENCES public.attributes(id) ON DELETE CASCADE,
  value TEXT NOT NULL, -- e.g. "50cm"
  meta_value TEXT, -- e.g. Hex code
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.product_attribute_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_id UUID REFERENCES public.attributes(id) ON DELETE CASCADE,
  UNIQUE(product_id, attribute_id)
);

-- Price determined by Attribute Value (Spec 6.3)
CREATE TABLE public.product_prices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_value_id UUID REFERENCES public.attribute_values(id) ON DELETE CASCADE,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT, -- Specific image for this variant (Spec 6.4)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.product_addons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Include Bulb"
  price_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.product_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OFFERS (Sales Mode)

CREATE TABLE public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  vat_number TEXT,
  address TEXT,
  contact_person TEXT,
  created_by UUID REFERENCES public.profiles(id), -- Optional: if sales reps own their clients
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  offer_number SERIAL, -- Simple sequential number for display
  user_id UUID REFERENCES public.profiles(id) NOT NULL, -- The Sales Rep
  client_id UUID REFERENCES public.clients(id),
  status offer_status DEFAULT 'draft',
  vat_rate NUMERIC(5, 2) DEFAULT 20.00,
  bulk_discount_percent NUMERIC(5, 2) DEFAULT 0.00,
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.offer_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id), -- Nullable for Manual Lines
  sort_order INTEGER DEFAULT 0,
  
  -- Snapshot Fields (Crucial for Quote integrity)
  name_snapshot TEXT NOT NULL,
  description_snapshot TEXT,
  unit_price_snapshot NUMERIC(10, 2) NOT NULL,
  
  quantity INTEGER DEFAULT 1,
  discount_percent NUMERIC(5, 2) DEFAULT 0.00,
  total_price NUMERIC(10, 2) GENERATED ALWAYS AS (
    (unit_price_snapshot * quantity) * (1 - (discount_percent / 100))
  ) STORED,

  -- Configuration Snapshots
  selected_attributes_json JSONB DEFAULT '{}'::jsonb,
  selected_addons_json JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attribute_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'master_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_sales()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'sales'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read own, Admin can read all
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (is_admin());

-- Catalog: Public Read (except Prices), Admin Write
-- Note: Prices have their own table, so Products is safe to be public
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read attributes" ON public.attributes FOR SELECT USING (true);
CREATE POLICY "Public read attribute values" ON public.attribute_values FOR SELECT USING (true);
CREATE POLICY "Public read addons" ON public.product_addons FOR SELECT USING (true);
CREATE POLICY "Public read documents" ON public.product_documents FOR SELECT USING (is_public = true OR auth.role() = 'authenticated');

-- Admin Write Access to Catalog
CREATE POLICY "Admin write catalog" ON public.products FOR ALL USING (is_admin());
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (is_admin());
CREATE POLICY "Admin write attributes" ON public.attributes FOR ALL USING (is_admin());
CREATE POLICY "Admin write attribute values" ON public.attribute_values FOR ALL USING (is_admin());
CREATE POLICY "Admin write prices" ON public.product_prices FOR ALL USING (is_admin());
CREATE POLICY "Admin write addons" ON public.product_addons FOR ALL USING (is_admin());
CREATE POLICY "Admin write documents" ON public.product_documents FOR ALL USING (is_admin());

-- Prices: Sales & Admin only (NOT PUBLIC)
CREATE POLICY "Sales and Admin read prices" ON public.product_prices FOR SELECT USING (auth.role() = 'authenticated');

-- Offers: Sales manage own, Master Admin view all
CREATE POLICY "Sales manage own offers" ON public.offers
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Sales manage own offer items" ON public.offer_items
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.offers WHERE id = public.offer_items.offer_id AND user_id = auth.uid())
  );

CREATE POLICY "Master Admin view all offers" ON public.offers
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'master_admin'));

CREATE POLICY "Master Admin view all offer items" ON public.offer_items
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'master_admin'));

-- Clients: Sales can read/write, Admin read/write
CREATE POLICY "Authenticated read clients" ON public.clients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write clients" ON public.clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update clients" ON public.clients FOR UPDATE USING (auth.role() = 'authenticated');

-- TRIGGERS for Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable Realtime for relevant tables (optional but good for UI)
alter publication supabase_realtime add table public.offers;
alter publication supabase_realtime add table public.offer_items;
