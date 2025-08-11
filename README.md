# AI Gym Coach

A comprehensive AI-powered fitness coaching platform that provides personalized workout plans, diet recommendations, and progress tracking for gym enthusiasts of all levels.


## Features

### Core Features
- **AI Chat Assistant**: Interact with an AI coach to get personalized fitness advice and answers to your questions
- **Personalized Plan Generation**: Create customized workout and diet plans based on your goals, fitness level, and preferences
- **Progress Tracking**: Log and visualize your fitness journey with metrics like weight, body measurements, and workout performance
- **AI Progress Analysis**: Get AI-powered insights and recommendations based on your progress data
- **Adaptive Plans**: Receive automatically adjusted workout plans based on your progress and feedback
- **User Profiles**: Store your fitness goals, preferences, and health information for personalized experiences

### Technical Features
- **JWT Authentication**: Secure user authentication and authorization
- **Responsive UI**: Material UI-based responsive design that works on all devices
- **Docker Containerization**: Easy setup and deployment with Docker
- **API Documentation**: Comprehensive API documentation with Swagger UI
- **Database Integration**: PostgreSQL database for reliable data storage

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: Material UI (MUI)
- **State Management**: React Context API
- **API Client**: Fetch API

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy
- **Authentication**: JWT with OAuth2
- **AI Integration**: OpenAI API (GPT-3.5/4)

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development**: Hot-reloading for both frontend and backend

## 🛠️ Setup and Installation

### Prerequisites
- Docker and Docker Compose
- OpenAI API key

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-coach.git
cd ai-coach
```

2. Create a `.env` file in the root directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ai_coach
SECRET_KEY=your_secret_key_for_jwt
```

3. Start the application using Docker Compose:
```bash
docker-compose up -d
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with the following variables:
```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://postgres:postgres@localhost/ai_coach
SECRET_KEY=your_secret_key_for_jwt
```

5. Run the backend server:
```bash
uvicorn app.main:app --reload
```

#### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Usage Guide

### Getting Started

1. **Register/Login**: Create an account or log in to access the app's features
2. **Complete Your Profile**: Fill in your fitness profile with goals, current fitness level, and preferences
3. **Chat with AI Coach**: Ask questions or request personalized plans from the AI assistant
4. **Track Your Progress**: Log your workouts, measurements, and other fitness metrics
5. **View Analysis**: Check the Progress Analysis tab for AI-powered insights and recommendations

### Key Workflows

- **Creating a Plan**: Chat with the AI assistant and ask for a workout or diet plan based on your goals
- **Logging Progress**: Use the Progress tab to record your measurements and workout results
- **Getting Insights**: Visit the Analysis tab to see AI-generated insights about your progress
- **Adapting Plans**: Request adaptive plans based on your progress data

## Testing

### Backend Tests
```bash
cd backend
python -m pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## API Documentation

The API documentation is available at http://localhost:8000/docs when the backend is running.

