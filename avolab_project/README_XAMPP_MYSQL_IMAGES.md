# AVOLAB COSMETICS — XAMPP + MySQL + Node.js

## Run
1. XAMPP: Start Apache and MySQL.
2. phpMyAdmin: import `database.sql` (it creates/uses `avolab_cosmetics`).
3. Open this folder in VS Code:
   `C:\xampp\htdocs\avolab_project`
4. Terminal:
   `npm install`
   `npm run dev`
5. Open:
   `http://localhost:3000`

## Image verification
Before opening the web app, open:
`http://localhost:3000/api/debug/images`

It returns every image file the server can see.

Then test:
`http://localhost:3000/images/avolab_hero_banner_1786551086361.jpg`

All image URLs in the React data use `/images/<filename>`.
The server now resolves images from multiple safe local roots and does not depend on the terminal's current directory.

## Important
Do not open `index.html` directly. Run `npm run dev` and open `http://localhost:3000`.
Do not delete `public/images`.
