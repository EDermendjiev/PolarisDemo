-- Seed Data for Polaris Demo

-- 1. Categories
INSERT INTO public.categories (name, slug) VALUES
('Pendant Lights', 'pendant-lights'),
('Chandeliers', 'chandeliers'),
('Wall Sconces', 'wall-sconces');

-- 2. Attributes & Values
-- Size
WITH size_attr AS (
  INSERT INTO public.attributes (name, type) VALUES ('Size', 'text') RETURNING id
)
INSERT INTO public.attribute_values (attribute_id, value) VALUES
((SELECT id FROM size_attr), 'Small (40cm)'),
((SELECT id FROM size_attr), 'Medium (60cm)'),
((SELECT id FROM size_attr), 'Large (80cm)');

-- Finish
WITH finish_attr AS (
  INSERT INTO public.attributes (name, type) VALUES ('Finish', 'color') RETURNING id
)
INSERT INTO public.attribute_values (attribute_id, value, meta_value) VALUES
((SELECT id FROM finish_attr), 'Matte Black', '#000000'),
((SELECT id FROM finish_attr), 'Brushed Gold', '#C5A059'),
((SELECT id FROM finish_attr), 'Chrome', '#C0C0C0');

-- 3. Products
INSERT INTO public.products (name, model_code, description, base_image_url) VALUES
(
  'Orion Sphere', 
  'OR-001', 
  '{"material": "Glass, Steel", "socket": "E27", "ip_rating": "IP20"}'::jsonb, 
  'https://images.unsplash.com/photo-1513506003013-8863d6443b82?q=80&w=1000&auto=format&fit=crop'
),
(
  'Vega Linear', 
  'VG-102', 
  '{"material": "Aluminum", "socket": "Integrated LED", "color_temp": "3000K"}'::jsonb, 
  'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop'
);

-- 4. Product Config & Prices (Manually helper for this script, normally done via UI)
-- Linking 'Orion Sphere' to 'Size' and 'Finish'
-- Note: In a real script we need IDs. I will use DO block for complex linking or just simple assumptions if I knew UUIDs. 
-- Since I don't know UUIDs generated above, I will use a DO block to link them dynamically.

DO $$
DECLARE
  p_orion_id UUID;
  p_vega_id UUID;
  a_size_id UUID;
  a_finish_id UUID;
  av_small_id UUID;
  av_medium_id UUID;
  av_large_id UUID;
  av_black_id UUID;
  av_gold_id UUID;
BEGIN
  -- Get IDs
  SELECT id INTO p_orion_id FROM public.products WHERE model_code = 'OR-001';
  SELECT id INTO p_vega_id FROM public.products WHERE model_code = 'VG-102';
  
  SELECT id INTO a_size_id FROM public.attributes WHERE name = 'Size';
  SELECT id INTO a_finish_id FROM public.attributes WHERE name = 'Finish';
  
  SELECT id INTO av_small_id FROM public.attribute_values WHERE value = 'Small (40cm)';
  SELECT id INTO av_medium_id FROM public.attribute_values WHERE value = 'Medium (60cm)';
  SELECT id INTO av_large_id FROM public.attribute_values WHERE value = 'Large (80cm)';
  SELECT id INTO av_black_id FROM public.attribute_values WHERE value = 'Matte Black';
  SELECT id INTO av_gold_id FROM public.attribute_values WHERE value = 'Brushed Gold';

  -- Link Orion to Size and Finish
  INSERT INTO public.product_attribute_config (product_id, attribute_id) VALUES
  (p_orion_id, a_size_id),
  (p_orion_id, a_finish_id);
  
  -- Link Vega to Finish only
  INSERT INTO public.product_attribute_config (product_id, attribute_id) VALUES
  (p_vega_id, a_finish_id);

  -- Set Prices for Orion (Based on Size)
  INSERT INTO public.product_prices (product_id, attribute_value_id, price) VALUES
  (p_orion_id, av_small_id, 120.00),
  (p_orion_id, av_medium_id, 180.00),
  (p_orion_id, av_large_id, 250.00);

  -- Set Prices for Vega (Based on Finish - just example)
  INSERT INTO public.product_prices (product_id, attribute_value_id, price) VALUES
  (p_vega_id, av_black_id, 200.00),
  (p_vega_id, av_gold_id, 240.00);

  -- Addons
  INSERT INTO public.product_addons (product_id, name, price_adjustment) VALUES
  (p_orion_id, 'Vintage Bulb (Warm)', 5.50),
  (p_orion_id, 'Smart Bulb (RGB)', 15.00);

END $$;

-- 5. Clients
INSERT INTO public.clients (name, vat_number, address, contact_person) VALUES
('Acme Architects', 'BG123456789', '123 Design Blvd, Sofia', 'Ivan Petrov'),
('BuildCorp Ltd', 'BG987654321', '45 Industrial Zone, Plovdiv', 'Maria Ivanova');

