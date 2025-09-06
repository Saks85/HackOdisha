# Supabase Setup Guide

This application uses Supabase for authentication and database management. Follow these steps to set up Supabase:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Create a new project
4. Choose a name and database password
5. Select a region close to your users

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **anon public** key
3. These will be used in your environment variables

## 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace the placeholder values with your actual Supabase credentials.

## 4. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the SQL script from `supabase/create_profiles.sql` to create the profiles table and triggers

## 5. Configure Authentication Providers (Optional)

If you want to use OAuth providers (Google, GitHub):

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Enable the providers you want to use
3. Configure the OAuth settings for each provider

## 6. Test the Setup

1. Start the development server: `pnpm dev`
2. Navigate to `/signup` to test user registration
3. Navigate to `/login` to test user authentication

## Troubleshooting

### Common Issues

1. **"Supabase client not initialized" error**
   - Check that your `.env` file exists and contains the correct variables
   - Ensure the environment variables are prefixed with `VITE_`
   - Restart your development server after adding environment variables

2. **OAuth not working**
   - Verify that OAuth providers are enabled in your Supabase dashboard
   - Check that redirect URLs are configured correctly
   - Ensure your domain is added to the allowed origins

3. **Database errors**
   - Make sure you've run the SQL script from `supabase/create_profiles.sql`
   - Check that Row Level Security policies are configured if needed

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the console for detailed error messages
- Check the Network tab in your browser's developer tools for API errors
