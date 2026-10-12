# Sreejani's Birthday Website ♡

A responsive, chapter-by-chapter birthday website made with plain HTML, CSS, and JavaScript.

## What's included
- Dreamy pastel-blue princess/goddess aesthetic
- 10 chapters with click-to-reveal navigation
- Interactive birthday cake and wish
- Personal love letter in an opening envelope
- Clickable reasons-I-love-you cards
- 100-meets tracker, initially set to 13/100
- Starry romantic chapter
- Gift box reveal
- Cute/funny editable relationship quiz
- Photo gallery with enlarged image dialog
- Clickable secret notes
- Music player placeholder
- Final love confession and heart-burst animation
- Responsive layout and reduced-motion support

## Run it locally
1. Download and unzip `sreejani-birthday-website.zip`.
2. Open the `sreejani-birthday-website` folder.
3. Double-click `index.html` to open it in a modern browser.

If your browser restricts local audio or some file behavior, run a local server instead:
- In VS Code, install/use the Live Server extension and choose **Open with Live Server**.
- Or, if Python is installed, open a terminal in the folder and run `python -m http.server 8000`, then visit `http://localhost:8000`.

No build step or package installation is needed.

## Add your real photos
1. Put copies of your photos inside `assets/photos/`.
2. Recommended: use filenames such as `us-01.jpg`, `date-02.jpg`, etc.
3. In `index.html`, find each `assets/photos/photo-placeholder.svg` and replace it with the matching filename, for example `assets/photos/us-01.jpg`.
4. Update each image's `alt` text to describe the photo.
5. Keep your originals backed up. If you publish the site, the images you include may be publicly accessible to anyone with the URL.

The current placeholder is an SVG illustration included in this folder, so the website looks complete before you add photos.

## Add your song
1. Choose an audio file you have permission to use.
2. Name it `our-song.mp3`.
3. Put it in the `assets/` folder, next to this README's `assets` directory.
4. The player is already configured to use `assets/our-song.mp3`.
5. Refresh the page. The song only plays when the visitor presses the play button.

If your file is `.ogg` or `.wav`, update the `<source>` in `index.html` to match the filename and MIME type. Do not upload copyrighted music to a public site unless you have the right to do so.

## Personalize the content
- **Birthday:** update `BIRTHDAY` at the top of `script.js` if the date changes.
- **100-meets count:** change `INITIAL_MEETS` in `script.js`. The current value is 13.
- **Quiz:** edit the `quizQuestions` array in `script.js`. Each question has a `question`, `options`, zero-based `answer`, `correct`, and `wrong` message.
- **Reasons:** edit the `data-reason` attributes on `.reason-card` buttons in `index.html`.
- **Secret notes:** edit the `data-secret` attributes on `.secret-star` buttons.
- **Love letter and final message:** edit the text directly in `index.html`.
- **Colors:** change the CSS custom properties at the top of `style.css`.

The first 13 tracker hearts are deliberately generic because the actual details of your first 13 meets weren't provided. You can add captions/photos when you are ready.

## Publish it online
You can publish this static site with GitHub Pages, Netlify, or Cloudflare Pages:
1. Keep `index.html`, `style.css`, `script.js`, and the `assets/` folder together.
2. Upload the project to your chosen static hosting service.
3. Set the publishing/root directory to the folder containing `index.html`.
4. Open the generated site URL on your phone and test the navigation, photos, audio, and all interactions.

**Privacy note:** a public website is accessible to anyone who has its URL (and sometimes may be indexed). Avoid adding private information or intimate photos unless you are comfortable with that. You can keep the project local or share it privately instead.

## Browser support
Designed for recent versions of Chrome, Firefox, Safari, and Edge. The site uses modern CSS and the native HTML `<dialog>` element for the photo viewer, with a simple fallback message where supported features are missing.
