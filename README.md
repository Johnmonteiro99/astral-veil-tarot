# Astral Veil

Astral Veil is a cinematic tarot web experience built with HTML, CSS, and vanilla JavaScript. It is designed for entertainment, reflection, atmosphere, and symbolic storytelling.

## Features

- Sun and moon theme toggle with saved theme preference.
- Responsive glassmorphism navigation with mobile dropdown.
- Astral Veil reader selection with normal Veilwalkers and a weighted Mystery Reader system.
- Rare Blood Moon mode for Zephyra Noctis with crimson styling and Scorpio constellation accents.
- 3-card, 5-card, and 7-card readings.
- Animated card reveal flow with focused reading viewer.
- Custom Major Arcana deck gallery and card lightbox.
- Veilwalkers page with reader profiles and mystery reader lore.
- About page with future-world lore and entertainment disclaimer.
- Responsive footer with creator credit and personal website link.

## Pages

- `index.html` - tarot reading experience
- `readers.html` - Veilwalkers / Order of the Veil
- `deck.html` - Major Arcana deck gallery
- `about.html` - project vision, disclaimer, and future lore

## Folder Structure

```text
daily-tarot-app/
├── index.html
├── readers.html
├── deck.html
├── about.html
├── favicon.svg
├── css/
│   ├── style.css
│   ├── animations.css
│   ├── reading.css
│   ├── readers.css
│   └── deck.css
├── data/
│   ├── cards.js
│   └── readers.js
├── js/
│   ├── app.js
│   ├── reading.js
│   ├── readers.js
│   └── deck.js
└── assets/
    └── images/
        ├── cards/
        └── readers/
```

## How To Run

Open `index.html` directly in a browser, or serve the folder with any static server. No backend, build step, or API key is required.

## Testing Hooks

- Add `?bloodMoon=1` or `?testBloodMoon=1` to any page URL to activate the Blood Moon event for the current browser session.
- Add `?bloodMoon=0` to clear the Blood Moon event.

## Publishing Notes

All paths are relative and domain-ready for static hosting. Large card and reader images should be compressed before production deployment for faster first load.

## Disclaimer

Astral Veil is for entertainment and reflective purposes only. It is not intended to predict the future with certainty or provide professional advice.
