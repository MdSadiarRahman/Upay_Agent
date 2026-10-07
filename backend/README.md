# UpayPulse AI Backend

This is a FastAPI backend to support the UpayPulse AI React frontend.

## Architecture
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **Authentication**: JWT token with role-based access control
- **Security**: bcrypt password hashing

## Getting Started

1. Set up your Python environment:
```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure your database:
Set the `DATABASE_URL` environment variable to your PostgreSQL instance in a `.env` file (or just use the default).

4. Start the server:
```bash
uvicorn main:app --reload
```

5. The API will be available at `http://localhost:8000`. You can view the swagger documentation at `http://localhost:8000/docs`.

## Integration with React Frontend
Ensure the React frontend makes requests to `http://localhost:8000` via Axios or fetch instead of using hardcoded mock data.
