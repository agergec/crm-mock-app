# CRM Mock App Tutorial

This tutorial provides step-by-step instructions for setting up, running, and using the CRM Mock Application with its REST API features and GitHub Actions integration.

## Table of Contents
1. [Overview](#overview)
2. [Local Setup](#local-setup)
3. [Using the Application](#using-the-application)
4. [REST API Documentation](#rest-api-documentation)
5. [GitHub Actions Workflow](#github-actions-workflow)
6. [Testing Examples](#testing-examples)

---

## Overview

The CRM Mock App is a lightweight Flask application that:
- Displays user information from a JSON database
- Accepts query parameters to filter and display data
- Provides a REST API endpoint to retrieve user data in JSON format
- Runs automated tests via GitHub Actions

### Features
- **Web Interface (SPA)**: Browse user data through query parameters
- **REST API**: Access user data programmatically via JSON endpoints
- **CI/CD**: Automated testing with GitHub Actions

---

## Local Setup

### Prerequisites
- Python 3.11 or higher
- pip (Python package manager)
- Git (for version control)

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd crm-mock-app
```

### Step 2: Create a Virtual Environment (Recommended)
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the Application
```bash
python3 app.py
```

The application will start on `http://localhost:5001`

---

## Using the Application

### Web Interface (Browser)

#### 1. Home Page
Visit the root URL to see the dashboard:
```
http://localhost:5001/
```

#### 2. Display Query Parameters
Add any query parameters to see them displayed in the "Incoming Parameters" pane:
```
http://localhost:5001/?client=Acme&status=Active&priority=High
```

This will display a table showing all the parameters you sent.

#### 3. User Lookup by Numeric ID
Use the `user_qry` parameter to find a user by their numeric ID:
```
http://localhost:5001/?user_qry=1
```

This displays detailed information about user ID 1 in the "User Details" pane, including:
- Name, username, email, phone, website
- Company information
- Address details

#### 4. User Lookup by Text ID
Use the `user_qry_txt` parameter to find a user by their text ID:
```
http://localhost:5001/?user_qry_txt=5
```

#### 5. Direct User Page
Navigate directly to a user's page (returns HTML in browser):
```
http://localhost:5001/users/1
```

---

## REST API Documentation

### Base URL
```
http://localhost:5001
```

### Endpoint: Get User by ID

**URL**: `/users/<user_id>`

**Method**: `GET`

**Content-Type Detection**: The endpoint automatically detects whether to return JSON or HTML based on the `Accept` header:
- **API clients** (with `Accept: application/json`): Returns JSON
- **Web browsers**: Returns HTML page

#### Request Example (JSON API)
```bash
curl -H "Accept: application/json" http://localhost:5001/users/1
```

#### Success Response (200 OK)
```json
{
  "id_txt": "1",
  "id": 1,
  "name": "Sokrates Augustus",
  "username": "sokrates",
  "email": "s.augustus@erde.planet.99",
  "address": {
    "street": "Lagoon Drift",
    "suite": "Apt. 102",
    "city": "Nuku Harbor",
    "zipcode": "88921",
    "geo": {
      "lat": "-17.6500",
      "lng": "-149.4260"
    }
  },
  "phone": "123-456-789-012-34",
  "website": "erde.planet.99",
  "company": {
    "name": "Quantum Arc Systems",
    "catchPhrase": "Adaptive quantum-driven microservices",
    "bs": "optimize multi-cloud synergies"
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "error": "User not found",
  "user_id": "999"
}
```

### Available User IDs
The database contains users with IDs from 1 to 10. You can query any of these:
- `/users/1` through `/users/10`

---

## GitHub Actions Workflow

The application includes a comprehensive GitHub Actions workflow that automatically tests the application on every push and pull request.

### Workflow File Location
```
.github/workflows/run-flask-app.yml
```

### What It Does

The workflow performs the following steps:

1. **Setup Environment**
   - Checks out the code
   - Sets up Python 3.11
   - Installs dependencies from `requirements.txt`

2. **Start Application**
   - Runs the Flask app in the background
   - Waits for the app to initialize

3. **Health Checks**
   - Tests the root endpoint (`/`)
   - Tests query parameter functionality (`/?user_qry=1`)
   - Tests JSON API endpoint for valid user
   - Tests JSON API 404 handling for non-existent user

4. **Cleanup**
   - Stops the Flask application

### Triggering the Workflow

The workflow runs automatically on:
- **Push** to `main` or `master` branch
- **Pull requests** targeting `main` or `master` branch
- **Manual trigger** via GitHub Actions UI (workflow_dispatch)

### Viewing Workflow Results

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Select the **"Run Flask CRM Mock App"** workflow
4. View the results of each run

### Manual Trigger Steps

1. Navigate to **Actions** tab in your GitHub repository
2. Click on **"Run Flask CRM Mock App"** workflow
3. Click **"Run workflow"** button
4. Select the branch and click **"Run workflow"**

---

## Testing Examples

### Local Testing

#### Test 1: Root Endpoint
```bash
curl http://localhost:5001/
```
**Expected**: HTML page with dashboard

#### Test 2: Query Parameters
```bash
curl "http://localhost:5001/?client=Acme&status=Active"
```
**Expected**: HTML page showing the parameters in a table

#### Test 3: User Lookup (Browser Style)
```bash
curl "http://localhost:5001/?user_qry=1"
```
**Expected**: HTML page with user details for user ID 1

#### Test 4: JSON API - Valid User
```bash
curl -H "Accept: application/json" http://localhost:5001/users/1
```
**Expected**: JSON object with user data

#### Test 5: JSON API - Content Type
```bash
curl -i -H "Accept: application/json" http://localhost:5001/users/1 | grep Content-Type
```
**Expected**: `Content-Type: application/json`

#### Test 6: JSON API - Invalid User
```bash
curl -H "Accept: application/json" http://localhost:5001/users/999
```
**Expected**: 404 error with JSON error message

#### Test 7: JSON API - Pretty Print
```bash
curl -H "Accept: application/json" http://localhost:5001/users/1 | python3 -m json.tool
```
**Expected**: Formatted JSON output

#### Test 8: Browser Request (HTML)
```bash
curl http://localhost:5001/users/1
```
**Expected**: HTML page (without Accept header, defaults to HTML)

### Testing All Users
```bash
# Loop through all users
for i in {1..10}; do
  echo "Testing user $i:"
  curl -s -H "Accept: application/json" http://localhost:5001/users/$i | python3 -m json.tool | head -5
  echo "---"
done
```

### Using HTTPie (Alternative to curl)
If you have HTTPie installed:
```bash
# Install HTTPie
pip install httpie

# Test JSON API
http GET localhost:5001/users/1 Accept:application/json

# Test without Accept header (gets HTML)
http GET localhost:5001/users/1
```

### Using Python Requests
```python
import requests

# Test JSON API
response = requests.get(
    'http://localhost:5001/users/1',
    headers={'Accept': 'application/json'}
)
print(response.json())

# Test HTML response
response = requests.get('http://localhost:5001/users/1')
print(response.text[:200])  # First 200 characters of HTML
```

---

## Troubleshooting

### Port Already in Use
If port 5001 is already in use, modify the last line in `app.py`:
```python
app.run(debug=True, port=5002)  # Change to any available port
```

### Module Not Found
If you get "Module not found" errors:
```bash
# Ensure you're in the virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### people.json Not Found
Ensure the `people.json` file exists at:
```
crm-mock-app/crm-spa/people.json
```

### GitHub Actions Failing
1. Check the Actions tab for detailed error logs
2. Ensure `requirements.txt` is up to date
3. Verify the workflow file syntax in `.github/workflows/run-flask-app.yml`

---

## Next Steps

- **Add Authentication**: Implement API key authentication for the REST API
- **Add More Endpoints**: Create endpoints for filtering, searching, or updating users
- **Database Integration**: Replace JSON file with a proper database (SQLite, PostgreSQL)
- **Rate Limiting**: Add rate limiting to the API endpoints
- **API Documentation**: Generate interactive API docs with Swagger/OpenAPI
- **Docker Support**: Use the included Dockerfile for containerized deployment

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the GitHub Actions logs for detailed error messages
3. Examine the application logs in the terminal where Flask is running
