# Implementation Plan: CRM Mock App Consolidation

## Overview
Consolidate duplicate files and add help functionality with embedded favicon to the CRM mock app.

---

## Current State Analysis

### Duplicate Files (IDENTICAL - confirmed via file comparison)
| Root File | crm-spa/ File | Status |
|-----------|---------------|--------|
| `index.html` | `crm-spa/index.html` | IDENTICAL |
| `app.js` | `crm-spa/app.js` | IDENTICAL |
| `style.css` | `crm-spa/style.css` | IDENTICAL |
| `people.json` | `crm-spa/people.json` | IDENTICAL |

### Flask-Specific Files (to keep)
- `static/css/style.css` - Flask styles (slightly different sidebar width: 240px vs 180px)
- `templates/base.html` - Flask base template
- `templates/index.html` - Flask content template with Jinja2
- `app.py` - Flask application

---

## Proposed Changes

### Phase 1: Remove Duplicate crm-spa/ Folder
**Rationale**: Since root files and crm-spa/ files are identical, we can:
1. Delete the entire `crm-spa/` folder
2. Update `app.py` to serve files from root instead of `crm-spa/`

**Files to delete**:
- `crm-spa/index.html`
- `crm-spa/app.js`
- `crm-spa/style.css`
- `crm-spa/people.json`
- `crm-spa/` (directory itself)

**Files to modify**:
- `app.py`:
  - Line 10: Change `'crm-spa', 'people.json'` to just `'people.json'`
  - Line 49: Change `'crm-spa', 'index.html'` to just `'index.html'`
  - Line 57: Change spa_dir to project root directory

### Phase 2: Add Embedded Favicon to index.html
Add a base64-encoded SVG favicon directly in the `<head>` section. Will use a simple CRM-themed icon (grid/dashboard style).

**Location**: After line 7 (after viewport meta tag), before title tag

### Phase 3: Add Help Section to index.html
Add a collapsible help card within the existing widgets-grid that explains:
- SPA mode usage (query string parameters)
- Special parameters: `user_qry` and `user_qry_txt`
- Web service mode (Python/Flask endpoints)

**Design approach**:
- Use existing `.card` CSS class for consistency
- Add a "Help" navigation link in sidebar
- Help content as a new card with expandable sections
- JavaScript to toggle help visibility

---

## Detailed Implementation Steps

### Step 1: Backup consideration
- Git status is clean, current commit: `aab2cf1`
- All changes can be rolled back with `git checkout .` or `git reset --hard aab2cf1`

### Step 2: Update app.py
```python
# Line 10: Change from
file_path = os.path.join(os.path.dirname(__file__), 'crm-spa', 'people.json')
# To
file_path = os.path.join(os.path.dirname(__file__), 'people.json')

# Line 49: Change from
spa_path = os.path.join(os.path.dirname(__file__), 'crm-spa', 'index.html')
# To
spa_path = os.path.join(os.path.dirname(__file__), 'index.html')

# Line 57: Change from
spa_dir = os.path.join(os.path.dirname(__file__), 'crm-spa')
# To
spa_dir = os.path.dirname(__file__)
```

### Step 3: Delete crm-spa/ folder
```bash
rm -rf crm-spa/
```

### Step 4: Add favicon to index.html
Insert after line 7:
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%233b82f6' width='100' height='100' rx='20'/><rect fill='white' x='15' y='15' width='30' height='30' rx='5'/><rect fill='white' x='55' y='15' width='30' height='30' rx='5'/><rect fill='white' x='15' y='55' width='30' height='30' rx='5'/><rect fill='white' x='55' y='55' width='30' height='30' rx='5'/></svg>">
```

### Step 5: Add Help section to index.html
- Add "Help" link to sidebar navigation
- Add help card with usage information
- Add minimal JavaScript for toggle functionality

---

## Two Working Modes (Documentation for Help section)

### Mode 1: SPA Mode (Static Files)
- **How to use**: Open `index.html` directly in browser or serve via any HTTP server
- **No server required**: Pure client-side JavaScript
- **Query parameters**: Any `?key=value` pairs display in "Incoming Parameters" table
- **Special parameters**:
  - `?user_qry=<id>` - Lookup user by numeric ID (1-10)
  - `?user_qry_txt=<text_id>` - Lookup user by text ID
- **Example URLs**:
  - `index.html?client=Acme&status=Active`
  - `index.html?user_qry=1`
  - `index.html?user_qry_txt=5`

### Mode 2: Web Service Mode (Flask/Python)
- **How to use**: Run `python app.py` then access `http://localhost:5001/`
- **Requires**: Python 3.11+, Flask
- **Endpoints**:
  - `GET /` - Main dashboard with query parameter support
  - `GET /users/<id>` - REST API returning JSON user data
  - `GET /spa` - Serves the standalone SPA
- **Example**:
  - `http://localhost:5001/?user_qry=1`
  - `http://localhost:5001/users/1` (returns JSON)

---

## Rollback Strategy
If issues occur:
```bash
git checkout .           # Discard all changes
git reset --hard aab2cf1 # Reset to initial commit
```

---

## Files Changed Summary
| Action | File |
|--------|------|
| MODIFY | `app.py` (3 path changes) |
| MODIFY | `index.html` (add favicon + help section) |
| MODIFY | `app.js` (add help toggle function) |
| DELETE | `crm-spa/` folder (4 files) |

---

## Verification Steps
1. Test SPA mode: Open `index.html` directly in browser
2. Test with parameters: `index.html?user_qry=1`
3. Test Flask mode: `python app.py`, visit `http://localhost:5001/`
4. Test REST API: `curl http://localhost:5001/users/1`
5. Test SPA via Flask: `http://localhost:5001/spa`
6. Verify favicon appears in browser tab
7. Verify help section toggles correctly
