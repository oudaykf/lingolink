# LingoLink Authentication System

This document provides instructions on how to set up and use the authentication system for LingoLink.

## Setup Instructions

### 1. Database Setup

The authentication system uses Supabase as the database. You need to set up the database tables before using the authentication system.

1. Go to the [Supabase dashboard](https://app.supabase.com/) and open your project.
2. Navigate to the SQL Editor.
3. Copy the contents of `server/setup-tables.sql` and run it in the SQL Editor.
4. This will create the necessary tables and functions for the authentication system.

### 2. Environment Variables

Make sure your `.env` file in the server directory has the following variables:

```
PORT=5000
SUPABASE_URL=https://llbuabszimfttksresdw.supabase.co
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```

Replace `your_supabase_anon_key` with your actual Supabase anon key and `your_jwt_secret` with a secure random string.

### 3. Start the Server

```
cd server
npm install
node server.js
```

### 4. Start the Client

```
cd client
npm install
npm start
```

## Testing the Authentication System

You can test the authentication system using the provided test HTML file:

1. Open `client/public/auth-test.html` in your browser.
2. Use the form to register, login, and check email availability.

## Authentication Features

The authentication system includes the following features:

### 1. User Registration

- Users can register as either a client or a translator.
- Email addresses must be unique across all user types.
- A user cannot register with the same email address as both a client and a translator.

### 2. User Login

- Users must create an account before they can log in.
- The system validates the email and password.

### 3. Email Validation

- The system checks if an email is already registered.
- If an email is already registered as a client, it cannot be used to register as a translator, and vice versa.

## API Endpoints

### Register

```
POST /api/auth/register
```

Request body:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "userType": "client" // or "translator"
}
```

### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Check Email

```
POST /api/auth/check-email
```

Request body:
```json
{
  "email": "user@example.com"
}
```

### Check Email with User Type

```
POST /api/auth/check-email-type
```

Request body:
```json
{
  "email": "user@example.com",
  "userType": "client" // or "translator"
}
```

## Troubleshooting

If you encounter issues with the authentication system:

1. Check that the Supabase tables are properly set up.
2. Verify that your environment variables are correct.
3. Check the server logs for error messages.
4. Make sure the client is properly configured to connect to the server.
