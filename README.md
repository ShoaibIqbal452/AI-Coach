# AI Coach

A full-stack AI chatbot application for gym goers to receive personalized workout and diet plans.

## Tech Stack

- **Frontend:** React / Next.js
- **Backend:** FastAPI (Python)
- **AI Model:** OpenAI GPT-4
- **Database:** PostgreSQL
- **Deployment:** AWS

## Features

- Chat-based interface for gym users
- Personalized workout and diet plan generation
- User authentication and history
- Deployment-ready with AWS configuration

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Deployment

Instructions for deploying on AWS will be added soon.
