# AVOLAB - FINAL IMAGE FIX

This version keeps the XAMPP + MySQL + mysql2 architecture and changes image delivery to an explicit binary Express handler.

## Run
1. Start Apache and MySQL in XAMPP.
2. Open this folder in VS Code.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

## Verify image delivery
Open:
`http://localhost:3000/api/debug/images`

Then open:
`http://localhost:3000/images/avolab_hero_banner_1786551086361.jpg`

The terminal should print:
`[Images] 200 avolab_hero_banner_1786551086361.jpg (...) bytes`

Test another product image:
`http://localhost:3000/images/avolab_cleanser_tube_1786632315682.jpg`

If the terminal does NOT print the `[Images] 200` line when opening the image URL, the browser is hitting a different Node process/project. Stop every old `npm run dev`/`node` process, close the old VS Code terminal, reopen this exact folder, and run `npm run dev` again.
