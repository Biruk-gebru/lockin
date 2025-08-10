#!/bin/bash

echo "🚀 Loackin Quick Start Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Step 1: Backend Setup
echo ""
echo "📦 Setting up backend..."
cd backend

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

# Check if .env exists, if not create from template
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp env.template .env
    echo "⚠️  Please edit .env file with your API keys before continuing!"
    echo "   Required: OPENAI_API_KEY and SECRET_KEY"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
fi

# Run setup script
echo "Running setup script..."
python3 setup.py

# Start backend in background
echo "Starting backend server..."
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Step 2: Frontend Setup
echo ""
echo "🌐 Setting up frontend..."
cd ../frontend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Start frontend in background
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Your application is now running:"
echo "  • Backend: http://localhost:8000"
echo "  • Frontend: http://localhost:3000"
echo "  • API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servers stopped. Goodbye!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait 