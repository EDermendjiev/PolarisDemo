# Database Configuration & Schema Proposal

## Recommended Technology: **Supabase (PostgreSQL)**
Based on the requirements for a "Shared Product Database" between Public and Sales modes, strict Role-Based Access Control (RBAC), and relational complexity (Attributes, Offers, Orders), **PostgreSQL** is the ideal database choice. **Supabase** is recommended for:
1.  **Built-in Auth & RLS**: Critical for securing "Sales Only" prices and "Admin Only" edit rights.
2.  **Relational Integrity**: Essential for Product -> Attribute -> Price mappings.
3.  **Storage**: Integrated handling of Product Images and Document PDFs.

## Schema Design

### 1. Users & Roles (RBAC)
*   **`profiles`**
    *   `id`: uuid (references auth.users)
    *   `email`: text
    *   `role`: enum ('admin', 'master_admin', 'sales')
    *   `full_name`: text

### 2. Catalog (Public & Private Shared)
*   **`categories`**
    *   `id`: uuid
    *   `parent_id`: uuid (self-ref for subcategories)
    *   `name`: text
    *   `slug`: text (unique)

*   **`products`**
    *   `id`: uuid
    *   `category_id`: uuid
    *   `name`: text
    *   `model_code`: text (sku)
    *   `description`: text (jsonb for structured specs)
    *   `base_image_url`: text
    *   `is_active`: boolean
    *   `created_at`: timestamp

*   **`attributes`** (Global definitions, e.g., "Color", "Size")
    *   `id`: uuid
    *   `name`: text (e.g., "Diameter")
    *   `type`: enum ('text', 'color', 'number')

*   **`attribute_values`** (Specific values, e.g., "50cm", "Red")
    *   `id`: uuid
    *   `attribute_id`: uuid
    *   `value`: text
    *   `meta_value`: text (e.g., hex code for color)

*   **`product_attribute_config`** (Links Product to allowed Attributes)
    *   `id`: uuid
    *   `product_id`: uuid
    *   `attribute_id`: uuid

*   **`product_prices`** (Price determined by Attribute Value as per spec 6.3)
    *   `id`: uuid
    *   `product_id`: uuid
    *   `attribute_value_id`: uuid (The driver for the price)
    *   `price`: numeric (EUR)
    *   `image_url`: text (Specific image for this value, spec 6.4)

*   **`product_addons`** (Checkbox extra options, spec 6.5)
    *   `id`: uuid
    *   `product_id`: uuid
    *   `name`: text (e.g., "Include Bulb")
    *   `price_adjustment`: numeric (e.g., +4.00)

*   **`product_documents`** (Spec 6.6)
    *   `id`: uuid
    *   `product_id`: uuid
    *   `title`: text
    *   `file_url`: text
    *   `is_public`: boolean

### 3. Offers (Sales Mode)
*   **`clients`** (Companies)
    *   `id`: uuid
    *   `name`: text
    *   `vat_number`: text
    *   `address`: text
    *   `contact_person`: text

*   **`offers`** (Quotes)
    *   `id`: uuid
    *   `offer_number`: text (sequential)
    *   `user_id`: uuid (Sales rep creator)
    *   `client_id`: uuid
    *   `status`: enum ('draft', 'active', 'completed', 'archived')
    *   `vat_rate`: numeric (Default 20%, adjustable)
    *   `bulk_discount_percent`: numeric
    *   `valid_until`: date
    *   `notes`: text
    *   `created_at`: timestamp
    *   `updated_at`: timestamp

*   **`offer_items`** (Lines)
    *   `id`: uuid
    *   `offer_id`: uuid
    *   `product_id`: uuid (Nullable for "Manual Line")
    *   `sort_order`: integer
    *   **Snapshot Fields** (Copied at creation to allow Override/History integrity):
    *   `name_snapshot`: text
    *   `description_snapshot`: text
    *   `unit_price_snapshot`: numeric
    *   `quantity`: integer
    *   `discount_percent`: numeric
    *   `total_price`: numeric
    *   **Configuration**:
    *   `selected_attributes_json`: jsonb (e.g., `{"Size": "50cm", "Color": "Black"}`)
    *   `selected_addons_json`: jsonb (e.g., `["Bulb +4 EUR"]`)

### 4. Security (RLS Policies)
*   **Public Access**: `SELECT` on products, categories, attributes. **DENY** on costs/prices columns (or use a separate `prices` table that is private).
*   **Sales Access**: `SELECT` all products/prices. `CRUD` on their own `offers`. `SELECT` on `clients`.
*   **Admin Access**: Full access to Catalog tables. No access to other Users' offers (unless Master Admin).
*   **Master Admin**: Full access to everything + Reports.
