// popup.js

// Heuristic category detection based on cookie name and domain
function categorizeCookie(cookie, siteHostname) {
  const name = cookie.name.toLowerCase();
  const domain = (cookie.domain || "").toLowerCase();

  // Necessary
  const necessaryPatterns = [
    "session", "sessid", "phpSESSID".toLowerCase(),
    "auth", "csrf", "xsrf", "secure_session", "login"
  ];

  // Analytics
  const analyticsPatterns = [
    "_ga", "_gid", "analytics", "mixpanel", "segment", "amplitude",
    "hotjar", "matomo"
  ];

  // Advertising
  const adsPatterns = [
    "ad", "ads", "doubleclick", "googleadservices", "gclid",
    "fbp", "fbc", "facebook", "criteo", "taboola",
    "outbrain", "bing", "tiktok", "track", "pixel"
  ];

  // Functional
  const functionalPatterns = [
    "pref", "prefs", "lang", "locale", "theme", "remember", "cookieconsent"
  ];

  const matchesAny = (patterns) =>
    patterns.some((p) => name.includes(p) || domain.includes(p));

  if (matchesAny(necessaryPatterns)) return "Necessary";
  if (matchesAny(analyticsPatterns)) return "Analytics";
  if (matchesAny(adsPatterns)) return "Advertising";
  if (matchesAny(functionalPatterns)) return "Functional";

  return "Uncategorized";
}

// First-party vs third-party (approximate)
function isFirstParty(cookie, siteHostname) {
  if (!siteHostname) return true;
  const cookieDomain = (cookie.domain || "").replace(/^\./, "").toLowerCase();
  const host = siteHostname.toLowerCase();
  return host.endsWith(cookieDomain) || cookieDomain.endsWith(host);
}

// Lifetime in days (if persistence)
function getLifetimeDescription(cookie) {
  if (!cookie.expirationDate) {
    return "Session (until browser closes)";
  }
  const now = Date.now() / 1000;
  const seconds = cookie.expirationDate - now;
  const days = Math.max(0, seconds / 86400);
  if (days < 1) return "< 1 day";
  if (days < 7) return `${days.toFixed(1)} days`;
  if (days < 365) return `${(days / 7).toFixed(1)} weeks`;
  return `${(days / 365).toFixed(1)} years`;
}

function estimateLifetimeRisk(cookie) {
  if (!cookie.expirationDate) return 0; // session cookies low risk
  const now = Date.now() / 1000;
  const days = (cookie.expirationDate - now) / 86400;
  if (days <= 7) return 0;
  if (days <= 365) return 1;
  return 2; // more than a year
}

// Security flags summary
function getSecuritySummary(cookie) {
  const parts = [];
  if (cookie.secure) parts.push("Secure");
  if (cookie.httpOnly) parts.push("HttpOnly");
  if (cookie.sameSite) parts.push(`SameSite=${cookie.sameSite}`);
  if (parts.length === 0) {
    return "No security flags";
  }
  return parts.join(", ");
}

function estimateSecurityRisk(cookie, tabUrl) {
  const url = new URL(tabUrl);
  const isHttps = url.protocol === "https:";
  let risk = 0;

  // Missing Secure on HTTPS site
  if (isHttps && !cookie.secure) risk += 1;

  // Missing HttpOnly
  if (!cookie.httpOnly) risk += 1;

  return risk;
}

// Plain-language explanation per category + some extra based on flags
function explainCookie(cookie, category, isFirstPartyFlag) {
  const lifetime = getLifetimeDescription(cookie);
  const security = getSecuritySummary(cookie);

  const cookiepediaURL = `https://www.cookie.is/${encodeURIComponent(cookie.name)}`;

  const baseByCategory = {
    "Necessary":
      "This cookie is likely used for core site functionality, such as keeping you logged in or maintaining a secure session.",
    "Functional":
      "This cookie probably remembers your preferences, such as language, layout, or other customization settings.",
    "Analytics":
      "This cookie appears to be used for analytics, like counting visitors, understanding traffic sources, or measuring how you use the site.",
    "Advertising":
      "This cookie is likely used for advertising or tracking across sites, which can be used to build a profile or show targeted ads.",
    "Uncategorized":
      "The purpose of this cookie is not obvious from its name or domain. It may be custom to this site."
  };

  const partyText = isFirstPartyFlag
    ? "Because it is set by the same site you are visiting, it is considered a first-party cookie."
    : "Because it is set by a different domain than the one you are visiting, it is considered a third-party cookie.";

  const securityText =
    security === "No security flags"
      ? "It does not use common security flags like Secure or HttpOnly, which may make it easier for other scripts to access."
      : `It uses the following security attributes: ${security}.`;

  return `
    <strong>${cookie.name}</strong><br/>
    Category: <strong>${category}</strong><br/>
    ${baseByCategory[category]}<br/><br/>

    ${partyText}<br/>
    It is set to last: <strong>${lifetime}</strong>.<br/>
    ${securityText}<br/><br/>

    <hr/>

    <h3>More Information</h3>
    <p>
      Click below to view detailed information about this cookie (owner, usage, tracking behavior, risks)
      on Cookiepedia:
    </p>

    <a href="${cookiepediaURL}" target="_blank" class="cookiepedia-link">
      🔍 View "${cookie.name}" on Cookiepedia
    </a>
  `;
}


// Compute transparency score (0–100) based on simple heuristic
function computeTransparencyScore(cookies, siteHostname, tabUrl) {
  if (!cookies.length) return { score: 100, label: "Good", explanation: "No cookies detected for this site in this context." };

  let score = 100;
  let advertisingCount = 0;
  let analyticsCount = 0;
  let longLivedCount = 0;
  let insecureFlagsCount = 0;
  let thirdPartyCount = 0;

  cookies.forEach((cookie) => {
    const category = categorizeCookie(cookie, siteHostname);
    const isFirst = isFirstParty(cookie, siteHostname);

    if (!isFirst) {
      thirdPartyCount += 1;
      score -= 2;
    }

    if (category === "Advertising") {
      advertisingCount += 1;
      score -= 4;
    } else if (category === "Analytics") {
      analyticsCount += 1;
      score -= 2;
    }

    longLivedCount += estimateLifetimeRisk(cookie);
    insecureFlagsCount += estimateSecurityRisk(cookie, tabUrl);
  });

  score -= longLivedCount * 2;
  score -= insecureFlagsCount * 2;

  // Clamp
  score = Math.max(0, Math.min(100, score));

  let label = "Good";
  let explanation = "This site appears relatively transparent and limited in its use of long-lived or cross-site tracking cookies.";

  if (score < 70 && score >= 40) {
    label = "Fair";
    explanation = "This site uses some analytics, advertising, or long-lived cookies. Consider reviewing its cookie settings.";
  } else if (score < 40) {
    label = "Poor";
    explanation = "This site appears to rely heavily on tracking, advertising, or long-lived cookies with weaker security attributes.";
  }

  // Add some detail counts
  explanation += `<br/><br/>Highlights:<br/>
  • Advertising cookies: ${advertisingCount}<br/>
  • Analytics cookies: ${analyticsCount}<br/>
  • Third-party cookies: ${thirdPartyCount}<br/>
  • Cookies with long lifetimes or weaker security: ${longLivedCount + insecureFlagsCount}
  `;

  return { score, label, explanation };
}

// Render category bars
function renderCategoryBars(cookies, siteHostname) {
  const container = document.getElementById("category-bars");
  container.innerHTML = "";

  const categories = ["Necessary", "Functional", "Analytics", "Advertising", "Uncategorized"];
  const counts = {
    Necessary: 0,
    Functional: 0,
    Analytics: 0,
    Advertising: 0,
    Uncategorized: 0
  };

  cookies.forEach((cookie) => {
    const cat = categorizeCookie(cookie, siteHostname);
    counts[cat] += 1;
  });

  const total = cookies.length || 1;

  categories.forEach((cat) => {
    const count = counts[cat];
    const pct = (count / total) * 100;

    const row = document.createElement("div");
    row.className = "category-row";

    const label = document.createElement("span");
    label.className = "category-label";
    label.textContent = `${cat} (${count})`;

    const barOuter = document.createElement("div");
    barOuter.className = "category-bar-outer";

    const barInner = document.createElement("div");
    barInner.className = "category-bar-inner";
    switch (cat) {
      case "Necessary":
        barInner.classList.add("necessary");
        break;
      case "Functional":
        barInner.classList.add("functional");
        break;
      case "Analytics":
        barInner.classList.add("analytics");
        break;
      case "Advertising":
        barInner.classList.add("advertising");
        break;
      default:
        barInner.classList.add("unknown");
    }
    barInner.style.width = pct + "%";

    barOuter.appendChild(barInner);
    row.appendChild(label);
    row.appendChild(barOuter);

    container.appendChild(row);
  });
}

// Render cookie table
function renderCookieTable(cookies, siteHostname, tabUrl) {
  const tbody = document.getElementById("cookie-table-body");
  const explanationBox = document.getElementById("cookie-explanation");
  tbody.innerHTML = "";
  explanationBox.innerHTML = "<strong>Cookie explanation will appear here when you select a row.</strong>";

  cookies.forEach((cookie, index) => {
    const tr = document.createElement("tr");
    const cat = categorizeCookie(cookie, siteHostname);
    const first = isFirstParty(cookie, siteHostname);
    const lifetimeDesc = getLifetimeDescription(cookie);
    const security = getSecuritySummary(cookie);

    const nameTd = document.createElement("td");
    nameTd.textContent = cookie.name || "(no name)";

    const domainTd = document.createElement("td");
    domainTd.textContent = cookie.domain || "";

    const typeTd = document.createElement("td");
    typeTd.textContent = first ? "First-party" : "Third-party";

    const catTd = document.createElement("td");
    catTd.textContent = cat;

    const lifetimeTd = document.createElement("td");
    lifetimeTd.textContent = lifetimeDesc;

    const securityTd = document.createElement("td");
    securityTd.textContent = security;

    tr.appendChild(nameTd);
    tr.appendChild(domainTd);
    tr.appendChild(typeTd);
    tr.appendChild(catTd);
    tr.appendChild(lifetimeTd);
    tr.appendChild(securityTd);

    tr.addEventListener("click", () => {
      explanationBox.innerHTML = explainCookie(cookie, cat, first);
    });

    tbody.appendChild(tr);
  });
}

// Update summary UI
function renderSummary(cookies, siteHostname, tabUrl) {
  const totalEl = document.getElementById("total-cookies");
  const fpEl = document.getElementById("first-party-count");
  const tpEl = document.getElementById("third-party-count");
  const scoreEl = document.getElementById("transparency-score");
  const badgeEl = document.getElementById("transparency-badge");

  const total = cookies.length;
  let firstParty = 0;
  let thirdParty = 0;

  cookies.forEach((cookie) => {
    if (isFirstParty(cookie, siteHostname)) {
      firstParty += 1;
    } else {
      thirdParty += 1;
    }
  });

  totalEl.textContent = total.toString();
  fpEl.textContent = firstParty.toString();
  tpEl.textContent = thirdParty.toString();

  const { score, label, explanation } = computeTransparencyScore(
    cookies,
    siteHostname,
    tabUrl
  );

  scoreEl.textContent = `${score} / 100`;

  badgeEl.classList.remove("badge-good", "badge-fair", "badge-poor", "badge-neutral");
  if (label === "Good") {
    badgeEl.classList.add("badge-good");
  } else if (label === "Fair") {
    badgeEl.classList.add("badge-fair");
  } else if (label === "Poor") {
    badgeEl.classList.add("badge-poor");
  } else {
    badgeEl.classList.add("badge-neutral");
  }
  badgeEl.innerHTML = `<strong>${label} transparency</strong><br/>${explanation}`;
}

// Main entry: on popup load
document.addEventListener("DOMContentLoaded", () => {
  const siteInfo = document.getElementById("site-info");
  siteInfo.textContent = "Detecting current site...";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs.length) {
      siteInfo.textContent = "No active tab detected.";
      return;
    }

    const tab = tabs[0];
    if (!tab.url || !tab.url.startsWith("http")) {
      siteInfo.textContent = "This page type does not support cookie analysis.";
      return;
    }

    const url = new URL(tab.url);
    const hostname = url.hostname;
    siteInfo.textContent = `Analyzing cookies for: ${hostname}`;

    chrome.cookies.getAll({ url: tab.url }, (cookies) => {
      if (chrome.runtime.lastError) {
        siteInfo.textContent = "Error accessing cookies: " + chrome.runtime.lastError.message;
        return;
      }

      if (!cookies || !cookies.length) {
        siteInfo.textContent = `No cookies detected for: ${hostname}`;
        renderSummary([], hostname, tab.url);
        renderCategoryBars([], hostname);
        renderCookieTable([], hostname, tab.url);
        return;
      }

      renderSummary(cookies, hostname, tab.url);
      renderCategoryBars(cookies, hostname);
      renderCookieTable(cookies, hostname, tab.url);
    });
  });
});
