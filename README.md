# Abu Coffee Digital Menu

A responsive digital menu backed by Supabase. Customers can browse the published menu, choose English, Amharic, or Afan Oromo, view bank-transfer details, and leave feedback. The admin dashboard is protected by Supabase Authentication.

## Setup

1. Create a Supabase project and copy `.env.example` to `.env`.
2. Add the project URL and publishable/anonymous key to `.env`.
3. Run [`supabase-schema.sql`](./supabase-schema.sql) in the Supabase SQL editor.
4. Create an administrator in Supabase Authentication, then add that user's id and email to `public.admin_users` using the SQL comment at the end of the schema file.
5. Start the app with `npm run dev`.

For temporary bootstrap access, create this account in Supabase Authentication: `admin@abucoffee.com` with password `AbuCoffeeAdmin#2026`. Add it to `public.admin_users`, sign in once, and immediately change the email and password from Admin → Storefront settings → Account security. Do not keep this temporary password in production.

The app intentionally has no local seed records. Until an administrator creates categories and menu items in the dashboard, the customer view remains empty.
