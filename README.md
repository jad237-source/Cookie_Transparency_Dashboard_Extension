# 🍪 Cookie Transparency Dashboard  
### Chrome Extension — Milestone Artifact (IS 393 — SPUR)

**Author:** Josh DeMarco  
**Type:** Functional Browser Extension  
**Last Updated:** December 2025  

---

## 📌 Overview  
The **Cookie Transparency Dashboard** is a Chrome extension that helps users understand how websites use cookies. Most websites store analytics, tracking, advertising, and personalization cookies — but users rarely understand what they do or why they exist.

This extension makes cookies **transparent**, providing:

- ✔ Automatic scanning of cookies used by the active tab  
- ✔ Detection of cookie purpose (Necessary, Functional, Analytics, Advertising)  
- ✔ First-party vs. third-party classification  
- ✔ A dynamic “Transparency Score” (0–100) summarizing privacy practices  
- ✔ Detailed plain-language explanations for each cookie  
- ✔ Smart heuristic categorization + vendor/pattern detection  
- ✔ Lookup links to Cookiepedia, CookieServe, and Google  
- ✔ A clean, accessible dashboard interface  

This artifact is **self-contained** and requires **no external APIs**.

---

## 🧠 Motivation  
Modern cookie banners often provide confusing or incomplete information. Users struggle to understand:

- What cookies are being set  
- Who controls those cookies  
- How long cookies last  
- Whether cookies track behavior  
- Whether cookies belong to third-party advertisers or trackers  

Research repeatedly shows that users have difficulty giving “informed consent” online.  
This dashboard aims to improve comprehension by providing:

- **Clear categories**  
- **Intuitive visualizations**  
- **Plain-language explanations**  
- **Links to external references**  

The tool supports the SPUR project goal of improving users’ understanding of privacy and tracking practices across the web.

---

## ⚙️ Features  

### 🔍 Automatic Cookie Scan  
The extension automatically scans all cookies used by the current webpage as soon as the popup is opened.

---

### 🧾 Smart Categorization  
Cookies are classified using a hybrid pattern-based and heuristic system:

**Categories:**
- **Necessary** — session management, authentication, security  
- **Functional** — preferences, UI settings  
- **Analytics** — Google Analytics, Hotjar, Segment, Mixpanel, etc.  
- **Advertising** — Facebook Pixel, TikTok Ads, DoubleClick, Criteo  
- **Uncategorized** — custom or unusual cookies  

**Detection Techniques Include:**
- Known vendor prefixes (`_ga`, `_gid`, `_fbp`, `_gcl_`, `mp_`, `ajs_`, etc.)  
- Domain-based inference  
- Security flags  
- Lifespan analysis  
- Fallback matching  

This dramatically reduces “Uncategorized” cookies.

---

### 🔐 Security Attribute Summary  
For each cookie, the dashboard shows:

- Whether `Secure` is set  
- Whether `HttpOnly` is set  
- The cookie’s `SameSite` setting  

This helps users understand whether a cookie is protected against common attacks.

---

### 📈 Transparency Score (0–100)  
The extension generates a score based on:

- Number of advertising cookies  
- Number of analytics cookies  
- Number of third-party cookies  
- Missing security attributes  
- Long-lived cookie lifespans  

The final score is categorized as:

- 🟢 **Good**  
- 🟡 **Fair**  
- 🔴 **Poor**  

Each rating includes a plain-language explanation.

---

### 📊 Category Visualization  
A horizontal bar chart shows the cookie distribution across categories, color-coded for clarity.

---

### 📘 Cookiepedia Integration  
For deeper research, each cookie includes one-click links to:

- 🔍 Cookiepedia search  
- 📘 CookieServe lookup  
- 🌐 Google “What is ___ cookie?” search  

Helpful for uncommon or ambiguous cookies.

---

## 🗂️ Project Structure

Cookie_Transparency_Dashboard/

├── manifest.json # Chrome extension manifest (Manifest V3)

├── popup.html # Main popup UI

├── popup.js # Logic, cookie processing, scoring, categorization

├── popup.css # Dashboard styling

├── background.js # Lightweight service worker for lifecycle events

└── icons/ # (Optional) Extension icon assets

---

## 🚀 Installation (Load Unpacked)

1. **Download** or **clone** the entire project folder  
2. Open Chrome and visit:  chrome://extensions
3. Enable **Developer Mode** in the top right  
4. Click **Load Unpacked**  
5. Select the project directory  
6. Visit any website → click the extension icon → view your dashboard  

---

## 🧪 How to Use

1. Navigate to any website (e.g., `nytimes.com`, `amazon.com`)  
2. Click the Cookie Transparency Dashboard extension icon  
3. Review:
   - Total cookies on the page  
   - First-party vs. third-party breakdown  
   - Category distribution  
   - Transparency Score  
4. Click individual cookies to view:
   - What category they belong to  
   - How long they last  
   - Their security attributes  
   - First-party vs. third-party status  
   - Cookiepedia lookup link  

Use this tool to compare privacy practices between websites.

---

## 📊 Evaluation Plan (For Final Project)

Designed for a **pre/post comprehension study**.

### **Pre-Survey**
Participants answer:
- “What are cookies used for?”  
- “Can you identify a tracking cookie?”  
- “Do you know how long cookies last?”  

### **Interaction Phase**
Participants use the extension on 2–3 websites.

### **Post-Survey**
Participants answer:
- “Did the dashboard improve your understanding of cookies?”  
- “Do you better recognize third-party trackers?”  
- “Would this change how you respond to cookie banners?”  

### **Metrics**
- Increase in accuracy of definitions  
- Recognition of analytics/advertising cookies  
- Better transparency score interpretation  
- Qualitative usability feedback  

---

## 🧩 Technical Notes  
- Built entirely with **Chrome’s cookies API** (Manifest V3 compliant)  
- No backend needed; all code runs client-side  
- No data is stored, logged, or transmitted  
- The extension is **read-only** — it does not block or modify cookies  
- Categorization uses heuristic logic optimized for accuracy and simplicity  

---

## 🔒 Privacy & Security  

- 🚫 No personal data is collected  
- 🚫 No analytics or tracking within the extension  
- 🚫 No cookies are modified, deleted, or blocked  
- ✔ All processing happens locally in the browser  
- ✔ External searches only occur when users click a link  

---

## 🧾 License  
This project was created as part of the **SPUR program at NJIT** and is intended for academic and educational use only.

