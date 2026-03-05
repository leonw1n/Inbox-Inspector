# Inbox Inspector

A Papers Please-inspired phishing email detection game built with React and Next.js.
Developed as the capstone project for **CodePath CYB101**.

Play as a government email inspector tasked with classifying incoming transmissions
as legitimate or fraudulent before your clearance is revoked.

<img width="2008" height="1442" alt="image" src="https://github.com/user-attachments/assets/b16566b2-083c-4e03-9492-a93ef214a4af" />


## About

This project was created as the final capstone for **CodePath CYB101 (Introduction to 
Cybersecurity)**. It applies core concepts from the course — phishing awareness, social 
engineering tactics, and email security — in an interactive game format.

## Gameplay

- Review 8 realistic emails in a retro 1994 terminal interface
- Classify each as **[A] Legitimate** or **[D] Phishing**
- You have 3 lives — too many errors and your clearance is revoked
- Evidence logs and explanations after each decision teach you real phishing red flags

## Features

- Retro CRT terminal aesthetic (Papers Please x 90s email client)
- Procedural sound effects via the Web Audio API — no audio files
- Stamp animation on classification
- Inspector Notes & Field Guide sidebar with real detection tips
- Keyboard shortcuts (A / D / ESC / Enter)
- Score multiplier for consecutive correct answers

## Tech Stack

- React + Next.js (App Router)
- Web Audio API (procedural sound synthesis)
- CSS-in-JS (inline styles)
- Google Fonts (VT323, Special Elite)

## Getting Started
```bash
cd inbox-inspector
cd app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Educational Purpose

Built to reinforce cybersecurity awareness through gameplay. Each phishing email 
teaches a real detection technique — domain spoofing, digit substitution, urgency 
tactics, credential harvesting, and more. Evidence logs after each round explain 
exactly what made an email suspicious.

## Acknowledgements

- **CodePath** — CYB101 curriculum and instruction
- **Papers Please** by Lucas Pope — design inspiration

## License

MIT
