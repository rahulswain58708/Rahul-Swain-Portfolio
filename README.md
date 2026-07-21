# Rahul Swain — Personal Brand Site

A redesigned, premium personal-branding portfolio for Rahul Swain — Tech
Entrepreneur, founder of **MediaSpectAI**, and author of **PySimplify**.

🔗 Live demo: https://rahul-swain-woad.vercel.app/
✉ Email: rahulswain18182112@gmail.com

---

## What changed in this redesign
- New visual identity: "Verified" — a forensic scan-reticle motif (corner
  brackets + scanning line) borrowed from the MediaSpectAI mark, paired with
  a duotone cyan/amber palette pulled from the PySimplify cover.
- New typography system: **Space Grotesk** (display), **Inter** (body),
  **JetBrains Mono** (eyebrows / scan-readout labels).
- New **Build in Public** section featuring the YouTube channel
  (@rahulswaintech), channel banner, and an official YouTube subscribe
  widget embed.
- Scroll-reveal animations, hover micro-interactions, animated hero scan
  line, sticky glass header with active-section highlighting.
- Fully responsive down to mobile, keyboard-focus visible, respects
  `prefers-reduced-motion`.

## Tech
- **HTML5** — structure
- **CSS3** — custom property design-token system, Flexbox + Grid
- **JavaScript (vanilla)** — smooth scroll, active-nav, IntersectionObserver
  reveal animation, contact form validation

## Project structure
```
├─ index.html
├─ style.css
├─ script.js
├─ assets/
│  ├─ profile_picture.png
│  ├─ logo2.png              ← MediaSpectAI logo
│  ├─ PySimplify_EBook.png   ← ebook cover
│  └─ youtube-channel.png    ← YouTube channel banner
└─ README.md
```

## Notes for deployment
- The YouTube subscribe embed uses channel ID `UCMa6j5HASNh1Xlb9l3RRLaQ`.
  If YouTube ever changes/deprecates the `subscribe_embed` endpoint, the
  "Subscribe on YouTube" button next to it still links directly to the
  channel, so the CTA never breaks.
- Swap `assets/youtube-channel.png` for an updated banner export any time
  the channel art changes — no other code needs to change.