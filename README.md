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
![System Architecture](./images/System%20Architecture.png)

---

##  Data Flow
![Data Flow](./images/Data%20Flow.png)

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
![Frontend](./images/Frontend.png)

---

### Backend (`backend/`)
![Backend](./images/Backend.png)

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
![Login Page](./images/login.png)

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

```bash
python manage.py test

Includes tests for:

Authentication & session validation

Assignment creation and editing

Rubric parsing

Tutor mark submissions

Aggregated analytics accuracy
```

## Known bugs or TODOs in the code

One known issue that remains outstanding in the current implementation is the email feedback feature for markers, which has not yet been fully completed. The intended functionality is to allow moderators to send automated email notifications to tutors (markers) after moderation, summarizing feedback, requested changes, or approval of marks. While the backend structure for user roles and feedback storage is already in place within Django, the actual email sending logic—including configuration of the email service (e.g., SMTP setup or Django’s send_mail integration)—has not been finalized or tested. This feature should be implemented in future development to improve communication efficiency between moderators and tutors, ensuring feedback is delivered promptly and recorded for audit purposes.

In the current codebase, future developers who continue this feature should focus on two key areas:

- **Frontend – `MarkerPage.jsx`:** This React component is responsible for displaying the marker’s interface and should be updated to handle the email feedback prompt once an email has been successfully sent. Developers should add appropriate UI elements, such as a success message or notification banner, triggered after the backend confirms the email has been dispatched. Integration with the backend API endpoint that handles email sending will be required here.

- **Backend – `submission_mark_view(request, user_id, assignment_id, submission_id)` in `views.py`:** This Django view manages the finalization of a marker’s submission. When a marker completes marking and submits their results, this function is intended to trigger Django’s email service (e.g., via send_mail or a background task). Developers should implement or complete this logic to automatically send an email notification to the tutor or moderator. The function should also include proper error handling and logging for email delivery failures.

- 


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