# 🚀 Loackin Setup Guide

This guide will walk you through setting up your Loackin study assistant application step by step.

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ installed
- OpenAI API key
- Google OAuth credentials (optional, for enhanced authentication)

## Step 1: Backend Setup

### 1.1 Install Python Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
pip install -r requirements.txt
```

### 1.2 Configure Environment Variables

1. Copy the environment template:
   ```bash
   cp env.template .env
   ```

2. Edit the `.env` file with your actual values:
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Required**: Set your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   ```

4. **Required**: Generate a secure secret key:
   ```
   SECRET_KEY=your-super-secure-random-string-here
   ```

5. **Optional**: Google OAuth credentials (if you want Google login):
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### 1.3 Run the Setup Script

The setup script will verify your configuration and initialize the database:

```bash
python setup.py
```

This script will:
- ✅ Check your environment variables
- ✅ Initialize the database
- ✅ Test your OpenAI API connection

### 1.4 Start the Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000

Your backend will be running at `http://localhost:8000`

## Step 2: Frontend Setup

### 2.1 Install Node.js Dependencies

Navigate to the frontend directory and install packages:

```bash
cd ../frontend
npm install
```

### 2.2 Start the Frontend Development Server

```bash
npm run dev
```

Your frontend will be running at `http://localhost:3000`

## Step 3: Verify Everything is Working

1. **Backend API**: Visit `http://localhost:8000/docs` to see the FastAPI documentation
2. **Frontend**: Open `http://localhost:3000` in your browser
3. **AI Chat**: Try sending a message in the chat interface

## Troubleshooting

### Common Issues

#### OpenAI API Key Issues
- **Error**: "OpenAI API key not configured"
- **Solution**: Make sure your `.env` file has `OPENAI_API_KEY=sk-your-key-here`

#### Database Issues
- **Error**: "Database connection failed"
- **Solution**: Run `python setup.py` to initialize the database

#### Port Already in Use
- **Error**: "Port 8000 is already in use"
- **Solution**: Change the port: `uvicorn app.main:app --reload --port 8001`

#### Frontend Build Issues
- **Error**: "Module not found"
- **Solution**: Run `npm install` in the frontend directory

### Getting Your API Keys

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to "API Keys" in the sidebar
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

#### Google OAuth Credentials (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs: `http://localhost:3000/auth/google/callback`
7. Copy the Client ID and Client Secret

## Project Structure

```
loackin/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routers/        # API endpoints
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   └── config.py       # Configuration
│   ├── requirements.txt    # Python dependencies
│   ├── setup.py           # Setup script
│   └── main.py            # FastAPI app entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── services/      # API service functions
│   ├── package.json       # Node.js dependencies
│   └── index.html         # HTML entry point
└── README.md              # This file
```

## Next Steps

Once everything is running:

1. **Explore the app**: Try different features like AI chat, calendar, and study planning
2. **Customize**: Modify the AI prompts in `backend/app/routers/ai_chat.py`
3. **Deploy**: When ready, deploy to platforms like Heroku, Railway, or Vercel
4. **Enhance**: Add more AI features, integrations, or study tools

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the console logs for error messages

## Security Notes

- Never commit your `.env` file to version control
- Keep your API keys secure and rotate them regularly
- Use strong, unique secret keys in production
- Consider using environment variables in production deployments

---

🎉 **Congratulations!** You now have a fully functional AI-powered study assistant running locally! 