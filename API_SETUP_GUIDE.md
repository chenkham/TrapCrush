# Trap Your Crush - API Setup Guide

To unlock the full potential of the Custom Canvas Builder, you can provide API keys for various media providers. If no keys are provided, the builder will fall back to built-in open-source collections.

## How to Configure

1. Create a file named `.env` in the root folder of this project.
2. Add your API keys using the variable names listed below.
3. Restart your development server (`npm run dev`).

```env
# Background APIs
VITE_PEXELS_API_KEY=your_key_here
VITE_PIXABAY_API_KEY=your_key_here

# Sticker & Icon APIs
VITE_GIPHY_API_KEY=your_key_here
VITE_ICONFINDER_API_KEY=your_key_here
```

---

## Where to get your keys (100% Free!)

### 1. Pexels API (Backgrounds)
1. Go to [Pexels API](https://www.pexels.com/api/)
2. Create an account or log in.
3. Click on "Your API Key" in the dashboard.
4. Copy the key and assign it to `VITE_PEXELS_API_KEY`.

### 2. Pixabay API (Backgrounds & Stickers)
1. Go to [Pixabay API Documentation](https://pixabay.com/api/docs/)
2. Create an account and log in.
3. Scroll down on the documentation page to the "Parameters" section to find your personal API key highlighted in green.
4. Copy the key and assign it to `VITE_PIXABAY_API_KEY`.

### 3. Giphy API (Animated Stickers)
1. Go to [Giphy Developers](https://developers.giphy.com/)
2. Create an account and log in.
3. Click "Create an App".
4. Select "API" (not SDK), give it a name, and create it.
5. Copy the generated API Key and assign it to `VITE_GIPHY_API_KEY`.

### 4. Iconfinder API (Premium & Free Icons)
1. Go to [Iconfinder Developer Dashboard](https://www.iconfinder.com/account/applications)
2. Create an account and log in.
3. Click "New application".
4. Go to your application settings and find the "API Secret" or "API Key". *Note: Since this is a client-side app, using Iconfinder directly might require CORS proxy or public JWT token setup. If CORS fails, use Pixabay/OpenMoji.*
5. Assign the key to `VITE_ICONFINDER_API_KEY`.

---

## Open Source Providers (No Keys Required)
The following providers are built directly into the app and require no setup!
- **OpenMoji**
- **Noto Emoji**
- **Bootstrap Icons**
