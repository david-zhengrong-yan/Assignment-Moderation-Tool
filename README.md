# Assignment Moderation Tool
COMP30022 IT Project — Deakin University Psychology Department  
Developed for **Carrie Ewin**, Psychology Lecturer at Deakin University

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

                ┌────────────────────────────┐
                │        Professor           │
                │ Uploads Assignments &      │
                │ Rubric (.docx) Files       │
                └────────────┬───────────────┘
                               │
                               ▼
            ┌──────────────────────────────────┐
            │           Frontend (React)        │
            │ React + Vite + Material UI + Axios│
            │ - Login / Signup Pages            │
            │ - Tutor Marking Interface         │
            │ - Professor Dashboard             │
            │ - Analytics & Reports             │
            └────────────┬──────────────────────┘
                          │ RESTful API Calls
                          ▼
     ┌──────────────────────────────────────────────┐
     │               Django Backend                 │
     │ Django REST Framework + SQLite               │
     │ - User & Role Management                     │
     │ - Assignment & Rubric Storage                │
     │ - Tutor Marks & Analytics                    │
     │ - Automated Comparison & Feedback            │
     └──────────────┬──────────────────────────────┘
                    │ ORM
                    ▼
           ┌─────────────────────────────┐
           │     SQLite / PostgreSQL      │
           │ Users, Assignments, Marks    │
           └─────────────────────────────┘

---

## Data Flow

┌───────────────────────────────────────────────┐
│ Professor uploads Rubric (.docx) │
└───────────────────────────────────────────────┘
│
▼
┌───────────────────────────────────────────────┐
│ System parses rubric into JSON using Mammoth.js│
└───────────────────────────────────────────────┘
│
▼
┌───────────────────────────────────────────────┐
│ All tutors log in and mark the same │
│ assignments online │
└───────────────────────────────────────────────┘
│
▼
┌───────────────────────────────────────────────┐
│ Backend aggregates results, compares marks, │
│ highlights deviations and averages │
└───────────────────────────────────────────────┘
│
▼
┌───────────────────────────────────────────────┐
│ Professor views analytics and consistency │
│ reports │
└───────────────────────────────────────────────┘

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

frontend/
│
├── public/
│ └── vite.svg
│
├── src/
│ ├── assets/
│ │ └── logo_deakin-rebrand-stacked.png
│ │
│ ├── components/
│ │ ├── AuthLayout.jsx # Login/register layout
│ │ ├── Navbar.jsx # Sidebar navigation
│ │ ├── RubricEditor.jsx # Professor rubric editor
│ │ └── Topbar.jsx # Top navigation bar
│ │
│ ├── pages/
│ │ ├── HomePage.jsx # Professor dashboard
│ │ ├── LoginPage.jsx # Login page
│ │ ├── SignupPage.jsx # Signup page
│ │ ├── CreateAssignmentPage.jsx # Upload assignment & rubric
│ │ ├── AssignmentPage.jsx # View assignment details
│ │ ├── MarkingPage.jsx # Tutor marking page
│ │ ├── ViewSubmissionPage.jsx # Professor compares tutors’ marks
│ │ ├── EditAssignmentPage.jsx # Edit rubric
│ │ ├── AccountPage.jsx / EditAccountPage.jsx # User account pages
│ │ ├── PeoplePage.jsx # Tutor list
│ │ ├── MarkerPage.jsx # Tutor marking overview
│ │ └── NotFoundPage.jsx # 404 error page
│ │
│ ├── utils/
│ │ └── rubricDocx.js # DOCX to JSON parser using Mammoth.js
│ │
│ ├── App.jsx / main.jsx # Routing and app entry point
│ ├── App.css / index.css # Global styles
│ └── vite.config.js # Build configuration

---

### Backend (`backend/`)

backend/
│
├── api/
│ ├── migrations/
│ │ ├── 0001_initial.py
│ │ ├── 0002_remove_user_staffid.py
│ │ └── 0003_alter_user_role.py
│ │
│ ├── admin.py # Admin registration
│ ├── apps.py # App registration
│ ├── forms.py # Upload & validation forms
│ ├── models.py # User, Assignment, Rubric, Mark models
│ ├── views.py # API logic and analytics endpoints
│ ├── urls.py # Route definitions
│ ├── tests.py # Backend tests
│ └── init.py
│
├── backend/
│ ├── settings.py # Django configuration (CORS, email, media)
│ ├── urls.py # Root router
│ ├── asgi.py / wsgi.py
│ └── init.py
│
├── media/ # Uploaded Rubrics, PDFs, Images
│ ├── *.docx
│ ├── *.jpeg / *.pdf
│
└── manage.py # Django entry point

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

## Setup and Run

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```