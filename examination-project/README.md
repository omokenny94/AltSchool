# Todo Application – Frontend Second Semester Examination

## Project Overview

This project is a task management web application built using React.
It demonstrates API integration, authentication, routing, state management, accessibility practices, and responsive user interface design.

Users can create, view, update, filter, search, paginate, and delete tasks.
Authenticated users are only allowed to modify tasks they own using secure token-based authorization.

---

## Live Demo

Deployed URL: https://examination-project-seven.vercel.app/

Repository URL: https://github.com/omokenny94/AltSchool/tree/main/examination-project

---

## Features

* Fetch and display tasks from API
* Server-side pagination (10 tasks per page)
* Nested route for task details
* Search tasks by title
* Filter tasks by completion status
* Loading and error states
* Error Boundary fallback UI
* Custom 404 page
* Responsive design (mobile and desktop)
* User authentication (login)
* Protected routes
* Create task
* Update task (toggle status)
* Delete task (owner only)
* Optimistic UI updates using React Query
* Token-based authorization (JWT)
* Login 
* Register
* User profile page

---

## Technology Stack

### Core

* React 19 (Functional Components + Hooks)
* React Router
* TanStack Query (data fetching & caching)
* Axios (API requests)
* Tailwind CSS (styling)

### Architecture Decisions

* TanStack Query handles caching, invalidation and mutations
* Axios interceptors attach authorization tokens automatically
* Context API manages authentication state
* Server-side pagination used for accurate dataset navigation



## Author

Student Name: Kehind Omoniyi
Course: Frontend Second Semester Examination
