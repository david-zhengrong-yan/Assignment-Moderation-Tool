# Assignment Moderation Tool

![License](https://img.shields.io/badge/license-Restricted%20Use-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.3-blue.svg)
[![Build](https://github.com/david-zhengrong-yan/Assignment-Moderation-Tool/actions/workflows/ci.yml/badge.svg)](https://github.com/david-zhengrong-yan/Assignment-Moderation-Tool/actions/workflows/ci.yml)

![Python](https://img.shields.io/badge/Python-3.12-blue.svg)
![Django](https://img.shields.io/badge/Django-5.0-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![HTML](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-orange.svg)

![Deployment](https://img.shields.io/badge/Deployed%20on-Render-blue.svg)
![Plan](https://img.shields.io/badge/Plan-Free-lightgrey.svg)

![Client](https://img.shields.io/badge/Client-Deakin%20University%20School%20of%20Psychology-purple.svg)
![Team](https://img.shields.io/badge/Developed%20by-[Group%2077]-brightgreen.svg)

COMP30022 IT Project — Deakin University Psychology Department  
Developed for **Carrie Ewin**, Psychology Lecturer at Deakin University. A web-based system for automating assignment moderation workflows at Deakin University.

---

## Overview

The **Assignment Moderation Tool** is a full-stack web platform designed to automate the marking moderation workflow used in Deakin University’s School of Psychology.

Each semester, Carrie coordinates approximately **10 tutors** who all mark the same student assignments.  
Currently, moderation involves Excel spreadsheets, email comparisons, and manual difference calculations — an error-prone and time-consuming process.

This project replaces those manual steps with an integrated digital system that:

- Hosts assignments and rubrics in one place,  
- Allows **all tutors** to mark the **same assignments**,  
- Automatically aggregates and analyzes tutor marks,  
- Highlights inconsistencies, and  
- Generates performance analytics for the professor.

---

## Objectives

| Goal | Description |
|------|--------------|
| **Automate manual processes** | Replace spreadsheets, manual calculations, and email-based workflows with a web platform. |
| **Improve marking consistency** | Centralize marking to make cross-tutor comparison automatic. |
| **Increase transparency** | Allow professors to view tutor performance analytics at a glance. |
| **Reduce workload** | Automatically compute differences, averages, and outlier tutors. |

---

## Client & Requirements

### Client
**Carrie Ewin** — Psychology Lecturer, Deakin University

### Project Brief
Every semester, Carrie manages 10+ tutors who grade the same assignments.  
Currently, ensuring consistency is handled through Excel and manual checking,  
requiring hours of repetitive comparison and feedback.

**This project’s goal** is to develop a web-based **Assignment Moderation Tool**  
that streamlines the entire moderation process — from assignment upload to tutor analytics.

---

## System Architecture

<div align="center">
  <img src="./images/System Architecture.png" alt="System Architecture.png" width="500px"/>
</div>

---

##  Data Flow

<div align="center">
  <img src="./images/Data Flow.png" alt="Data Flow.png" width="500px"/>
</div>

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | React + Vite + Material UI + Tailwind | Build responsive, modern UI |
| **Backend** | Django + Django REST Framework | Provide secure APIs and business logic |
| **Database** | SQLite / PostgreSQL | Store users, rubrics, assignments, and marks |
| **Document Parser** | Mammoth.js | Convert `.docx` rubric to structured JSON |
| **Communication** | Axios + CORS | Handle frontend-backend requests |
| **Testing** | Django Test Framework | Validate APIs and consistency logic |

---

## Folder Structure

### Frontend (`frontend/`)

<div align="center">
  <img src="./images/Frontend.png" alt="Frontend.png"  width="500px" />
</div>

---

### Backend (`backend/`)

<div align="center">
  <img src="./images/Backend.png" alt="Backend.png"  width="500px" />
</div>

---

## Features

### Professor Features
- Upload assignments and `.docx` rubrics.  
- Automatic parsing of rubric tables into JSON format.  
- View all tutors’ marks side by side.  
- Identify marking inconsistencies via color-coded reports.  
- Export analytics for moderation review.

### Tutor Features
- Log in securely.  
- View all available assignments.  
- Mark and comment directly online using shared rubrics.  
- Save drafts or finalize submissions.  
- Automatically receive confirmation and feedback summaries.

### System Intelligence
- Highlight outliers (high/low vs. professor reference).  
- Compute averages, standard deviation, and completion rate.  
- Provide real-time analytics to the professor dashboard.

---

## User Interface Overview

Below are the main pages implemented in the Assignment Moderation Tool frontend.  
Each page is designed using **React + MUI**, ensuring a consistent and responsive user experience.

---

### Login Page
![Login Page](./login.png)

- **Purpose:** Allows users (professors and tutors) to securely log in to the system using their registered email and password.
- **Workflow:**
    1. The user enters their **email** and **password**.
    2. Clicking the **“Login”** button sends the credentials to the backend for authentication.
    3. If valid, the system redirects the user to the **Assignments Page** based on their role.

- **Features:**
    - Password visibility toggle for convenience.
    - **“Forgot password?”** link enables users to reset their password via email.
    - **“Not a user? Sign up here.”** link allows new users to create an account.
    - Handles invalid login attempts with error prompts.

- **Technology Stack:**  
  Implemented using **React**, **Material UI**, and **Axios** for API communication.

### Sign-Up Page
![Sign-Up Page](./images/sign_up.png)

- **Purpose:**  
  Enables new users to register for the Assignment Moderation Tool by providing their personal information and creating secure credentials.

- **Workflow:**
    1. The user enters a **Username**, **Email**, **Password**, and **Confirm Password**.
    2. Clicking **“Sign Up”** sends the registration data to the backend for validation.
    3. If successful, the user is redirected to the **Login Page** to sign in.

- **Features:**
    - Input validation for required fields (empty fields trigger inline error messages).
    - Password confirmation check to ensure both entries match.
    - Displays error messages if an email is already registered or input is invalid.
    - **“Already a user? Login here.”** link redirects to the login page.
    - Backend automatically handles role assignment (Professor or Tutor) upon account creation.

- **Technology Stack:**  
  Implemented using **React**, **Material UI**, and **Axios** for REST API communication with the Django backend.

### Edit Account Page
![Edit Account Page](./images/edit_account.png)

- **Purpose:**  
  Allows users to manage and update their personal information, including username, email, password, and profile picture.

- **Workflow:**
    1. The user navigates to the **Edit Account** page from the sidebar.
    2. They can modify their **Username** and **Email**, or update their **Password**.
    3. Clicking the camera icon lets the user upload a new **Profile Picture** (supports JPEG, PNG, or WEBP up to 2MB).
    4. The user can **Cancel** changes or click **Save Changes** to update their profile.

- **Features:**
    - Real-time form validation for empty or invalid fields.
    - Password confirmation check to prevent mismatches.
    - Profile photo upload with preview and file type restrictions.
    - Clear **Cancel** and **Save Changes** buttons with visual feedback.
    - Responsive layout ensuring consistent display across devices.

- **Technology Stack:**  
  Built with **React**, **Material UI**, and **Axios**, communicating with the Django backend for profile management.

### Assignment Page
![Assignment Page](./images/assignment.png)

- **Purpose:**  
  Displays all existing assignments in a structured dashboard view, allowing users to search, filter, sort, and — for administrators — create new assignments.

- **Workflow:**
    1. Upon login, users are directed to the **Assignment Page**, which lists all assignments as interactive cards.
    2. Users can **Search** assignments by name using the search bar.
    3. **Filter** options allow users to display:
        - Completed assignments
        - Incomplete assignments
        - All assignments
    4. **Sort** options enable users to order assignments by:
        - **A → Z** (alphabetically ascending)
        - **Z → A** (alphabetically descending)
        - **Newest First** (recently created)
        - **Oldest First** (earliest created)
    5. Administrators can click the **“+” card** to create a new assignment directly from this page.
    6. Each assignment card is **clickable** — selecting a card opens the **Assignment Detail View**,  
       where users can see all assignment information including the title, description, rubric,  
       submission progress, and marking analytics.

- **Features:**
    - Interactive assignment cards showing title, due date, and completion status.
    - Real-time search, filtering, and sorting without page reload.
    - Clickable cards linking to detailed assignment information.
    - Role-based access: only administrators can create, edit, or delete assignments.
    - Responsive layout that adapts across different screen sizes.

- **Technology Stack:**  
  Built with **React**, **Material UI**, and **Axios** for frontend logic;  
  integrated with the **Django REST API** for fetching, filtering, and managing assignment data.

### Assignment Detail / Analysis Page (Administrator View)
![Assignment Analysis Page](./images/assignment_information.png)

- **Purpose:**  
  Provides professors (administrators) with a detailed view of each assignment after selecting it from the **Assignment Page**.  
  This page summarizes tutor performance, displays consistency metrics, and allows file downloads for both the assignment and its rubric.

- **Workflow:**
    1. When an administrator clicks an assignment card on the **Assignment Page**, they are redirected to this **Detail / Analysis Page**.
    2. The page displays the assignment’s **Title**, **Description**, **Upload Date**, and **Rubric Information**.
    3. Administrators can **Download** both the **Assignment File** and **Rubric (.docx)** directly.
    4. The system aggregates tutor submissions and computes:
        - The **Average Score** across all tutors.
        - The **Total Score** for each submission.
        - Comparative analysis between tutors’ marks.
    5. Detailed analytics show the variation and consistency between tutor evaluations.
    6. Administrators can review each submission’s result, download data, and export reports.

- **Features:**
    - Displays all uploaded files (assignment and rubric) with download buttons.
    - Shows statistical metrics including **Average Score** and **Total Score**.
    - Summarizes tutor grading performance using visual analytics and color-coded highlights.
    - Allows export or download of analysis results for moderation reporting.
    - Integrated with backend APIs for retrieving score data and computing consistency analytics.

- **Technology Stack:**  
  Developed using **React**, **Material UI**, and **Axios** on the frontend,  
  integrated with the **Django REST Framework** backend for real-time data retrieval, score calculation, and analytics visualization.

### Create Assignment Page
![Create Assignment Page](./images/create_assignment.png)

- **Purpose:**  
  Enables administrators (professors) to create new assignments, upload required files, and attach detailed rubrics for tutor marking.

- **Workflow:**
    1. Administrators open the **Create Assignment Page** by clicking the “+” card on the **Assignment Page**.
    2. They enter the **Assignment Name** and select a **Due Date**.
    3. They upload the **Assignment File** (e.g., PDF or DOCX).
    4. They attach a **Rubric (.docx)** file, which the system automatically parses into a structured JSON format using *Mammoth.js*.
    5. The parsed rubric is displayed dynamically, allowing administrators to **Edit**, **Preview**, or **Add** new **Criteria** and **Levels** (e.g., High Distinction, Distinction, Credit, Pass, Fail).
    6. After reviewing the rubric, administrators can **Save** the assignment, making it visible to all tutors for marking.

- **Features:**
    - Upload and manage both assignment and rubric files.
    - Auto-parsing of rubric documents into editable grading tables.
    - Support for editing criteria, levels, and feedback fields.
    - Preview mode for verifying rubric content before saving.
    - Clean, responsive design optimized for administrative workflows.

- **Technology Stack:**  
  Built with **React**, **Material UI**, and **Axios** for frontend logic;  
  integrated with the **Django REST API** and *Mammoth.js* for rubric parsing and assignment creation.

### Edit Assignment Page
![Edit Assignment Page](./images/edit_assignment.png)

- **Purpose:**  
  Allows tutors (and administrators) to mark student submissions based on predefined rubrics, record feedback, and manage evaluation data for each assignment.

- **Workflow:**
    1. After selecting an assignment card from the **Assignment Page**, users are redirected to the **Edit Assignment Page**.
    2. The page displays all uploaded **Submissions**, each linked to the corresponding rubric criteria.
    3. Tutors select the appropriate **grading level** (e.g., High Distinction, Distinction, Credit, Pass) for each criterion.
    4. Optional **text feedback** can be entered for each submission.
    5. All marks and comments are automatically saved and synchronized with the backend.
    6. Administrators can later view aggregated tutor marks and analytics from the same data.

- **Features:**
    - Displays all submissions associated with an assignment.
    - Interactive grading interface aligned with the uploaded rubric.
    - Supports real-time mark entry and auto-save.
    - Optional written feedback per submission.
    - Backend integration for consistent data storage and analytics.
    - Simple and intuitive UI for efficient tutor workflows.

- **Technology Stack:**  
  Developed using **React**, **Material UI**, and **Axios** for frontend interactivity;  
  connected to the **Django REST API** for managing marks, feedback, and synchronization.

### Marking Comparison Page
![Marking Comparison Page](./images/mark_comparison.png)

- **Purpose:**  
  Provides administrators with an overview of all tutor marks for each submission, allowing them to compare grading consistency and identify discrepancies across markers.

- **Workflow:**
    1. After selecting a specific submission from the **Assignment Detail Page**, administrators are redirected to the **Marking Comparison Page**.
    2. The page displays a side-by-side comparison of marks given by each **tutor** and the **administrator** for every rubric criterion.
    3. A **summary section** at the top shows:
        - The number of tutors who have finished marking.
        - The current average score across all markers.
    4. Marks are color-coded for clarity:
        - **Red highlight:** higher than the administrator’s mark.
        - **Yellow highlight:** lower than the administrator’s mark.
    5. Administrators can toggle between **“Mark”** and **“Percentage”** views to analyze results from different perspectives.
    6. Non-finalized tutor marks are indicated with a note in the header for transparency.

- **Features:**
    - Visual comparison of multiple tutors’ grading results.
    - Color-coded deviation indicators for quick anomaly detection.
    - Dynamic toggle between raw marks and percentages.
    - Displays both per-criterion and total scores.
    - Clear indication of marking progress and completion rate.

- **Technology Stack:**  
  Built using **React**, **Material UI**, and **Axios** for dynamic visualization;  
  connected to the **Django REST API** for retrieving real-time marking data and analytics.

### Marker’s Assignment Page
![Marker’s Assignment Page](./images/marker's_assignment_page.png)

- **Purpose:**  
  Allows tutors (markers) to access assignment details, review the grading rubric, and begin marking student submissions directly from a centralized interface.

- **Workflow:**
    1. After logging in, tutors select an assignment from the **Assignment Page** to access this view.
    2. The page displays the **Assignment Title**, **Due Date**, and download options for both the **Assignment File** and **Rubric**.
    3. The **Rubric Table** provides detailed marking criteria with performance levels (High Distinction, Distinction, Credit, Pass, Fail).
    4. The **Submissions Section** lists all uploaded submissions for the assignment.
    5. For each submission, tutors can:
        - Click **“Mark”** to begin grading using the rubric interface.
        - Click **“Download Submission”** to review the submitted file offline.
    6. Submission completion status (e.g., “Incomplete” or “Finished”) is displayed in real time.

- **Features:**
    - Displays complete assignment details, including rubric and grading structure.
    - Supports online and offline marking workflows.
    - Shows submission status for tracking tutor progress.
    - Streamlined navigation to the **Marking Interface Page**.
    - Secure file download links for both assignment and rubric files.

- **Technology Stack:**  
  Developed with **React**, **Material UI**, and **Axios** for dynamic interaction;  
  integrated with the **Django REST API** for real-time retrieval of assignments, rubrics, and submission statuses.

### Marking Page
![Marking Page](./images/marking_page.png)

- **Purpose:**  
  Enables tutors to view student submissions and apply rubric-based grading interactively within a single interface.

- **Workflow:**
    1. Tutors access this page by clicking **“Mark”** on a specific submission from the **Marker’s Assignment Page**.
    2. The submission file (e.g., PDF) is displayed on the left using a document viewer for inline reference.
    3. On the right, the **Rubric Criteria** are listed, each with a score selection bar for intuitive point assignment.
    4. Tutors can adjust scores using arrow controls or click directly on score levels.
    5. Real-time updates calculate and display the **Total Score** at the bottom.
    6. Once grading is complete, tutors click **“Finalize”** to confirm and submit their evaluation.
    7. A **“Go Back”** button allows returning to the previous submission list without losing progress.

- **Features:**
    - Integrated PDF viewer for direct on-screen grading.
    - Interactive rubric scoring with visual indicators.
    - Real-time total score updates.
    - Finalization mechanism to lock marks upon completion.
    - Intuitive and responsive layout for efficient marking.

- **Technology Stack:**  
  Built with **React**, **Material UI**, and **PDFObject.js** for embedded file viewing;  
  connected to the **Django REST API** for storing marks, syncing finalized scores, and maintaining grading consistency.


## Setup and Run

### Backend

#### Install Python

- Ensure Python 3.10+ is installed on your system.

- Verify installation: 
  ```
  python --version
  ```
- If Python is not installed, download and install from [https://www.python.org/downloads/](https://www.python.org/downloads/)

#### Create a Virtual Environment

- Navigate to the `backend` folder: 
  ```
  cd backend
  ```
- Create a virtual environment (recommended name: `.venv`): 
  ```
  python -m venv .venv
  ```
- Activate the virtual environment:

  - **Windows:** 
    ```
    .venv\Scripts\activate
    ```

  - **Mac/Linux:** 
    ```
    source venv/bin/activate
    ```

#### Install Dependencies

- Install all required Python packages from `requirements.txt`: 
  ```
  pip install -r requirements.txt
  ```

- Dependencies include:

  - Django

  - Pillow

  - django-cors-headers

  - djangorestframework

  - black, pylint (for linting)

  - python-dotenv

  - pymysql

  - cryptography

#### Configure Database

In `backend/settings.py`, you’ll see the following code:

```Python
# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': dj_database_url.config(
        default='postgresql://db_zay4_user:16NE5FWZ4GkrBH3ID8R1GFXJ0zy5kz6W@dpg-d3u4n0euk2gs73dj8ns0-a.oregon-postgres.render.com/db_zay4',
        conn_max_age=600
    )
}
```

The project supports two databases:

- **PostgreSQL** (remote/production)

- **SQLite** (local development and testing)

**Usage:**

- For **local development,** uncomment the **SQLite** block and comment out the **PostgreSQL** block.

- For **deployment,** comment out SQLite and use the **PostgreSQL** configuration.

- After switching, always run:
  ```
  python manage.py migrate
  ```

#### Run Migrations

- Apply Django migrations to set up the database schema:
  ```
  python manage.py makemigrations
  python manage.py migrate
  ```
- Create a superuser (optional, for admin access, we’ve already have an admin account for you): 
  ```
  python manage.py createsuperuser
  ```

#### Run Backend Server

- Start the Django development server: 
  ```
  python manage.py runserver
  ```
- The backend API will be available at: 
  ```
  http://localhost:8000
  ```

### Frontend

#### Install Node.js

- Ensure **Node.js 18+** and **npm** are installed.

- Verify installation:
  ```
  node --version
  npm --version
  ```

#### Install Frontend Dependencies

- Navigate to the `frontend` folder:
  ```
  cd frontend
  ```

- Install all dependencies listed in `package.json`: 
  ```
  npm install
  ```

**Key dependencies:**

- React, React-DOM (core UI)

- MUI (UI components and icons)

- React Router (SPA routing)

- Styled-components / Emotion (styling)

- Mammoth.js (DOCX to JSON parser for rubrics)

- react-pdf / pdfjs-dist (PDF preview)

- TailwindCSS / DaisyUI (utility classes and UI components)

- React Hot Toast (notifications)

#### Run Frontend Development Server

- Start the frontend development server with Vite: 
  ```
  npm run dev
  ```

- The frontend app will be available at:
  ```
  http://localhost:5173
  ```

- It is configured to proxy API requests to the backend (`http://localhost:8000`) as defined in `package.json`.

#### Build for Production (Optional)

- To create a production build: 
  ```
  npm run build
  ```

- Preview the production build locally: 
  ```
  npm run preview
  ```

### General Notes

- **Environment Variables:** Use `.env` files for sensitive info (database URL, secret key, etc.).

- **Static & Media Files:** Uploaded rubrics, PDFs, and images are stored in `backend/media/`.

- **Frontend/Backend Communication:** All API requests use session authentication. Ensure backend server is running before testing frontend.

## Testing

Testing ensures that all system components — frontend, backend, and integrations — operate correctly before deployment. This section outlines the manual and automated testing processes, along with known issues and resolutions encountered during development.

### Manual Test

Manual testing was conducted to validate functionality, performance, and code quality across both frontend and backend components.
The process also included running linting tools (ESLint & Pylint) and Django unit tests to ensure code reliability and maintainability.

#### Frontend Manual Testing (React + Vite)

Developers and testers can manually verify the frontend functionality and run lint checks using ESLint.

**Steps to Run Manual Tests**

1. Open a terminal and navigate to the `frontend/` directory:
  ```
  cd frontend
  ```

2. Start the frontend development server:
  ```
  npm run dev
  ```

  - Open the app at [http://localhost:5173]() (default Vite port).

  - Verify UI components, navigation, and data rendering.

3. Run ESLint to check code quality:
  ```
  npm run lint
  ```

  - This scans all `.js`, `.jsx`, `.ts`, and `.tsx` files.

  - Any style or syntax errors will be displayed in the terminal.

4. Fix reported issues manually or with automatic formatting (optional): 
  ```
  npm run lint -- --fix
  ```

#### Frontend Testing Checklist

| Test Area           | Description                        | Expected Outcome                             |
|--------------------|------------------------------------|---------------------------------------------|
| Navigation Flow     | Verify routing between pages (Dashboard, Moderation, Reports). | Smooth transitions without reloads.        |
| File Uploads        | Upload PDF/DOCX for moderation.    | File uploads successfully and displays in list. |
| User Authentication | Login and logout actions.          | Session created and cleared correctly.      |
| Form Validation     | Invalid or empty fields.           | Error messages appear properly.             |
| Lint Check (ESLint) | Run `npm run lint`.                | No critical issues; minor warnings addressed. |


#### Backend Manual Testing (Django + PostgreSQL)

The backend was tested both functionally and programmatically using Django’s built-in testing framework and Pylint for static code analysis.

**Steps to Run Backend Tests**

1. Open a terminal and navigate to the backend directory: 
  ```
  cd backend
  ```

2. Activate the Python virtual environment (if not active): 
  ```
  source venv/bin/activate        # Mac/Linux
  venv\Scripts\activate           # Windows
  ```

3. Run Django test suite:
  ```
  python manage.py test
  ```
  - Runs all tests under `api/tests.py` or any app’s `tests.py` file.
  - Ensures views, models, and API endpoints work correctly.

4. Run Pylint for code quality check:
  ```
  pylint api backend
  ```
  - Generates a report showing potential issues or code style violations.
  - Aim for a Pylint score above **4.0/10** for clean code quality.

5. Apply migrations if database structure was updated:
  ```
  python manage.py makemigrations
  python manage.py migrate
  ```

#### Backend Testing Checklist

| Test Area               | Description                                | Expected Outcome                                 |
|-------------------------|--------------------------------------------|-------------------------------------------------|
| API Functionality        | Test endpoints via Postman (GET, POST, PUT, DELETE). | Correct JSON responses and status codes.       |
| Authentication           | Validate login/logout flow and token access. | Tokens generated and validated correctly.      |
| Database Migrations      | Run `python manage.py migrate`.            | Migrations apply without errors.               |
| File Upload & Retrieval  | Upload and access media files.            | Files stored in `/media/` and served correctly. |
| Code Quality (Pylint)    | Run `pylint api backend`.                  | No major warnings; good style compliance.      |
| Unit Tests (Django)      | Run `python manage.py test`.               | All test cases pass successfully.              |


#### Manual Test Summary

| Component | Tool                 | Command                  | Purpose                                  |
|-----------|--------------------|-------------------------|-----------------------------------------|
| Frontend  | ESLint              | `npm run lint`          | Detect syntax/style issues in React code |
| Frontend  | Browser Manual Test | `npm run dev`           | Verify UI & interaction                  |
| Backend   | Django Test Suite   | `python manage.py test` | Run all backend unit tests               |
| Backend   | Pylint              | `pylint api backend`    | Static code analysis for Python          |

### Automated Test

The project integrates continuous integration (CI) through GitHub Actions to automatically test, lint, and validate both the frontend and backend on every code change.

This ensures that all commits and pull requests maintain consistent code quality and do not break existing functionality.

#### Workflow Overview

The GitHub Actions workflow file is stored at:

```
.github/workflows/ci.yml
```
It is triggered automatically on:

- Every push to any branch

- Every pull request to any branch

This guarantees that all changes are validated before being merged into the main branch.

#### CI Jobs and Responsibilities

The workflow defines **four main jobs:**

1. **python-lint** — Lint and format check for the Django backend

2. **react-lint** — Lint check for the React frontend

3. **backend-test** — Run Django unit tests

4. **summary** — Combine results and report outcomes

| Job Name       | Description                                               | Key Tools                 | Outcome                                     |
|----------------|-----------------------------------------------------------|---------------------------|--------------------------------------------|
| python-lint    | Lints and format-checks backend Python files using pylint and black. | Pylint, Black             | Reports Python code quality and formatting issues. |
| react-lint     | Lints frontend JavaScript/JSX code for React components.  | ESLint                    | Reports syntax and best-practice issues in React. |
| backend-test   | Executes Django’s built-in test suite to validate backend functionality. | Django Test Framework     | Runs all tests in api/tests.py.            |
| summary        | Aggregates all test reports and outputs results in the Actions log. | —                         | Summarizes outcomes and fails PRs if any job fails. |


#### Workflow Description

##### Python Lint (Backend Quality Check)

- Sets up Python environment (3.x).

- Installs dependencies from `backend/requirements.txt`.

- Runs:
  ```
  pylint $(git ls-files '*.py')
  black --check .
  ```

- Outputs results to `pylint-report.txt` and `black-report.txt`.

- Marks job as failed if linting errors are detected.

##### React Lint (Frontend Quality Check)

- Uses Node.js version 18.

- Installs frontend dependencies via:
  ```
  npm install
  ```

- Runs:
  ```
  npm run lint
  ```

- Saves lint results to eslint-report.txt.

- Marks job as failed if linting errors are found.

##### Backend Tests (Django Functional Testing)

- Sets up Python and installs backend dependencies.

- Runs Django’s unit tests with:
  ```
  python manage.py test --verbosity=2
  ```

- Logs all test case results in the GitHub Actions console.

- If any test fails, the job is marked as failed.

##### Summary Resport

- Collects reports from all previous jobs:

  - Python Lint Report (pylint-report.txt)

  - Black Format Report (black-report.txt)

  - React ESLint Report (eslint-report.txt)

  - Django Test Report (console output)

- If any job failed (`failed == true`), the workflow:
  ```
  exit 1
  ```
  This blocks pull requests from merging until all checks pass.

### Issues

| Issue                       | Description                                          | Resolution                                           |
|------------------------------|------------------------------------------------------|-----------------------------------------------------|
| Minor ESLint warnings        | Unused imports and console logs in React components. | Cleaned and removed during lint fix.               |
| Pylint spacing errors        | Minor indentation inconsistencies in views.py.       | Fixed via black and manual review.                 |
| Django test config error     | Missing database config during initial CI setup.    | Added sqlite3 as default test DB in settings.     |
| Frontend API constant mismatch | Wrong API URL during early tests.                  | Updated constants.js to match deployment URL.     |
| Pending Tests                | Future enhancement: add integration tests for file uploads and grading comparisons. | Planned for next sprint.                            |


## Known bugs or TODOs in the code

One known issue that remains outstanding in the current implementation is the email feedback feature for markers, which has not yet been fully completed. The intended functionality is to allow moderators to send automated email notifications to tutors (markers) after moderation, summarizing feedback, requested changes, or approval of marks. While the backend structure for user roles and feedback storage is already in place within Django, the actual email sending logic—including configuration of the email service (e.g., SMTP setup or Django’s send_mail integration)—has not been finalized or tested. This feature should be implemented in future development to improve communication efficiency between moderators and tutors, ensuring feedback is delivered promptly and recorded for audit purposes.

In the current codebase, future developers who continue this feature should focus on two key areas:

- **Frontend – `MarkerPage.jsx`:** This React component is responsible for displaying the marker’s interface and should be updated to handle the email feedback prompt once an email has been successfully sent. Developers should add appropriate UI elements, such as a success message or notification banner, triggered after the backend confirms the email has been dispatched. Integration with the backend API endpoint that handles email sending will be required here.

- **Backend – `submission_mark_view(request, user_id, assignment_id, submission_id)` in `views.py`:** This Django view manages the finalization of a marker’s submission. When a marker completes marking and submits their results, this function is intended to trigger Django’s email service (e.g., via send_mail or a background task). Developers should implement or complete this logic to automatically send an email notification to the tutor or moderator. The function should also include proper error handling and logging for email delivery failures.

- **Email Configuration – `settings.py`:** The project already includes an email backend configuration with 
  ```
  EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
  ```
  This setup allows email messages to be printed to the console during local development and testing. Future developers should update this configuration to use a production-ready backend (e.g., SMTP or a transactional email service like SendGrid) when deploying to production.

Together, these components form the **email feedback workflow,** and any future development should ensure smooth communication between frontend and backend, as well as proper testing of the email delivery process in both development and production environments.

## Deployment

The Assignment Moderation Tool is fully deployed using Render, a cloud-based hosting platform that provides integrated services for static frontend hosting, Python web services, and managed PostgreSQL databases.

This setup supports continuous deployment from GitHub, ensuring automated builds, version control, and reliable hosting with minimal manual configuration.

### System Architecture on Render

| Component | Render Service Type | Technology           | Description                                                                 |
|-----------|------------------|--------------------|-----------------------------------------------------------------------------|
| Frontend  | Static Site       | React.js (Vite + MUI) | The compiled frontend build is hosted as a static web application and served via HTTPS. |
| Backend   | Web Service       | Python + Django     | RESTful API handling authentication, assignment moderation logic, and database operations. |
| Database  | Managed Database  | PostgreSQL          | Stores user accounts, assignments, rubrics, marks, and moderation results.  |

Each service is deployed independently but linked through environment variables to allow secure communication and simplified scaling.

### Servier Environment Overview

#### Frontend

- **Runtime:** Node.js 18+

- **Build Command:**
  ```
  npm install && npm run build
  ```
- **Publish Directory:**
  ```
  dist
  ```
- **Start Command:** Render automatically serves static files once the build is complete

#### Backend

- **Runtime:** Python 3.10+

- **Build Command:**
  ```
  #!/usr/bin/env bash
  set -o errexit

  pip install -r requirements.txt

  python manage.py collectstatic --no-input

  python manage.py migrate
  ```

- **Start Command:**
  ```
  gunicorn backend.wsgi:application
  ```

- **Working Directory:** `backend/`

#### Database (PostgreSQL)

- Managed instance automatically configured through Render’s “Add Database” option.

- Connection handled using the `DATABASE_URL` environment variable in Django settings.

### Environment Variables and Configuration

All environment variables are securely stored in the Render Dashboard under the respective service settings. They replace sensitive data stored in configuration files like `settings.py` or `.env`.

| Variable               | Description                                   | Example                                         |
|------------------------|-----------------------------------------------|-------------------------------------------------|
| SECRET_KEY             | Django secret key for encryption and sessions. | django-insecure-xyz123abc                       |
| DEBUG                  | Set to False in production.                   | False                                           |
| DATABASE_URL           | PostgreSQL connection string.                 | postgresql://user:password@host:5432/dbname    |
| ALLOWED_HOSTS          | Allowed frontend and API domains.             | ["frontend.onrender.com", "backend.onrender.com"] |
| CORS_ALLOWED_ORIGINS   | Whitelisted frontend URLs for API access.    | https://frontend.onrender.com                  |
| EMAIL_HOST_USER        | For sending notifications (if applicable).   | example@deakin.edu.au                           |


#### Frontend Configuration

- Backend API endpoint is defined in: 
  ```
  src/constants.js
  ```
  the code:
  ```JavaScript
  const DEPLOY_API="https://68d69d40-72ab-4896-bc17-b3c190219391-dev.e1-us-east-azure.choreoapis.dev/assignment-moderation/backend/v1.0"

  export function getApiBaseUrl() {
      return import.meta.env.VITE_API_URL ?  import.meta.env.VITE_API_URL : DEPLOY_API;
  }
  ```
  switch between the local backend api and deployment backend api, the constant `VITE_API_URL` is in the file `frontend/.env` which you need to create by yourself.
  ```
  VITE_API_URL="http://localhost:8000"
  ```

### Deployment Steps

#### Frontend (React + Vite)

1. Push latest changes to the GitHub main branch.

2. Render automatically detects the commit and triggers a new build:

  - Installs dependencies (npm install)

  - Builds optimized production files (npm run build)

3. After successful build, the static files in /dist are deployed automatically.

**Manual Deployment (if auto-deploy is disabled):**

- Go to Render Dashboard → Frontend Service → **“Manual Deploy → Deploy latest commit.”**

#### Backend (Django)

1. Push latest backend changes to the linked GitHub repository.

2. Render triggers the backend build:

  - Installs dependencies (pip install -r requirements.txt)

  - Runs migrations (python manage.py migrate)

  - Collects static files (if configured) 
    ```
    python manage.py collectstatic --noinput
    ```

3. Starts the Django server using `gunicorn backend.wsgi`.


**Manual Deployment:**

- Render Dashboard → Backend Service → **“Manual Deploy → Deploy latest commit.”**

#### Database (PostgreSQL)

- Automatically provisioned through Render.

- Django connects via DATABASE_URL variable—no local config required.

- Backups can be configured via Render’s dashboard under the Database service.

- Variables are given in the handover document.

### Rollback Procedure

Render provides automatic rollback features in case a deployment fails or causes instability.

**To rollback the deployment:**

1. Open the Render Dashboard.

2. Select the affected service (Frontend or Backend).

3. Navigate to the Deploys tab.

4. Find the previous successful deployment.

5. Click “Rollback” to revert to that stable version.

**Alternatively:**

- You can manually revert the code in GitHub to a previous commit and push again.

- Render will automatically redeploy the reverted version.

### Render Free Plan Limitations and Post-Deployment Recommendations

Please refer to handover document for more information.

## Contributions

Thanks to everyone who contributed to the development of the Assignment Moderation Tool!

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/david-zhengrong-yan">
        <img src="https://avatars.githubusercontent.com/david-zhengrong-yan" width="100px;" alt=""/>
        <br /><sub><b>Zhengrong Yan</b></sub>
      </a>
      <br /> Scrum Master
      & UI Designer
      & Full Stack Developer
    </td>
    <td align="center">
      <a href="https://github.com/Johnny-Jiayin">
        <img src="https://avatars.githubusercontent.com/Johnny-Jiayin" width="100px;" alt=""/>
        <br /><sub><b>Jiayin Liu</b></sub>
      </a>
      <br /> Backend Developer&mdash;Logic & UI Designer
    </td>
    <td align="center">
      <a href="https://github.com/Juuuu666
">
        <img src="https://avatars.githubusercontent.com/Juuuu666
" width="100px;" alt=""/>
        <br /><sub><b>Xian Ma</b></sub>
      </a>
      <br />Frontend Developer & UI Designer
    </td>
    <td align="center">
      <a href="https://github.com/SIMONCHENYI">
        <img src="https://avatars.githubusercontent.com/SIMONCHENYI" width="100px;" alt=""/>
        <br /><sub><b>Chenyi Song</b></sub>
      </a>
      <br />Frontend Developer & UI Designer
    </td>
    <td align="center">
      <a href="https://github.com/HaochenY3">
        <img src="https://avatars.githubusercontent.com/HaochenY3" width="100px;" alt=""/>
        <br /><sub><b>Haochen Yu</b></sub>
      </a>
      <br />Product Owner & Backend Developer&mdash;Testing & UI Designer
    </td>
  </tr>
</table>


## Licence

This project is licensed under a **Restricted Internal Use License**.  
It is intended for use only by **Deakin University – School of Psychology** and the **Group 77** development team.

See the [LICENSE.md](./LICENSE.md) file for full license details.