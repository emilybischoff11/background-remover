# Background Remover Web App

A modern web application that removes backgrounds from images using AI. Built with React, TailwindCSS, Flask, rembg, and Supabase authentication.

## Features

- 🎨 Modern, beautiful UI with gradient design
- 🖼️ Drag and drop image upload
- ✨ AI-powered background removal
- 📥 Download processed images
- ⚡ Fast processing with real-time preview
- 📱 Responsive design
- 🔐 Secure authentication with Supabase

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Lucide React (icons)
- Axios
- Supabase (authentication)

### Backend
- Flask
- rembg (AI background removal)
- Pillow (image processing)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- pip
- Supabase account (for authentication)

### Backend Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Sign up or sign in with your email and password
3. Upload an image by clicking or dragging and dropping
4. Click "Remove Background" to process the image
5. Download the processed image with transparent background

## Deployment to Vercel

### 1. Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### 2. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add Environment Variables:
   - Click **"Environment Variables"**
   - Add:
     - `VITE_SUPABASE_URL` = Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

6. Click **"Deploy"**

### 3. Deploy Backend

The Flask backend needs to be deployed separately. Options:

**Option A: Railway**
1. Go to [Railway](https://railway.app)
2. Create new project from GitHub repo
3. Add Python service
4. Railway will auto-detect `requirements.txt`
5. Set start command: `python app.py`
6. Copy the deployed URL

**Option B: Render**
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`
5. Copy the deployed URL

### 4. Update API Endpoint

After deploying the backend, update `vite.config.js` with your backend URL:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://your-backend-url.com',  // Update this
      changeOrigin: true,
    },
  },
},
```

Or update the axios calls in `src/App.jsx` to use the full backend URL.

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API**
3. Copy your **Project URL** and **anon/public key**
4. Add them to your `.env` file (local) or Vercel environment variables (production)
5. Email confirmation is enabled by default - users will receive a confirmation email after signup
6. To disable email confirmation (for testing):
   - Go to **Authentication** → **Settings**
   - Disable **Enable email confirmations**

## Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## API Endpoints

### POST `/api/remove-background`
Removes the background from an uploaded image.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `image` (file)

**Response:**
- Success: PNG image with transparent background
- Error: JSON with error message

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Project Structure

```
.
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # TailwindCSS configuration
├── postcss.config.js     # PostCSS configuration
├── vercel.json           # Vercel deployment config
├── index.html            # HTML entry point
├── src/
│   ├── App.jsx           # Main React component
│   ├── Auth.jsx          # Authentication component
│   ├── main.jsx          # React entry point
│   ├── index.css         # Global styles
│   └── supabaseClient.js # Supabase configuration
└── README.md             # This file
```

## Notes

- The first time you run the backend, rembg will download the AI model (~176MB)
- Supported image formats: PNG, JPG, JPEG
- The processed image is always returned as PNG with transparency
- Authentication is required to access the app
- Users must verify their email before signing in (if email confirmation is enabled)

## License

MIT