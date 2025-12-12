# CRM Mock App

A lightweight Flask-based mock CRM (Customer Relationship Management) application designed for testing, demonstrations, and development purposes. This application provides both a web interface and a REST API for managing user data.

## Purpose

This mock CRM app serves as:
- **Testing Tool** - Simulate CRM interactions without a full production system
- **API Endpoint Provider** - RESTful API for integration testing
- **Learning Resource** - Simple example of Flask web application with REST API
- **Demo Application** - Showcase CRM features with mock data
- **Development Base** - Starting point for building CRM-like applications

## Features

### 🌐 Web Interface
- Display query parameters dynamically
- User lookup by numeric ID or text ID
- Clean, modern UI with sidebar navigation
- Responsive dashboard layout

### 🔌 REST API
- **GET `/users/<id>`** - Retrieve user data in JSON format
- Proper HTTP status codes (200 for success, 404 for not found)
- Clean JSON responses

### 📱 Standalone SPA
- Client-side single-page application
- Works without backend server
- JavaScript-based user lookup
- Accessible via `/spa` route

### ✅ Automated Testing
- GitHub Actions workflow for CI/CD
- Automated endpoint testing
- Health checks for all routes

## Quick Start

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/agergec/crm-mock-app.git
   cd crm-mock-app
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python3 app.py
   ```

5. **Access the app**
   - Open your browser to `http://localhost:5001`

## Usage

### Web Interface

#### Home Page
```
http://localhost:5001/
```
Displays the main dashboard with incoming parameters.

#### Query Parameters
```
http://localhost:5001/?client=Acme&status=Active&priority=High
```
Any query parameters are displayed in a table on the dashboard.

#### User Lookup by Numeric ID
```
http://localhost:5001/?user_qry=1
```
Displays detailed information for user with ID 1.

#### User Lookup by Text ID
```
http://localhost:5001/?user_qry_txt=5
```
Displays detailed information for user with text ID "5".

### REST API

#### Get User by ID

**Endpoint:** `GET /users/<id>`

**Example Request:**
```bash
curl http://localhost:5001/users/1
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "id_txt": "1",
  "name": "Sokrates Augustus",
  "username": "sokrates",
  "email": "s.augustus@erde.planet.99",
  "phone": "123-456-789-012-34",
  "website": "erde.planet.99",
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
  "company": {
    "name": "Quantum Arc Systems",
    "catchPhrase": "Adaptive quantum-driven microservices",
    "bs": "optimize multi-cloud synergies"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found",
  "user_id": "999"
}
```

#### Available User IDs
The application includes 10 mock users with IDs from 1 to 10.

### Standalone SPA

Access the standalone single-page application:
```
http://localhost:5001/spa?user_qry=1
```

The SPA provides the same functionality as the main web interface but runs entirely client-side.

## Project Structure

```
crm-mock-app/
├── .github/
│   └── workflows/
│       └── run-flask-app.yml    # GitHub Actions CI/CD
├── crm-spa/                     # Standalone SPA
│   ├── index.html              # SPA HTML
│   ├── app.js                  # SPA JavaScript
│   ├── style.css               # SPA styles
│   └── people.json             # User data
├── static/
│   └── css/
│       └── style.css           # Flask app styles
├── templates/
│   ├── base.html               # Base template
│   └── index.html              # Main template
├── app.py                      # Flask application
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
├── TUTORIAL.md                 # Detailed tutorial
└── README.md                   # This file
```

## API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Main dashboard with query parameter display |
| GET | `/?user_qry=<id>` | User lookup by numeric ID (web view) |
| GET | `/?user_qry_txt=<id>` | User lookup by text ID (web view) |
| GET | `/users/<id>` | Get user by ID (JSON API) |
| GET | `/spa` | Standalone SPA version |

### Response Format

All API responses use JSON format with appropriate HTTP status codes:
- **200 OK** - Successful request
- **404 Not Found** - User does not exist

## Development

### Running Tests Locally

The application includes automated tests via GitHub Actions. To verify functionality:

```bash
# Start the app
python3 app.py

# In another terminal, test endpoints
curl http://localhost:5001/
curl http://localhost:5001/users/1
curl http://localhost:5001/users/999  # Should return 404
```

### Modifying User Data

Edit `crm-spa/people.json` to add, remove, or modify mock users. The file contains an array of user objects with the following structure:

```json
{
  "id": 1,
  "id_txt": "1",
  "name": "Full Name",
  "username": "username",
  "email": "email@example.com",
  "phone": "phone-number",
  "website": "website.com",
  "address": { ... },
  "company": { ... }
}
```

### Adding New Endpoints

To add new API endpoints, edit `app.py`:

```python
@app.route('/your-endpoint')
def your_endpoint():
    # Your logic here
    return jsonify({"message": "Hello World"}), 200
```

## Continuous Integration

The project uses GitHub Actions for automated testing. On every push to the `main` branch:

1. ✅ Sets up Python environment
2. ✅ Installs dependencies
3. ✅ Starts Flask application
4. ✅ Tests all endpoints
5. ✅ Verifies correct responses

View workflow results at: `https://github.com/agergec/crm-mock-app/actions`

## Technologies Used

- **Backend:** Flask (Python web framework)
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Data:** JSON file storage
- **CI/CD:** GitHub Actions
- **Server:** Gunicorn (production-ready WSGI server)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is available under the terms specified in the LICENSE file.

## Support

For detailed usage instructions and troubleshooting, see [TUTORIAL.md](TUTORIAL.md).

---

**Note:** This is a mock application intended for testing and demonstration purposes. It uses a simple JSON file for data storage and is not suitable for production use without significant modifications.