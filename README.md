# Employee & Task Progress Management System

A full-stack web application for managing employees, assigning tasks, tracking task progress, and improving communication between managers and employees.

The system provides separate dashboards and role-based functionality for **Managers** and **Employees**. Managers can manage their employees and tasks, while employees can view and update the tasks assigned to them.

---

## 🚀 Features

### 👨‍💼 Manager

- Manager account creation and login
- Separate dashboard for each manager
- Manage employees belonging to the manager
- Create and assign tasks to employees
- View all assigned tasks
- View tasks based on employees
- Edit task details
- Delete tasks
- Track task status
- View employee task progress
- View employee-specific tasks
- Manage manager-specific employees and tasks

### 👨‍💻 Employee

- Employee account creation and login
- Employee-specific dashboard
- View assigned tasks
- View task details
- Update task status
- Add comments when a task is blocked
- Track assigned task progress

### 📋 Task Management

Tasks move through different stages:

~~~text
TO-DO → ONGOING → COMPLETED
          ↓
       BLOCKED
          ↓
       ONGOING
~~~

Supported task statuses:

- `TO-DO`
- `ONGOING`
- `BLOCKED`
- `COMPLETED`

Task management includes:

- Task creation
- Task assignment
- Task editing
- Task deletion
- Task priority
- Task deadline
- Task status updates
- Task comments
- Task history

---

## 🔐 Authentication & Authorization

The application uses authentication and role-based authorization to control access to different parts of the system.

There are two primary roles:

~~~text
MANAGER
EMPLOYEE
~~~

Users are redirected to the appropriate dashboard based on their role.

### Manager Flow

~~~text
Login
  ↓
Authentication
  ↓
Role Verification
  ↓
MANAGER
  ↓
Manager Dashboard
~~~

### Employee Flow

~~~text
Login
  ↓
Authentication
  ↓
Role Verification
  ↓
EMPLOYEE
  ↓
Employee Dashboard
~~~

Backend authorization protects the APIs and prevents users from accessing functionality that does not belong to their role.

---

## 🏗️ System Architecture

The application follows a client-server architecture.

~~~text
                    ┌──────────────────────┐
                    │       Frontend       │
                    │       React.js       │
                    │       MUI            │
                    └──────────┬───────────┘
                               │
                             Axios
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Backend        │
                    │     Spring Boot      │
                    │      REST APIs       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │     Collections      │
                    └──────────────────────┘
~~~

---

## 🛠️ Technologies Used

### Frontend

- React.js
- JavaScript
- React Router
- Material UI (MUI)
- Axios
- React Hook Form
- Zod
- Yarn

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data MongoDB
- REST APIs
- Maven
- Lombok

### Database

- MongoDB

### Development Tools

- Visual Studio Code
- IntelliJ IDEA
- Postman
- Git
- GitHub

---

## 📁 Project Structure

~~~text
Employee Management System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── yarn.lock
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com.employee.backend/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── repository/
│   │       │       ├── model/
│   │       │       ├── dto/
│   │       │       ├── security/
│   │       │       ├── exception/
│   │       │       └── config/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   └── pom.xml
│
└── README.md
~~~

---

## 📂 Backend Architecture

The backend follows a layered architecture:

~~~text
Controller
     ↓
Service
     ↓
Repository
     ↓
MongoDB
~~~

### Controller

Handles HTTP requests and exposes REST APIs.

Examples:

~~~text
/api/auth
/api/users
/api/tasks
~~~

### Service

Contains the application's business logic.

Responsibilities include:

- Creating users
- Managing employees
- Creating tasks
- Assigning tasks
- Updating task status
- Validating task transitions
- Managing task comments
- Managing task history

### Repository

Handles communication with MongoDB.

Examples:

~~~text
UserRepository
TaskRepository
CommentRepository
TaskHistoryRepository
~~~

### Model

Represents the data stored in MongoDB.

Examples:

~~~text
User
Task
Comment
TaskHistory
~~~

### DTO

Data Transfer Objects are used to control the data exchanged between the frontend and backend.

Examples:

~~~text
UserRequest
UserResponse
TaskRequest
TaskResponse
StatusUpdateRequest
CommentRequest
CommentResponse
~~~

---

## 🗄️ Database

The application uses **MongoDB**.

MongoDB stores data in collections instead of relational database tables.

Main collections include:

~~~text
users
tasks
comments
taskHistory
~~~

### Users Collection

Stores information about managers and employees.

Example:

~~~json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "EMPLOYEE"
}
~~~

Available roles:

~~~text
MANAGER
EMPLOYEE
~~~

### Tasks Collection

Stores task information.

Example:

~~~json
{
  "title": "Implement Login API",
  "description": "Create authentication API",
  "status": "ONGOING",
  "priority": "HIGH",
  "assignedEmployee": "employeeId"
}
~~~

### Comments Collection

Stores communication related to tasks.

Comments are particularly useful when an employee blocks a task and needs to provide a reason or additional information.

### Task History Collection

Stores important task activities such as:

~~~text
Task Created
Task Assigned
Status Changed
Task Blocked
Task Completed
Task Reopened
~~~

This provides an audit trail of task progress.

---

## 🔄 Task Workflow

The task workflow provides controlled task progression.

~~~text
                 ┌───────────────┐
                 │     TO-DO     │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    ONGOING    │
                 └───┬───────┬───┘
                     │       │
                     │       ▼
                     │   ┌───────────┐
                     │   │  BLOCKED  │
                     │   └─────┬─────┘
                     │         │
                     │         ▼
                     │     ONGOING
                     │
                     ▼
                ┌─────────────┐
                │  COMPLETED  │
                └─────────────┘
~~~

### Allowed Employee Transitions

| Current Status | Allowed Status |
|---|---|
| TO-DO | ONGOING |
| ONGOING | COMPLETED |
| ONGOING | BLOCKED |
| BLOCKED | ONGOING |

### Invalid Transitions

The following transitions are not allowed for employees:

~~~text
BLOCKED → COMPLETED
COMPLETED → ONGOING
COMPLETED → BLOCKED
~~~

When an employee marks a task as `BLOCKED`, a comment is required.

Example validation message:

~~~text
Blocked task requires a comment.
~~~

Managers can have additional control over task status depending on the workflow.

---

## 🔌 REST API

The backend exposes REST APIs for communication with the React frontend.

### Authentication

~~~http
GET /api/auth/me
~~~

Returns information about the currently authenticated user.

### User / Employee APIs

~~~http
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
GET    /api/users/{id}/tasks
~~~

### Task APIs

~~~http
GET    /api/tasks
GET    /api/tasks/{id}
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
GET    /api/tasks/my
PATCH  /api/tasks/{id}/status
~~~

### Comment APIs

~~~http
POST /api/tasks/{id}/comments
GET  /api/tasks/{id}/comments
~~~

### Task History APIs

~~~http
GET /api/tasks/{id}/history
~~~

---

## 🎨 Frontend

The frontend is developed using React.js and Material UI.

The application provides separate interfaces for managers and employees.

### Manager Dashboard

The manager dashboard provides access to:

~~~text
Dashboard
Employees
Tasks
Add Task
Employee Details
Task Details
Reports
Profile
~~~

### Employee Dashboard

The employee dashboard provides access to:

~~~text
Dashboard
My Tasks
Task Details
Profile
~~~

---

## 📝 Forms & Validation

Forms are implemented using **React Hook Form**.

Validation is handled using **Zod**.

The general form flow is:

~~~text
User Input
    ↓
React Hook Form
    ↓
Zod Validation
    ↓
API Request
    ↓
Spring Boot
    ↓
MongoDB
~~~

This provides structured form handling and validation.

---

## 🔗 Frontend → Backend Communication

Axios is used to communicate with the Spring Boot REST APIs.

~~~text
React Component
      ↓
Axios / API Service
      ↓
REST API
      ↓
Spring Boot Controller
      ↓
Service Layer
      ↓
Repository
      ↓
MongoDB
~~~

---

## ▶️ How to Run the Project

### Prerequisites

Make sure the following are installed:

- Java
- Maven
- Node.js
- Yarn
- MongoDB
- Git
- IntelliJ IDEA
- Visual Studio Code

---

## ⚙️ Backend Setup

Navigate to the backend folder:

~~~bash
cd backend
~~~

Build the project:

~~~bash
mvn clean install
~~~

Run the Spring Boot application:

~~~bash
mvn spring-boot:run
~~~

The backend will run on the configured Spring Boot port.

Default example:

~~~text
http://localhost:8080
~~~

---

## 💻 Frontend Setup

Navigate to the frontend folder:

~~~bash
cd frontend
~~~

Install dependencies:

~~~bash
yarn install
~~~

Start the React application:

~~~bash
yarn start
~~~

The frontend will normally run on:

~~~text
http://localhost:3000
~~~

---

## 🗃️ MongoDB Configuration

Make sure MongoDB is running before starting the backend.

MongoDB configuration can be added to:

~~~text
backend/src/main/resources/application.properties
~~~

Example:

~~~properties
spring.data.mongodb.uri=mongodb://localhost:27017/employee_management
~~~

---

## 🔐 Environment Variables

Sensitive information such as authentication secrets, database credentials, OAuth credentials, and API keys should not be committed to Git.

Example environment variables:

~~~text
DATABASE_URL
JWT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
~~~

> Never commit real credentials, passwords, API keys, or tokens to GitHub.

---

## 🧪 Testing

### Backend API Testing

Postman can be used to test the REST APIs.

Typical testing flow:

~~~text
Create User
    ↓
Authenticate User
    ↓
Get User Details
    ↓
Create Task
    ↓
Assign Employee
    ↓
Update Task Status
    ↓
Add Comment
    ↓
View Task History
~~~

---

## 🔒 Security

Spring Security is used to protect application resources.

Security responsibilities include:

- Authentication
- Authorization
- Role-based access control
- Protected APIs
- User identity verification
- Manager access control
- Employee access control

Frontend route protection is mainly used for navigation and user experience.

Actual authorization is handled by the backend.

---

## 👥 Role-Based Access

| Feature | Manager | Employee |
|---|:---:|:---:|
| Login | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Manage Employees | ✅ | ❌ |
| Create Task | ✅ | ❌ |
| Assign Task | ✅ | ❌ |
| View Assigned Tasks | ✅ | ✅ |
| Edit Task | ✅ | Restricted |
| Delete Task | ✅ | ❌ |
| Update Task Status | ✅ | ✅ |
| Add Task Comment | ✅ | ✅ |
| View Task History | ✅ | Restricted |
| Manage Other Employees | ✅ | ❌ |

---

## 📈 Development Phases

### Phase 1 — Core Task Management

Implemented functionality:

- MongoDB User collection
- MongoDB Task collection
- User model
- Task model
- Controllers
- Services
- Repositories
- REST APIs
- Postman API testing
- Manager dashboard
- Employee dashboard
- Task assignment
- Employee task viewing
- Task listing

### Phase 2 — Task Management Improvements

Implemented functionality:

- Update task
- Delete task
- Edit task drawer
- UI improvements
- React Hook Form
- Form validation
- Improved task management flow

### Phase 3 — Task Communication & Approval

Planned functionality:

- Employee comments when a task is blocked
- Manager visibility of blocked-task comments
- Employee completion notification
- Manager approval of completed tasks
- Employee notification after approval or rejection
- Reopening a task when the manager does not approve it
- Task history tracking
- Task activity timeline

Example workflow:

~~~text
Employee completes task
        ↓
Manager receives notification
        ↓
Manager reviews task
        ↓
      ┌─┴─┐
      ↓   ↓
   Approve Reject
      ↓   ↓
 COMPLETED TO-DO
~~~

---

## 📌 Future Improvements

Possible future enhancements include:

- Notifications
- Email notifications
- Manager reports
- Employee performance reports
- Advanced task filtering
- Search functionality
- Pagination
- Task analytics
- Dashboard statistics
- Task activity timeline
- Improved authentication flow
- Profile management
- Task attachments
- Real-time communication
- Responsive mobile interface
- Cloud deployment

---

## 🧑‍💻 Development Workflow

The project follows a feature-based development approach.

~~~text
Requirement
    ↓
Planning
    ↓
Backend API
    ↓
Database
    ↓
Frontend UI
    ↓
API Integration
    ↓
Testing
    ↓
Review
    ↓
Improvement
~~~

---

## 🌿 Git Workflow

Initialize the repository:

~~~bash
git init
~~~

Check repository status:

~~~bash
git status
~~~

Add files:

~~~bash
git add .
~~~

Create a commit:

~~~bash
git commit -m "Initial commit"
~~~

Add the remote repository:

~~~bash
git remote add origin <repository-url>
~~~

Push the project:

~~~bash
git push -u origin main
~~~

---


