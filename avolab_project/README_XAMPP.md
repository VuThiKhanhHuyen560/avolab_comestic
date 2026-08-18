# AVOLAB COSMETICS — XAMPP + MySQL/MariaDB Local Setup

## Required
- XAMPP (Apache + MySQL)
- Node.js 18+
- VS Code

## 1. Put the project in XAMPP
Copy this project folder to:

`C:\xampp\htdocs\avolab-cosmetics`

The folder must contain `package.json`, `server.ts`, `database.sql`, `src/`, and `server/`.

## 2. Start XAMPP
Open XAMPP Control Panel and start:

- Apache
- MySQL

Apache is needed by the XAMPP environment; the application itself is served by Node/Vite on port 3000.

## 3. Create/import the MySQL database
Open:

`http://localhost/phpmyadmin`

You can either:

### Option A — easiest
Click **Import**, select `database.sql`, and run it.

The SQL file automatically creates and selects:

`avolab_cosmetics`

### Option B
Create a database named `avolab_cosmetics` first, then import `database.sql` into it.

The schema is now written for MySQL/MariaDB and no longer uses SQLite/sql.js syntax.

## 4. Open the project in VS Code
Open the project folder, then in the VS Code terminal run:

`npm install`

The project already includes `mysql2` in `package.json`.

If you want to install it explicitly:

`npm install mysql2`

## 5. Database connection
The included `.env` uses the standard XAMPP configuration:

- Host: `127.0.0.1`
- Port: `3306`
- User: `root`
- Password: empty
- Database: `avolab_cosmetics`

If your XAMPP MySQL root account has a password, edit `.env` and set `DB_PASSWORD` accordingly.

## 6. Start the application
Run:

`npm run dev`

Expected terminal output:

`[Database] Connected to MySQL/MariaDB 127.0.0.1:3306/avolab_cosmetics`

`[Database] MySQL database initialized successfully.`

`AVOLAB COSMETICS Server running on http://0.0.0.0:3000`

## 7. Open the web app
Open:

`http://localhost:3000`

Do NOT open the project by double-clicking `index.html`. The Node/Express/Vite server must be running.

## Architecture

React/Vite frontend
→ Express/Node.js backend
→ mysql2
→ XAMPP MySQL/MariaDB
→ `avolab_cosmetics` database

The old `sql.js` / SQLite persistence layer has been removed from the application runtime.
