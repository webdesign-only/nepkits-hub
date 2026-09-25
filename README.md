# NEPKITS HUB

Production football jersey, football kit and sportswear e-commerce application built with Next.js, Supabase and Vercel.

## Stack

- Next.js 16 App Router
- Supabase Auth, Postgres, Storage
- Vercel deployment
- Server-side order validation and inventory locking
- Optional eSewa ePay V2 integration

## Setup

1. Copy `.env.example` to `.env.local` and provide Supabase credentials.
2. Apply `supabase/migrations/001_initial_schema.sql` followed by `supabase/migrations/002_payment_hardening.sql` to the Supabase project.
3. Start with `npm install` and `npm run dev`.
4. Sign up a customer account.
5. Promote the intended store operator to admin with:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'admin@example.com');
```

6. Configure delivery zones in the `delivery_zones` table.
7. Sign in as an admin and open Admin → Settings to configure eSewa. Merchant credentials are stored in a private schema and are never returned to the browser.

## Production checks

- `npm run build`
- verify Supabase RLS and security advisors
- configure Vercel environment variables for Production, Preview and Development as needed
- run an end-to-end customer checkout and admin order workflow before accepting real traffic
