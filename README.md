🍪 Cookie Transparency Dashboard
Chrome Extension — Milestone Artifact

Author: Josh DeMarco
Course: IS 393 — SPUR
Artifact Type: Functional Browser Extension
Last Updated: December 2025

📌 Overview

The Cookie Transparency Dashboard is a Chrome extension designed to make website cookie practices understandable and transparent for everyday users. While most websites set numerous cookies—many of which relate to analytics, tracking, or personalization—users typically lack the information needed to understand what they do or assess their privacy impact.

This extension provides:

✔ A scan of all cookies used by the current site

✔ Automatic detection of cookie purpose (Necessary, Functional, Analytics, Advertising)

✔ Identification of first-party vs. third-party cookies

✔ A transparency score (0–100) summarizing the site's privacy practices

✔ Detailed plain-language explanations for each cookie

✔ Smart categorization using heuristics and pattern mapping

✔ Lookup links to Cookiepedia and other external resources

✔ A clean, accessible dashboard interface

This artifact is self-contained and requires no external services or API keys.

🧠 Motivation

Most users encounter cookie banners that provide little meaningful information beyond “Accept” or “Manage Preferences.” The terminology is confusing, the technology is hidden, and users rarely understand:

What cookies are being set

Who is setting them

How long they last

Whether they track behavior

Whether they belong to the site or to third-party advertisers

Research has repeatedly shown that users struggle with informed consent in web privacy. This dashboard aims to increase comprehension by providing:

Clear categories

Visualizations

Plain-language explanations

External references

This supports the educational goals of the course by improving users’ understanding of online tracking practices.

⚙️ Features
🔍 Automatic Cookie Scan

Upon opening the popup, the extension automatically scans all cookies used by the active webpage.

🧾 Categorization

Cookies are classified using a combined heuristic system:

Necessary – login/session/security

Functional – preferences, settings

Analytics – GA, Hotjar, Mixpanel, etc.

Advertising – Facebook, TikTok, Criteo, DoubleClick

Uncategorized – rare cookies that don’t fit patterns

The extension uses:

smart pattern recognition

domain matching

vendor detection

fallbacks for unknown names

🔐 Security Attribute Summary

Shows whether each cookie uses:

Secure

HttpOnly

SameSite

📈 Transparency Score (0–100)

Calculated using:

number of tracking cookies

third-party cookies

long-lived cookies

missing security flags

Scores are labeled:

Good

Fair

Poor

📊 Category Visualization

Colored bars show what percentage of cookies fall in each category.

📘 Cookiepedia Integration

For any cookie, users can view more information using:

🔍 Cookiepedia search

📘 CookieServe lookup

🌐 Google “What is ___ cookie?”

Especially useful for “Uncategorized” cookies.

🗂️ Project Structure
Cookie_Transparency_Dashboard/
│
├── manifest.json          # Chrome extension manifest (v3)
├── popup.html             # Main popup UI
├── popup.js               # Logic, categorization, scoring, Cookiepedia lookup
├── popup.css              # Styling for popup
├── background.js          # Minimal service worker for lifecycle logging
└── icons/ (optional)      # Icon assets (if added)

🚀 Installation / Running the Extension

Download or unzip the full project folder.

Open Chrome and go to:

chrome://extensions


Enable Developer Mode (top-right toggle).

Click Load Unpacked.

Select the project folder.

Visit any website and click the extension icon to view the dashboard.

🧪 How to Use

Browse to any site (e.g., nytimes.com, amazon.com).

Click the Cookie Transparency Dashboard extension icon.

View:

total cookies

first-party vs third-party

category bars

transparency score

Click any cookie to see:

plain-language explanation

security attributes

lifespan

Cookiepedia lookup link

Use the tool to compare cookies across websites.

📊 Evaluation Plan (For Final Project)

This tool is designed for a pre/post comprehension study.

Participants will:

Pre-Survey

What are cookies used for?

Can you identify a tracking cookie?

Do you know how long cookies last?

Interaction Phase

Participants use the extension on 2–3 websites.

Post-Survey

Did the dashboard help you understand cookie behaviors?

Are you more aware of third-party tracking?

Would this change how you respond to cookie popups?

Metrics include:

improved correctness on definition questions

increased recognition of third-party trackers

transparency score interpretation

user satisfaction ratings

🧩 Technical Notes

Runs entirely using Chrome’s cookies API (Manifest V3).

No external APIs required.

Does not block cookies or modify website behavior.

Designed purely for transparency and education.

Pattern recognizer uses lightweight heuristic rules for high accuracy.

Fully self-contained for grading and reproducibility.

🔒 Privacy & Security Considerations

The extension does not store or transmit any user data.

All processing occurs locally in the browser.

No cookies are blocked, overwritten, or modified.

No personal information is collected.

External searches open in a new tab only when clicked by the user.

🧾 License

This artifact is for academic purposes as part of coursework at NJIT and is not intended for production use.
