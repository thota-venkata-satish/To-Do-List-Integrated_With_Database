# Todo List Web Application

A simple full-stack Todo List web application built using **Node.js, Express.js, EJS, and PostgreSQL**.

This project demonstrates how a web application can connect a frontend interface to a backend server and a relational database. Users can **add, view, edit, and delete tasks**, while PostgreSQL permanently stores the task data.

---

## 📌 Project Overview

The main purpose of this project is to understand how a complete web application works from the user's action to the database and back to the webpage.

The application follows this basic flow:

```text
User
  ↓
EJS Web Page
  ↓
Express.js Server
  ↓
PostgreSQL Database
  ↓
Express.js Server
  ↓
EJS Web Page
  ↓
Updated UI
```

For example, when a user adds a task:

```text
User enters task
       ↓
Clicks Add
       ↓
POST /add
       ↓
Express receives the request
       ↓
PostgreSQL INSERT query
       ↓
Task is stored in database
       ↓
Redirect to /
       ↓
Tasks are fetched again
       ↓
EJS displays updated task list
```

The same basic idea is used for editing and deleting tasks.

---

# 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime for the backend |
| Express.js | Web server and routing |
| EJS | Server-side HTML rendering |
| PostgreSQL | Relational database |
| `pg` | Node.js PostgreSQL driver |
| body-parser | Reading form data |
| JavaScript | Backend application logic |

The project uses ES Modules through `"type": "module"` in `package.json`.

---

# 🏗️ Application Architecture

The application has three main layers:

```text
┌───────────────────────┐
│       Frontend        │
│       EJS Page        │
└───────────┬───────────┘
            │
            │ HTTP Request
            ↓
┌───────────────────────┐
│       Backend         │
│   Node.js + Express   │
└───────────┬───────────┘
            │
            │ SQL Query
            ↓
┌───────────────────────┐
│       Database        │
│      PostgreSQL       │
└───────────────────────┘
```

### Frontend

The frontend is rendered using **EJS**.

The server sends database records to:

```text
views/index.ejs
```

The EJS page then displays the task list.

### Backend

The backend is implemented in:

```text
index.js
```

Express receives HTTP requests and decides what operation should be performed.

### Database

PostgreSQL stores the actual tasks.

The database table used by the project is:

```text
items
```

---

# 🔄 Complete Project Workflow

Understanding this workflow is the most important part of the project.

## 1. User Opens the Application

The user opens:

```text
http://localhost:3000
```

The browser sends:

```text
GET /
```

Express receives the request.

The backend executes:

```sql
SELECT * FROM items;
```

PostgreSQL returns the stored tasks.

The server passes the result to the EJS template:

```text
index.ejs
```

EJS generates the HTML page and sends it back to the browser.

### Flow

```text
Browser
   ↓
GET /
   ↓
Express
   ↓
SELECT * FROM items
   ↓
PostgreSQL
   ↓
Rows returned
   ↓
EJS
   ↓
HTML response
   ↓
Browser
```

---

# ➕ 2. Adding a Task

Suppose the user enters:

```text
Learn PostgreSQL
```

and clicks the **Add** button.

The form sends:

```text
POST /add
```

Express receives the form data using:

```javascript
req.body.newItem
```

The backend then executes an SQL `INSERT` query.

Conceptually:

```sql
INSERT INTO items (title)
VALUES ('Learn PostgreSQL');
```

The project uses a parameterized query:

```javascript
await db.query(
  "insert into items (title) values ($1)",
  [item]
);
```

This separates the SQL command from the user-provided value.

After inserting the task:

```text
POST /add
     ↓
INSERT task
     ↓
PostgreSQL
     ↓
redirect("/")
     ↓
GET /
     ↓
Fetch updated tasks
     ↓
Render EJS
```

---

# ✏️ 3. Editing a Task

Suppose the database contains:

```text
1  Learn PostgreSQL
```

The user changes it to:

```text
Learn PostgreSQL and SQL
```

The browser sends:

```text
POST /edit
```

The backend receives two important values:

```text
updatedItemTitle
updatedItemId
```

For example:

```text
ID = 1
New Title = Learn PostgreSQL and SQL
```

The backend executes:

```sql
UPDATE items
SET title = ...
WHERE id = ...;
```

In the application this is performed using a parameterized query.

### Flow

```text
User edits task
      ↓
POST /edit
      ↓
Get ID + new title
      ↓
UPDATE database
      ↓
PostgreSQL
      ↓
redirect("/")
      ↓
Fetch updated tasks
      ↓
Display updated task
```

---

# 🗑️ 4. Deleting a Task

When the user clicks delete, the browser sends:

```text
POST /delete
```

The backend receives:

```text
deleteItemId
```

For example:

```text
deleteItemId = 2
```

The server executes:

```sql
DELETE FROM items
WHERE id = 2;
```

The task is removed from PostgreSQL.

The application then redirects the user back to:

```text
/
```

### Flow

```text
User clicks Delete
       ↓
POST /delete
       ↓
Get task ID
       ↓
DELETE FROM items
       ↓
PostgreSQL
       ↓
redirect("/")
       ↓
Fetch remaining tasks
       ↓
Display updated list
```

---

# 🔁 CRUD Operations

This project demonstrates all four basic database operations.

| CRUD | SQL | Route | Purpose |
|---|---|---|---|
| Create | `INSERT` | `POST /add` | Add a task |
| Read | `SELECT` | `GET /` | Display tasks |
| Update | `UPDATE` | `POST /edit` | Edit a task |
| Delete | `DELETE` | `POST /delete` | Remove a task |

Remember:

```text
CREATE → INSERT
READ   → SELECT
UPDATE → UPDATE
DELETE → DELETE
```

---

# 🗄️ Database Design

The project uses a PostgreSQL table called:

```text
items
```

The table is created using:

```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);
```



## Table Structure

| Column | Data Type | Constraint | Purpose |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Unique task ID |
| `title` | VARCHAR(100) | NOT NULL | Task description |

Example data:

```text
id    title
-------------------------
1     Buy milk
2     Finish homework
```

The SQL file also contains sample records for testing.

---

# 🔐 Database Connection

The backend connects Node.js to PostgreSQL using the `pg` package.

The connection uses environment variables:

```text
PG_USER
PG_HOST
PG_DATABASE
PG_PASSWORD
PG_PORT
```

This keeps database configuration outside the main source code.

The `.env` file should **never be uploaded to GitHub** because it contains database credentials.

---

# 📂 Project Structure

```text
todo-list-node-postgresql/
│
├── public/
│   └── static files
│
├── views/
│   └── index.ejs
│
├── index.js
├── queries.sql
├── package.json
├── package-lock.json
├── .gitignore
├── .env
└── README.md
```

### `index.js`

Main backend file.

It:

- Creates the Express application
- Connects to PostgreSQL
- Configures middleware
- Defines routes
- Executes SQL queries
- Starts the server

### `views/index.ejs`

Frontend template used to display the task list.

### `queries.sql`

Contains the SQL required to create the database table and insert sample tasks.

### `package.json`

Contains project information, scripts, and dependencies.

The current project uses Express, EJS, PostgreSQL (`pg`) and `body-parser`.

### `.env`

Contains local database configuration.

**Do not commit this file.**

### `.gitignore`

Prevents files such as `.env` and `node_modules` from being committed.

---

# 🌐 Routes

The backend contains four main routes:

## `GET /`

Used to retrieve all tasks from PostgreSQL and render the task page.

```text
GET /
```

Database operation:

```sql
SELECT
```

---

## `POST /add`

Used to create a new task.

```text
POST /add
```

Database operation:

```sql
INSERT
```

---

## `POST /edit`

Used to update an existing task.

```text
POST /edit
```

Database operation:

```sql
UPDATE
```

---

## `POST /delete`

Used to remove a task.

```text
POST /delete
```

Database operation:

```sql
DELETE
```

---

# 🧠 Important Concepts Used

This project is useful for revising several backend concepts.

### 1. Express.js

Express handles:

- Server creation
- Routing
- Middleware
- HTTP requests and responses

---

### 2. Middleware

The application uses middleware to process incoming form data and serve static files.

```javascript
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
```

---

### 3. EJS

EJS allows the backend to send database information to an HTML template.

Conceptually:

```text
Database
   ↓
Express
   ↓
EJS variables
   ↓
HTML
   ↓
Browser
```

---

### 4. PostgreSQL

PostgreSQL provides persistent storage.

Without the database, tasks would only exist temporarily in application memory.

With PostgreSQL:

```text
Application restart
       ↓
Database still contains tasks
       ↓
Tasks can be retrieved again
```

---

### 5. `pg`

The `pg` package allows Node.js to communicate with PostgreSQL.

```text
Node.js
   ↓
pg
   ↓
PostgreSQL
```

---

### 6. Parameterized Queries

The application uses queries such as:

```javascript
db.query(
  "INSERT INTO items (title) VALUES ($1)",
  [item]
);
```

Here `$1` represents the value supplied separately to the query.

This is preferable to directly constructing SQL strings with user input.

---

# 🧪 Running the Project Locally

## 1. Clone the repository

```bash
git clone <repository-url>
```

## 2. Enter the project

```bash
cd todo-list-node-postgresql
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure PostgreSQL

Create a PostgreSQL database.

Then run the SQL commands from:

```text
queries.sql
```

This creates the required `items` table.

## 5. Create `.env`

Create a `.env` file in the project root:

```env
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=your_database
PG_PASSWORD=your_password
PG_PORT=5432
```

## 6. Start the server

```bash
npm start
```

The server runs on:

```text
http://localhost:3000
```

---

# 🚀 Future Improvements

Possible improvements for the project:

- Add task completion status
- Add due dates
- Add task priority
- Add categories
- Add search functionality
- Add filtering
- Add user authentication
- Add multiple users
- Improve validation
- Add better error handling
- Deploy the application online

---

# 📚 Project Revision Summary

If you need to revise this project quickly, remember this:

```text
                TODO LIST
                    │
                    ↓
             EJS Frontend
                    │
             HTTP Requests
                    │
                    ↓
             Express Backend
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
      Add          Edit       Delete
        │           │           │
        └───────────┼───────────┘
                    ↓
              PostgreSQL
                    │
             items table
                    │
                    ↓
                 SELECT
                    │
                    ↓
             Express + EJS
                    │
                    ↓
              Updated Page
```

### One-line explanation

> **EJS provides the UI, Express handles the requests, Node.js runs the backend, `pg` connects the backend to PostgreSQL, and PostgreSQL stores the tasks.**

### Complete request cycle

```text
User Action
    ↓
HTML Form
    ↓
HTTP Request
    ↓
Express Route
    ↓
req.body
    ↓
SQL Query
    ↓
PostgreSQL
    ↓
Result
    ↓
Redirect / Render
    ↓
EJS
    ↓
Updated Web Page
```

---

# 👨‍💻 Author

**Venkatasatish Thota**

This project was developed as a backend/full-stack learning project to understand **Node.js, Express.js, EJS, PostgreSQL, SQL CRUD operations, and database integration**.
