# Movies API - FastAPI CRUD

Basic REST API for managing movies using FastAPI.

## Features

- Framework: FastAPI
- Language: Python 3.13
- Complete CRUD operations
- Automatic documentation with Swagger UI
- Data validation with Pydantic
- SQLAlchemy ORM integration
- SQLite database

## Pre-installation requiment:

* Python 3: version >= 3.12 
* IDE or Code Editor

## Installation

1. Create a virtual environment (optional but recommended):

`python3 -m venv .venv` or `python -m venv .venv`

2. Activate virtual env
- For Windows CDM: `.\.venv\Scripts\activate.bat`
- For Unix or MacOS: `source .venv/bin/activate`

3. Install required packages

`python -m pip install -r requirements.txt`

4. Start the app using Uvicorn

`uvicorn main:app --reload --host 0.0.0.0 --port 8000`

## Check documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
