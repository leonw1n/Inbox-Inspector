# Inbox Inspector

A Papers Please-inspired phishing email detection game built with React and Next.js.
Developed as the capstone project for **CodePath CYB101**.

Play as a government email inspector tasked with classifying incoming transmissions
as legitimate or fraudulent before your clearance is revoked.

## Screenshots

## Menu
<img width="1200" height="800" alt="image" src="https://github.com/user-attachments/assets/b16566b2-083c-4e03-9492-a93ef214a4af" />
### Inbox
<img width="1988" height="1422" alt="image" src="https://github.com/user-attachments/assets/4590d44e-66e0-4152-b2dd-a865866059bb" />

### Email Review
<img width="1984" height="1440" alt="image" src="https://github.com/user-attachments/assets/a5f15fdd-f23d-4a35-8457-7a66ec431265" />

### Evidence Log
<img width="1986" height="1424" alt="image" src="https://github.com/user-attachments/assets/910f6aa3-aaa0-4f59-90af-76fef07af67d" />


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
