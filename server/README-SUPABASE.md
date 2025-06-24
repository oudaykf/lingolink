# LingoLink Supabase Integration

This document provides instructions on how to set up and use Supabase with the LingoLink application.

## Setup Instructions

### 1. Supabase Account Setup

1. Go to [Supabase](https://supabase.com/) and sign up for an account if you don't have one.
2. Create a new project.
3. Note your project URL and API key (found in Project Settings > API).

### 2. Environment Variables

Update your `.env` file with the following variables:

```
SUPABASE_URL=https://llbuabszimfttksresdw.supabase.co
SUPABASE_KEY=your_supabase_key_here
```

Replace `your_supabase_key_here` with your actual Supabase API key.

### 3. Database Schema Setup

1. Go to the SQL Editor in your Supabase dashboard.
2. Copy the contents of `server/scripts/supabase-schema.sql` and run it in the SQL Editor.
3. This will create the necessary tables and functions for the application.

## Testing the Connection

Run the test script to verify your connection to Supabase:

```
node server/scripts/test-supabase-connection.js
```

## Database Schema

The application uses the following tables:

### Users Table

Stores user information:

- `id`: UUID, primary key
- `name`: Text, user's full name
- `email`: Text, unique, user's email address
- `password`: Text, hashed password
- `user_type`: Text, either 'client' or 'translator'
- `created_at`: Timestamp, when the user was created
- `updated_at`: Timestamp, when the user was last updated

### Translations Table

Stores translation data:

- `id`: UUID, primary key
- `user_id`: UUID, foreign key to users table
- `source_language`: Text, source language code
- `target_language`: Text, target language code
- `original_text`: Text, the text to be translated
- `translated_text`: Text, the translated text (can be null)
- `status`: Text, one of 'pending', 'in-progress', 'completed'
- `word_count`: Integer, number of words in the original text
- `created_at`: Timestamp, when the translation was created
- `completed_at`: Timestamp, when the translation was completed (can be null)
- `updated_at`: Timestamp, when the translation was last updated

### Health Check Table

Used for testing the database connection:

- `id`: Serial, primary key
- `status`: Text, always 'ok'
- `created_at`: Timestamp, when the record was created

## API Endpoints

The API endpoints remain the same as before, but now they interact with Supabase instead of MongoDB:

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user
- `GET /api/auth/me`: Get the current user's information
- `GET /api/translations`: Get all translations for the current user
- `GET /api/translations/:id`: Get a specific translation
- `POST /api/translations`: Create a new translation
- `PUT /api/translations/:id`: Update a translation
- `DELETE /api/translations/:id`: Delete a translation

## Troubleshooting

If you encounter issues with the Supabase connection:

1. Verify that your Supabase URL and API key are correct in the `.env` file.
2. Check that the SQL schema has been properly executed in your Supabase project.
3. Ensure that your Supabase project is active and not in maintenance mode.
4. Check the server logs for specific error messages.

For more help, refer to the [Supabase documentation](https://supabase.com/docs).
