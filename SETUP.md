# Setting up your TMDB API Key

## Step 1: Get a TMDB API Key

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account if you don't have one
3. Go to your account settings
4. Navigate to the API section
5. Request an API key (choose "Developer" for personal use)
6. Copy your API key

## Step 2: Configure the Environment Variable

### Option 1: Direct API Key
Replace the content of `.env.local` with:

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
```

### Option 2: Using your existing environment variable
If you have the API key stored as `TheMovie_DB__ApiKey` in your system, you can either:

1. **Set it directly in your environment:**
   - Windows: `set NEXT_PUBLIC_TMDB_API_KEY=%TheMovie_DB__ApiKey%`
   - macOS/Linux: `export NEXT_PUBLIC_TMDB_API_KEY=$TheMovie_DB__ApiKey`

2. **Or update the `.env.local` file manually** with the actual key value

## Step 3: Restart the Development Server

After updating the environment variable:

```bash
npm run dev
```

## Demo Mode

If you don't have an API key set up, the application will automatically use demo data with sample movies including:
- The Matrix
- Inception 
- Interstellar
- The Dark Knight
- Avengers: Endgame
- Spider-Man: No Way Home

This allows you to explore the UI and functionality without needing the API key immediately.

## Troubleshooting

- Make sure there are no spaces around the `=` in your `.env.local` file
- The API key should be the actual string, not a reference to another variable
- Restart the development server after making changes
- Check the browser console for any error messages