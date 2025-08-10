# ✅ Loackin Setup Checklist

## Before You Start
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] OpenAI API key ready
- [ ] Google OAuth credentials ready (optional)

## Quick Setup (Recommended)
1. [ ] Run the quick start script: `./quick-start.sh`
2. [ ] Follow the prompts to configure your API keys
3. [ ] Wait for both servers to start
4. [ ] Open http://localhost:3000 in your browser

## Manual Setup (Alternative)
### Backend
1. [ ] `cd backend`
2. [ ] `pip install -r requirements.txt`
3. [ ] `cp env.template .env`
4. [ ] Edit `.env` with your API keys
5. [ ] `python setup.py`
6. [ ] `uvicorn app.main:app --reload --port 8000`

### Frontend
1. [ ] `cd frontend`
2. [ ] `npm install`
3. [ ] `npm run dev`

## Verification
- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:3000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Can send messages in AI chat
- [ ] Database initialized successfully

## Troubleshooting
- [ ] Check console for error messages
- [ ] Verify API keys in `.env` file
- [ ] Ensure ports 8000 and 3000 are available
- [ ] Run `python setup.py` if database issues occur

## Next Steps
- [ ] Explore the application features
- [ ] Customize AI prompts if desired
- [ ] Test different study tools
- [ ] Consider deployment options

---
**Need help?** Check the detailed `SETUP.md` guide or run `python backend/setup.py` for diagnostics. 