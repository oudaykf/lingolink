# Fix for "Failed to create account" Issue

## Problem Identified

After investigating the registration issue, we've identified that the problem is related to **Row Level Security (RLS)** in Supabase. The error message from our tests shows:

```
Error creating user: {
  code: '42501',
  details: null,
  hint: null,
  message: 'new row violates row-level security policy for table "users"'
}
```

This means that the anonymous key being used by the application doesn't have permission to insert new rows into the `users` table due to Supabase's Row Level Security policies.

## Solution

To fix this issue, you need to configure the appropriate Row Level Security policies in your Supabase project. Follow these steps:

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

### Option 2: Using SQL (For Advanced Users)

We've created a SQL script that will fix the RLS policies. You can run this in the Supabase SQL Editor:

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Create a new query
5. Copy the contents of the `scripts/fix-rls-policy.sql` file and paste it into the editor
6. Run the query

Alternatively, you can run the SQL script directly from your terminal using the Supabase CLI if you have it installed.

## Testing the Fix

After applying the fix, you can test if registration works by:

1. Running the test script: `node test-registration.js` from the server directory
2. Trying to register a new user through the application interface

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