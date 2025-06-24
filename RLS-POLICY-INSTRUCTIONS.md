# How to Fix Registration Issues in LingoLink

## Problem

New user registrations are not appearing in the Supabase database tables (users, clients, translators) due to Row Level Security (RLS) policies preventing the anonymous key from inserting new rows.

## Solution

You need to configure the appropriate Row Level Security policies in your Supabase project. Follow these steps:

### Option 1: Using the Supabase Dashboard (Recommended)

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Table Editor** in the left sidebar
4. Select the `users` table
5. Click on the **Policies** tab
6. Click **New Policy**
7. Choose **Insert** as the policy type
8. For a simple policy that allows anyone to register, use:
   - Policy name: `Allow anonymous registration`
   - Using expression: `true`
9. Click **Save Policy**

### Option 2: Using SQL in the Supabase SQL Editor

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Create a new query
5. Copy and paste the following SQL code:

```sql
-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS users_insert_policy ON public.users;
DROP POLICY IF EXISTS users_select_policy ON public.users;

-- Create insert policy for registration
CREATE POLICY users_insert_policy
ON public.users
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Create select policy
CREATE POLICY users_select_policy
ON public.users
FOR SELECT
TO authenticated, anon
USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.clients TO anon;
GRANT ALL ON public.translators TO anon;
```

6. Click **Run** to execute the SQL

## Verification

After applying the fix, you can verify that registration works by:

1. Trying to register a new user through the application interface
2. Checking the Supabase database to confirm the user appears in the `users` table and the appropriate profile table (`clients` or `translators`)

## Additional Information

### Understanding Row Level Security (RLS)

Row Level Security is a feature in PostgreSQL (which Supabase uses) that allows you to define policies controlling which rows can be accessed by different users or roles. By default, when RLS is enabled on a table, all operations are denied unless explicitly allowed by a policy.

In our case, we need to create a policy that allows the anonymous role to insert new rows into the `users` table for registration to work.

### Security Considerations

While the solution above will fix the immediate issue, in a production environment you might want to implement more restrictive policies. For example, you could:

- Limit the number of registrations from a single IP address
- Add rate limiting
- Implement email verification

### Need More Help?

If you continue to experience issues after implementing these fixes, please check:

1. That your Supabase URL and API key are correct in the `.env` file
2. That the SQL schema has been properly executed in your Supabase project
3. That your Supabase project is active and not in maintenance mode
4. The server logs for any additional error messages