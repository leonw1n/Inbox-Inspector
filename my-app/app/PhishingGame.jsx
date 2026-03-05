import { useState, useEffect, useRef } from "react";

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!window._sfx) window._sfx = new (window.AudioContext || window.webkitAudioContext)();
  return window._sfx;
}
function tone(freq, type, dur, gain, delay) {
  const ctx = getCtx(); if (!ctx) return;
  const o = ctx.createOscillator(), e = ctx.createGain();
  o.connect(e); e.connect(ctx.destination);
  o.type = type; o.frequency.value = freq;
  const t = ctx.currentTime + (delay || 0);
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(gain, t + 0.01);
  e.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.start(t); o.stop(t + dur + 0.05);
}
function noise(dur, gain, delay) {
  const ctx = getCtx(); if (!ctx) return;
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(), e = ctx.createGain(), f = ctx.createBiquadFilter();
  f.type = "bandpass"; f.frequency.value = 800; f.Q.value = 0.5;
  src.buffer = buf; src.connect(f); f.connect(e); e.connect(ctx.destination);
  const t = ctx.currentTime + (delay || 0);
  e.gain.setValueAtTime(gain, t);
  e.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.start(t); src.stop(t + dur + 0.05);
}
const SFX = {
  click: () => { noise(0.04, 0.25, 0); tone(180, "square", 0.07, 0.15, 0); tone(120, "square", 0.12, 0.1, 0.04); },
  correct: () => { tone(523, "square", 0.1, 0.14, 0.05); tone(659, "square", 0.1, 0.14, 0.16); tone(784, "square", 0.18, 0.16, 0.27); },
  wrong: () => { tone(220, "sawtooth", 0.15, 0.18, 0.05); tone(165, "sawtooth", 0.2, 0.18, 0.18); noise(0.08, 0.1, 0.35); },
};

const TIPS = [
  "Check sender domain carefully",
  "Scrutinize all link hostnames",
  "Urgency = red flag",
  "No org requests SSN by email",
  "Late-night sends are suspicious",
  "Generic greetings = mass-spam",
  "Processing fees = prize scams",
  "IT never bans direct contact",
  "Digit substitution in domains",
  "Payment requests for verification",
];

const EMAILS = [
  {
    id: 1, isPhishing: false,
    from: "noreply@github.com", fromName: "GitHub Automated",
    subject: "[GitHub] Please verify your email address",
    date: "14 APR 1994  09:23", size: "2.1K",
    body: "TO: johndoe@ministry.gov\nFROM: noreply@github.com\nDATE: 14 APR 1994 09:23:11 +0000\nSUBJECT: [GitHub] Please verify your email address\n\nPlease verify your email address to complete your\nGitHub account setup.\n\nVerification link:\n  https://github.com/users/confirm_email/abc123def456\n\nThis link will expire in 24 hours.\nIf you did not create a GitHub account, disregard.\n\n-- GitHub Automated Systems\n   88 Colin P Kelly Jr Street, San Francisco, CA",
    clues: [],
    explanation: "Legitimate verification message. Sender domain is github.com. Verification link resolves to github.com. No credentials requested.",
  },
  {
    id: 2, isPhishing: true,
    from: "security@paypa1.com", fromName: "PayPal Security Dept",
    subject: "*** URGENT *** Account Limited - Action Required",
    date: "15 APR 1994  03:44", size: "3.8K",
    body: "TO: user@ministry.gov\nFROM: security@paypa1.com\nDATE: 15 APR 1994 03:44:59 -0500\nSUBJECT: *** URGENT *** Account Limited - Action Required\n\nDear Valued Customer,\n\nSuspicious activity detected. Account access SUSPENDED.\nYou MUST verify identity or account PERMANENTLY CLOSED\nwithin 24 HOURS.\n\nVerification portal:\n  http://paypal-secure-verify.ru/confirm?id=93821\n\nRequired documents:\n  - Full name + date of birth\n  - Credit card number + CVV code\n  - Social Security Number\n\nNon-compliance = PERMANENT TERMINATION.\n\nPayPal Security Department",
    clues: [
      "DOMAIN: paypa1.com -- digit '1' substituted for letter 'l'",
      "LINK: resolves to .ru (foreign) server",
      "REQUESTS: SSN + CVV via electronic mail",
      "TIMESTAMP: 03:44 -- irregular sending hour",
      "LANGUAGE: extreme urgency, termination threats",
    ],
    explanation: "PHISHING CONFIRMED. Sender domain 'paypa1.com' uses digit substitution. Link routes to Russian (.ru) server. No legitimate institution requests SSN and CVV via email.",
  },
  {
    id: 3, isPhishing: false,
    from: "no-reply@accounts.google.com", fromName: "Google Security",
    subject: "Security alert for your linked Google Account",
    date: "16 APR 1994  14:12", size: "1.7K",
    body: "TO: user@ministry.gov\nFROM: no-reply@accounts.google.com\nDATE: 16 APR 1994 14:12:03 +0000\nSUBJECT: Security alert for your linked Google Account\n\nSign-in attempt blocked by Google security systems.\n\nDevice:   Windows PC\nLocation: Chicago, IL, USA\nTime:     16 APR 1994  14:11 UTC\n\nReview activity log:\n  https://myaccount.google.com/notifications\n\nNo action required if this was you.\nContact security if unrecognized.\n\n-- Google LLC, Mountain View, CA 94043",
    clues: [],
    explanation: "Legitimate security notification. Sender domain is accounts.google.com. Link resolves to myaccount.google.com. No credentials requested.",
  },
  {
    id: 4, isPhishing: true,
    from: "it-support@company-helpdesk.net", fromName: "IT Department",
    subject: "ACTION REQUIRED: Password Expiry Notice [2 HRS]",
    date: "17 APR 1994  08:00", size: "2.9K",
    body: "TO: employee@ministry.gov\nFROM: it-support@company-helpdesk.net\nDATE: 17 APR 1994 08:00:01 +0000\nSUBJECT: ACTION REQUIRED: Password Expiry Notice [2 HRS]\n\nDear Employee,\n\nCorporate password EXPIRES IN 2 HOURS.\nFailure to reset = loss of system access.\n\nReset portal:\n  http://corp-password-reset.xyz/reset?token=emp_2942\n\nEnter current credentials to proceed.\nLink expires: 2 HOURS FROM RECEIPT.\n\nIMPORTANT: Do NOT contact IT dept directly.\nUse only the above link for assistance.\n\n-- IT Department",
    clues: [
      "DOMAIN: company-helpdesk.net -- external, not corporate",
      "LINK: corp-password-reset.xyz -- unregistered .xyz domain",
      "INSTRUCTION: forbids contacting IT dept directly",
      "PRESSURE: artificial 2-hour deadline",
      "GREETING: 'Dear Employee' -- no personalization",
    ],
    explanation: "PHISHING CONFIRMED. Sender uses external domain. Reset link routes to unregistered .xyz server. Legitimate IT departments never forbid direct contact.",
  },
  {
    id: 5, isPhishing: true,
    from: "prizes@amazon-rewards-center.com", fromName: "Amazon Rewards Div.",
    subject: "WINNER NOTICE: $1,000 Gift Card Selected For You",
    date: "18 APR 1994  11:30", size: "2.2K",
    body: "TO: customer@ministry.gov\nFROM: prizes@amazon-rewards-center.com\nDATE: 18 APR 1994 11:30:00 +0000\nSUBJECT: WINNER NOTICE: $1,000 Gift Card Selected For You\n\nCONGRATULATIONS AMAZON CUSTOMER,\n\nYou are selected recipient of $1,000 GIFT CARD\nunder annual loyalty reward program.\n\nClaim portal (expires TODAY):\n  http://amaz0n-giftz.com/claim/winner?ref=49210\n\nSurvey + $3.99 processing fee required to redeem.\nOnly 3 (THREE) prizes remaining -- act immediately.\n\n-- Amazon Customer Rewards Division",
    clues: [
      "DOMAIN: amazon-rewards-center.com -- not amazon.com",
      "LINK: 'amaz0n' -- digit '0' substituted for letter 'o'",
      "FEE: processing fee required to claim prize",
      "SCARCITY: artificial 'only 3 remaining' pressure",
      "GREETING: 'AMAZON CUSTOMER' -- no account data",
    ],
    explanation: "PHISHING CONFIRMED. Sender domain unrelated to amazon.com. Link uses digit substitution. Legitimate prize programs never require processing fees.",
  },
  {
    id: 6, isPhishing: false,
    from: "receipts@stripe.com", fromName: "Stripe Billing",
    subject: "Payment receipt: Acme Corp -- $49.00",
    date: "19 APR 1994  16:45", size: "1.4K",
    body: "TO: user@ministry.gov\nFROM: receipts@stripe.com\nDATE: 19 APR 1994 16:45:22 +0000\nSUBJECT: Payment receipt: Acme Corp -- $49.00\n\nPAYMENT CONFIRMATION\n====================\nAmount:  $49.00 USD\nDate:    19 APR 1994\nPayee:   Acme Corp (subscription)\n\nInvoice reference:\n  https://pay.stripe.com/receipts/acmecorp/inv_1234567890\n\nBilling inquiries: support@acmecorp.com\nNo action required.\n\n-- Stripe Billing, South San Francisco, CA 94080",
    clues: [],
    explanation: "Legitimate payment receipt. Sender is receipts@stripe.com. Link resolves to pay.stripe.com. No action requested -- informational only.",
  },
  {
    id: 7, isPhishing: true,
    from: "apple-id@icloud-verify.support", fromName: "Apple ID Security",
    subject: "Apple ID Sign-In: New Device Detected [Moscow, RU]",
    date: "20 APR 1994  22:17", size: "3.1K",
    body: "TO: user@ministry.gov\nFROM: apple-id@icloud-verify.support\nDATE: 20 APR 1994 22:17:44 +0000\nSUBJECT: Apple ID Sign-In: New Device Detected [Moscow, RU]\n\nAPPLE ID SECURITY ALERT\n\nSign-in detected: iPhone 16 Pro, Moscow, Russia.\nAccount may be compromised. VERIFY IMMEDIATELY:\n\n  https://appleid-support-verify.com/secure/signin\n\nRequired for verification:\n  - Apple ID + password\n  - Payment method on file\n\nNon-verification within 12 HOURS = account disabled.\n\n-- Apple Support",
    clues: [
      "DOMAIN: icloud-verify.support -- not apple.com",
      "LINK: appleid-support-verify.com -- not apple.com",
      "REQUEST: payment method for 'identity verification'",
      "THREAT: 12-hour account disable ultimatum",
      "POLICY: Apple never requests payment to verify sign-ins",
    ],
    explanation: "PHISHING CONFIRMED. Sender domain and link both route to non-Apple servers. Apple security mail originates from @apple.com only.",
  },
  {
    id: 8, isPhishing: false,
    from: "donotreply@notify.slack.com", fromName: "Slack Notifications",
    subject: "New message from Marcus Chen",
    date: "21 APR 1994  10:02", size: "1.2K",
    body: "TO: user@ministry.gov\nFROM: donotreply@notify.slack.com\nDATE: 21 APR 1994 10:02:35 +0000\nSUBJECT: New message from Marcus Chen\n\nYou have a new direct message in Slack:\n\n  FROM: Marcus Chen\n  MSG:  \"Hey, can you review the Q2 report before\n         the 2pm meeting? Shared in #general\"\n\nOpen thread:\n  https://acme-corp.slack.com/messages/direct/U0938XKPL\n\nManage notifications:\n  https://acme-corp.slack.com/account/notifications\n\n-- Slack Technologies, San Francisco, CA 94105",
    clues: [],
    explanation: "Legitimate notification. Sender is notify.slack.com. Both links resolve to acme-corp.slack.com subdomain. No credentials requested.",
  },
];

const C = {
  bg: "#0d0a04",
  bgDark: "#1a1208",
  border: "#2a1e08",
  borderBright: "#6b5a2a",
  amber: "#c8a840",
  amberBright: "#d4a843",
  text: "#9a8848",
  textMuted: "#6a5828",
  textHeader: "#a08040",
  green: "#4ec95c",
  greenDark: "#2d8a3e",
  red: "#e74c3c",
  redDark: "#c0392b",
};

function Shell({ children, title, decided, score, streak, lives }) {
  const ttl = title || "MINIMAIL v2.3 -- MINISTRY OF DIGITAL AFFAIRS";
  return (
    <div style={{ position:"fixed", inset:0, background:C.bgDark, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)" }} />
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9998, background:"radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ width:"100%", maxWidth:980, height:"calc(100vh - 32px)", display:"flex", flexDirection:"column", border:"2px solid " + C.borderBright, background:C.bg, position:"relative" }}>
        <div style={{ background:"#2e2308", borderBottom:"1px solid " + C.borderBright, padding:"5px 10px", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <div style={{ display:"flex", gap:5 }}>
            {["#5a3a0a","#3a3a0a","#0a3a1a"].map((c,i) => (
              <div key={i} style={{ width:11, height:11, borderRadius:"50%", background:c, border:"1px solid rgba(255,255,255,0.1)" }} />
            ))}
          </div>
          <span style={{ fontFamily:"VT323, monospace", fontSize:"1rem", color:C.amber, letterSpacing:2, flex:1, textAlign:"center" }}>{ttl}</span>
        </div>
        <div style={{ background:C.bgDark, borderBottom:"1px solid " + C.border, padding:"2px 10px", display:"flex", gap:0, flexShrink:0 }}>
          {["File","Edit","View","Message","Transfer","Help"].map(m => (
            <div key={m} style={{ fontFamily:"VT323, monospace", fontSize:"0.9rem", color:"#7a6030", padding:"1px 10px", cursor:"default", letterSpacing:1 }}>
              <span style={{ textDecoration:"underline" }}>{m[0]}</span>{m.slice(1)}
            </div>
          ))}
          <div style={{ marginLeft:"auto", fontFamily:"VT323, monospace", fontSize:"0.85rem", color:C.textMuted }}>
            {new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
          </div>
        </div>
        {children}
        <div style={{ background:C.bg, borderTop:"1px solid " + C.border, padding:"3px 10px", display:"flex", gap:16, flexShrink:0 }}>
          {["MSGS: " + EMAILS.length, "UNREAD: " + (EMAILS.length - decided), "SCORE: " + score, streak > 1 ? "STREAK: " + streak + "x" : null, "LIVES: " + "\u2666".repeat(lives) + "\u25c7".repeat(3 - lives)].filter(Boolean).map((s,i) => (
            <span key={i} style={{ fontFamily:"VT323, monospace", fontSize:"0.8rem", color:C.textHeader, letterSpacing:1 }}>{s}</span>
          ))}
          <span style={{ marginLeft:"auto", fontFamily:"VT323, monospace", fontSize:"0.8rem", color:C.text }}>ARSTOTZKA NET v1.1</span>
        </div>
      </div>
    </div>
  );
}

export default function PhishingGame() {
  const [screen, setScreen] = useState("intro");
  const [openEmail, setOpenEmail] = useState(null);
  const [decisions, setDecisions] = useState({});
  const [stamp, setStamp] = useState(null);
  const [showExpl, setShowExpl] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [selRow, setSelRow] = useState(null);
  const [blink, setBlink] = useState(true);

  const decided = Object.keys(decisions).length;
  const allDone = decided === EMAILS.length;
  const accuracy = decided > 0 ? Math.round(Object.values(decisions).filter(d => d.correct).length / decided * 100) : 0;
  const hud = { decided, score, streak, lives };

  useEffect(() => {
    if (document.getElementById("pp-fonts")) return;
    const link = document.createElement("link");
    link.id = "pp-fonts"; link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=VT323&family=Special+Elite&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.id = "pp-styles";
    style.textContent = ".stamp-legit,.stamp-phish{font-family:VT323,monospace;font-size:3.6rem;letter-spacing:6px;padding:10px 24px;animation:stampIn 0.45s cubic-bezier(0.17,0.67,0.35,1.3) forwards;transform:rotate(-12deg) scale(0);}.stamp-legit{border:6px solid #2d8a3e;color:#4ec95c;background:rgba(8,20,10,0.93);box-shadow:0 0 24px rgba(45,138,62,0.4);}.stamp-phish{border:6px solid #c0392b;color:#c0392b;background:rgba(20,8,8,0.93);box-shadow:0 0 24px rgba(192,57,43,0.4);}@keyframes stampIn{0%{transform:rotate(-12deg) scale(3);opacity:0;}60%{opacity:1;}100%{transform:rotate(-12deg) scale(1);opacity:0.92;}}";
    document.head.appendChild(style);
  }, []);

  useEffect(() => { const t = setInterval(() => setBlink(b => !b), 530); return () => clearInterval(t); }, []);

  const openHandler = (email) => {
    if (decisions[email.id]) return;
    setSelRow(email.id); setOpenEmail(email); setStamp(null); setShowExpl(false); setLastCorrect(null);
    setScreen("reading");
  };

  const decide = (d) => {
    if (stamp || showExpl || !openEmail) return;
    const ok = (d === "approve" && !openEmail.isPhishing) || (d === "deny" && openEmail.isPhishing);
    SFX.click();
    setTimeout(() => ok ? SFX.correct() : SFX.wrong(), 120);
    setStamp(d); setLastCorrect(ok);
    setTimeout(() => setShowExpl(true), 700);
    const ns = ok ? streak + 1 : 0; setStreak(ns);
    if (ok) setScore(s => s + 10 + Math.max(0, ns - 1) * 2); else setLives(l => l - 1);
    setDecisions(p => ({ ...p, [openEmail.id]: { correct: ok, decision: d, isPhishing: openEmail.isPhishing } }));
  };

  const goBack = () => {
    if (lives <= 0) { setScreen("gameover"); return; }
    if (Object.keys(decisions).length >= EMAILS.length) { setScreen("result"); return; }
    setOpenEmail(null); setScreen("inbox");
  };

  const reset = () => {
    setDecisions({}); setScore(0); setStreak(0); setLives(3);
    setOpenEmail(null); setStamp(null); setShowExpl(false); setSelRow(null); setScreen("inbox");
  };

  useEffect(() => {
    const h = (e) => {
      if (screen !== "reading") return;
      if (showExpl) { if (e.key === "Enter" || e.key === " ") goBack(); return; }
      if (stamp) return;
      if (e.key === "a" || e.key === "A") decide("approve");
      if (e.key === "d" || e.key === "D") decide("deny");
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [screen, showExpl, stamp, openEmail, lives, decisions, streak]);

  const tipRow = (t, i) => (
    <div key={i} style={{ fontFamily:"VT323, monospace", fontSize:"0.72rem", color:C.text, lineHeight:1.6, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
      &rsaquo; {t}
    </div>
  );

  const tipHead = (label) => (
    <div style={{ fontFamily:"VT323, monospace", fontSize:"0.75rem", color:C.textHeader, letterSpacing:2, marginBottom:8 }}>{label}</div>
  );

  if (screen === "intro") return (
    <Shell title="MINIMAIL v2.3 -- SYSTEM BOOT" {...hud}>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24, overflow:"auto" }}>
        <div style={{ maxWidth:560, width:"100%" }}>
          <div style={{ border:"1px solid #4a3a10", background:"rgba(255,255,255,0.02)", padding:"28px 32px", marginBottom:20 }}>
            <div style={{ fontFamily:"VT323, monospace", fontSize:"2.4rem", color:C.amberBright, letterSpacing:4, marginBottom:4, textShadow:"0 0 20px rgba(212,168,67,0.35)" }}>INBOX INSPECTOR</div>
            <div style={{ fontFamily:"VT323, monospace", fontSize:"1rem", color:C.textMuted, letterSpacing:3, marginBottom:20 }}>MINISTRY OF DIGITAL AFFAIRS -- ANTI-PHISHING DIVISION</div>
            <div style={{ fontFamily:"Special Elite, serif", fontSize:"0.88rem", color:"#9a8040", lineHeight:1.9, borderLeft:"2px solid #3a2e10", paddingLeft:14, marginBottom:20 }}>
              You have been assigned to the Electronic Mail Inspection Bureau.
              Review all incoming transmissions and classify them as LEGITIMATE
              or FRAUDULENT. Incorrect assessments will be noted in your file.
              Three errors result in immediate termination of duties.
            </div>
            <div style={{ fontFamily:"VT323, monospace", fontSize:"1rem", color:C.textMuted, lineHeight:2, letterSpacing:1 }}>
              {"> CLICK message row to open transmission"}<br/>
              {"> Press [A] to APPROVE (legitimate)"}<br/>
              {"> Press [D] to DENY (phishing)"}<br/>
              {"> Press [ESC] to return to message list"}
            </div>
          </div>
          <button
            onClick={() => setScreen("inbox")}
            style={{ width:"100%", background:C.bgDark, border:"2px solid " + C.borderBright, color:C.amberBright, fontFamily:"VT323, monospace", fontSize:"1.5rem", letterSpacing:4, padding:"12px", cursor:"pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background="#2a1e08"; }}
            onMouseLeave={e => { e.currentTarget.style.background=C.bgDark; }}
          >
            {"INITIALIZE INBOX" + (blink ? "_" : " ")}
          </button>
        </div>
      </div>
    </Shell>
  );

  if (screen === "inbox") return (
    <Shell {...hud}>
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <div style={{ width:200, borderRight:"1px solid " + C.border, padding:"8px 0", flexShrink:0, background:C.bg }}>
          <div style={{ fontFamily:"VT323, monospace", fontSize:"0.75rem", color:C.textHeader, letterSpacing:2, padding:"4px 12px 8px", borderBottom:"1px solid " + C.border }}>FOLDERS</div>
          {[{icon:">",label:"Inbox",count:EMAILS.length-decided,active:true},{icon:"o",label:"Sent"},{icon:"o",label:"Drafts"},{icon:"o",label:"Trash"},{icon:"o",label:"Archive"}].map(f => (
            <div key={f.label} style={{ fontFamily:"VT323, monospace", fontSize:"0.9rem", color:f.active ? C.amberBright : C.textMuted, padding:"4px 12px", display:"flex", justifyContent:"space-between", background:f.active ? "rgba(212,168,67,0.06)" : "transparent", cursor:"default", letterSpacing:1 }}>
              <span>{f.icon} {f.label}</span>
              {f.count > 0 && <span style={{ color:C.amberBright }}>{f.count}</span>}
            </div>
          ))}
          <div style={{ borderTop:"1px solid " + C.border, marginTop:16, padding:"8px 12px 4px" }}>
            {tipHead("FIELD GUIDE")}
            {TIPS.map(tipRow)}
          </div>
        </div>

        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", background:C.bg, borderBottom:"1px solid #3a2e10", padding:"4px 10px", flexShrink:0 }}>
            {[["STATUS","80px"],["FROM","200px"],["SUBJECT","flex"],["DATE","150px"],["SIZE","50px"]].map(([label,w]) => (
              <div key={label} style={{ fontFamily:"VT323, monospace", fontSize:"0.75rem", color:C.textHeader, letterSpacing:2, width:w==="flex"?undefined:w, flex:w==="flex"?1:undefined, paddingRight:8 }}>{label}</div>
            ))}
          </div>
          <div style={{ flex:1, overflowY:"auto", background:C.bg }}>
            {EMAILS.map(email => {
              const dec = decisions[email.id];
              const done = !!dec;
              const sel = selRow === email.id;
              return (
                <div key={email.id}
                  onClick={() => !done && openHandler(email)}
                  style={{ display:"flex", alignItems:"center", padding:"0 10px", height:28, borderBottom:"1px solid #1a1208", background:sel&&!done?"rgba(212,168,67,0.1)":C.bg, cursor:done?"default":"pointer", opacity:done?0.45:1, transition:"background 0.08s" }}
                  onMouseEnter={e => { if (!done) e.currentTarget.style.background="rgba(212,168,67,0.07)"; }}
                  onMouseLeave={e => { if (!done) e.currentTarget.style.background=sel?"rgba(212,168,67,0.1)":C.bg; }}
                >
                  <div style={{ width:80, fontFamily:"VT323, monospace", fontSize:"0.72rem", letterSpacing:1, color:done?(dec.correct?C.greenDark:C.redDark):C.amber, flexShrink:0 }}>{done?(dec.correct?"FILED":"ERROR"):"UNREAD"}</div>
                  <div style={{ width:200, fontFamily:"VT323, monospace", fontSize:"0.72rem", color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flexShrink:0, paddingRight:8 }}>{email.fromName}</div>
                  <div style={{ flex:1, fontFamily:"VT323, monospace", fontSize:"0.72rem", color:done?"#5a4820":C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:8 }}>
                    {email.subject}
                    {done && <span style={{ color:dec.isPhishing?C.redDark:C.greenDark, marginLeft:8 }}>[{dec.isPhishing?"PHISHING":"LEGIT"}]</span>}
                  </div>
                  <div style={{ width:150, fontFamily:"VT323, monospace", fontSize:"0.72rem", color:C.text, flexShrink:0 }}>{email.date}</div>
                  <div style={{ width:50, fontFamily:"VT323, monospace", fontSize:"0.72rem", color:C.text, flexShrink:0 }}>{email.size}</div>
                </div>
              );
            })}
          </div>
          <div style={{ borderTop:"1px solid " + C.border, padding:"6px 10px", background:C.bg, flexShrink:0 }}>
            <span style={{ fontFamily:"VT323, monospace", fontSize:"0.8rem", color:C.textHeader, letterSpacing:1 }}>
              {allDone ? "ALL MESSAGES PROCESSED -- PRESS [ENTER] TO SUBMIT FINAL REPORT" : "CLICK MESSAGE TO OPEN  |  " + (EMAILS.length - decided) + " MESSAGES PENDING REVIEW"}
            </span>
            {allDone && (
              <button onClick={() => setScreen("result")} style={{ marginLeft:16, background:"none", border:"1px solid " + C.borderBright, color:C.amberBright, fontFamily:"VT323, monospace", fontSize:"0.9rem", letterSpacing:2, padding:"2px 14px", cursor:"pointer" }}>
                SUBMIT REPORT
              </button>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );

  if (screen === "reading" && openEmail) return (
    <Shell title={"MINIMAIL v2.3 -- " + openEmail.subject.toUpperCase().slice(0,50)} {...hud}>
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <div style={{ width:200, borderRight:"1px solid " + C.border, padding:"10px 12px", flexShrink:0, background:C.bg, overflowY:"auto", overflowX:"hidden" }}>
          <div style={{ fontFamily:"VT323, monospace", fontSize:"0.75rem", color:C.textHeader, letterSpacing:2, marginBottom:10, borderBottom:"1px solid " + C.border, paddingBottom:6 }}>MESSAGE INFO</div>
          {[["MSG #", String(openEmail.id).padStart(4,"0")],["FROM",openEmail.from],["DATE",openEmail.date],["SIZE",openEmail.size]].map(([k,v]) => (
            <div key={k} style={{ marginBottom:10 }}>
              <div style={{ fontFamily:"VT323, monospace", fontSize:"0.72rem", color:C.textHeader, letterSpacing:2 }}>{k}</div>
              <div style={{ fontFamily:"VT323, monospace", fontSize:"0.72rem", color:C.text, wordBreak:"break-all", lineHeight:1.4 }}>{v}</div>
            </div>
          ))}
          <div style={{ borderTop:"1px solid " + C.border, marginTop:14, paddingTop:10 }}>
            {tipHead("INSPECTOR NOTES")}
            {TIPS.map(tipRow)}
          </div>
        </div>

        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
          {stamp && (
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:20, pointerEvents:"none" }}>
              <div className={stamp === "approve" ? "stamp-legit" : "stamp-phish"}>
                {stamp === "approve" ? "LEGITIMATE" : "PHISHING"}
              </div>
            </div>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 12px", borderBottom:"1px solid #3a2e10", background:C.bg, flexShrink:0 }}>
            <button onClick={goBack} style={{ background:"none", border:"1px solid #4a3a14", color:"#8a7030", fontFamily:"VT323, monospace", fontSize:"0.85rem", padding:"1px 10px", cursor:"pointer", letterSpacing:1 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.borderBright; e.currentTarget.style.color=C.amber; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#4a3a14"; e.currentTarget.style.color="#8a7030"; }}
            >&larr; INBOX</button>
            <div style={{ width:1, height:16, background:"#3a2e10" }} />
            <span style={{ fontFamily:"VT323, monospace", fontSize:"0.85rem", color:"#7a6830", letterSpacing:1, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{openEmail.subject}</span>
            <span style={{ fontFamily:"VT323, monospace", fontSize:"0.78rem", color:C.textMuted }}>{decided + 1}/{EMAILS.length}</span>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
            <pre style={{ fontFamily:"VT323, monospace", fontSize:"1rem", color:C.amber, lineHeight:1.85, whiteSpace:"pre-wrap", wordBreak:"break-word", textShadow:"0 0 8px rgba(200,168,64,0.2)", margin:0 }}>{openEmail.body}</pre>
          </div>
          {!showExpl ? (
            <div style={{ borderTop:"1px solid " + C.border, padding:"10px 16px", background:C.bg, display:"flex", alignItems:"center", gap:12, flexShrink:0, flexWrap:"wrap" }}>
              <span style={{ fontFamily:"VT323, monospace", fontSize:"0.85rem", color:C.textHeader, letterSpacing:1 }}>CLASSIFY TRANSMISSION:</span>
              <button onClick={() => decide("approve")} disabled={!!stamp}
                style={{ background:"#0a1a0a", border:"2px solid " + C.greenDark, color:C.green, fontFamily:"VT323, monospace", fontSize:"1.1rem", letterSpacing:3, padding:"5px 22px", cursor:"pointer" }}
                onMouseEnter={e => { if (!stamp) { e.currentTarget.style.background="#1a3a1a"; e.currentTarget.style.boxShadow="0 0 12px rgba(78,201,92,0.3)"; }}}
                onMouseLeave={e => { e.currentTarget.style.background="#0a1a0a"; e.currentTarget.style.boxShadow="none"; }}
              >[A] LEGITIMATE</button>
              <button onClick={() => decide("deny")} disabled={!!stamp}
                style={{ background:"#1a0a0a", border:"2px solid " + C.redDark, color:C.red, fontFamily:"VT323, monospace", fontSize:"1.1rem", letterSpacing:3, padding:"5px 22px", cursor:"pointer" }}
                onMouseEnter={e => { if (!stamp) { e.currentTarget.style.background="#3a1a1a"; e.currentTarget.style.boxShadow="0 0 12px rgba(231,76,60,0.3)"; }}}
                onMouseLeave={e => { e.currentTarget.style.background="#1a0a0a"; e.currentTarget.style.boxShadow="none"; }}
              >[D] PHISHING</button>
              <span style={{ fontFamily:"VT323, monospace", fontSize:"0.78rem", color:C.textMuted }}>[ESC] BACK</span>
            </div>
          ) : (
            <div style={{ borderTop:"2px solid " + (lastCorrect ? C.greenDark : C.redDark), padding:"12px 16px", background:lastCorrect?"rgba(10,30,10,0.95)":"rgba(30,10,10,0.95)", flexShrink:0, maxHeight:220, overflowY:"auto" }}>
              <div style={{ fontFamily:"VT323, monospace", fontSize:"1.3rem", color:lastCorrect?C.green:C.red, letterSpacing:3, marginBottom:6 }}>
                {lastCorrect ? "> ASSESSMENT CORRECT" : "> ASSESSMENT INCORRECT"}
              </div>
              <div style={{ fontFamily:"Special Elite, serif", fontSize:"0.82rem", color:lastCorrect?"#6aaf70":"#c08070", lineHeight:1.7, marginBottom:openEmail.clues.length?10:6 }}>{openEmail.explanation}</div>
              {openEmail.isPhishing && openEmail.clues.length > 0 && (
                <div style={{ marginBottom:10 }}>
                  <div style={{ fontFamily:"VT323, monospace", fontSize:"0.75rem", color:C.red, letterSpacing:2, marginBottom:6 }}>EVIDENCE LOG:</div>
                  {openEmail.clues.map((c,i) => (
                    <div key={i} style={{ fontFamily:"VT323, monospace", fontSize:"0.82rem", color:C.red, lineHeight:1.7 }}>[{String(i+1).padStart(2,"0")}] {c}</div>
                  ))}
                </div>
              )}
              <button onClick={goBack} style={{ background:"none", border:"1px solid " + (lastCorrect?C.greenDark:C.redDark), color:lastCorrect?C.green:C.red, fontFamily:"VT323, monospace", fontSize:"1rem", letterSpacing:3, padding:"4px 18px", cursor:"pointer", marginTop:4 }}>
                &gt; NEXT MESSAGE [ENTER]
              </button>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );

  if (screen === "result" || screen === "gameover") return (
    <Shell title="MINIMAIL v2.3 -- FINAL REPORT" {...hud}>
      <div style={{ flex:1, overflow:"auto", padding:24, display:"flex", alignItems:"flex-start", justifyContent:"center" }}>
        <div style={{ width:"100%", maxWidth:640 }}>
          <div style={{ border:"1px solid #4a3a10", padding:"20px 24px", marginBottom:16 }}>
            <div style={{ fontFamily:"VT323, monospace", fontSize:"2rem", letterSpacing:4, color:screen==="gameover"?C.redDark:C.amberBright, marginBottom:4 }}>
              {screen === "gameover" ? "CLEARANCE REVOKED" : "INSPECTION COMPLETE"}
            </div>
            <div style={{ fontFamily:"Special Elite, serif", fontSize:"0.85rem", color:"#7a6030", lineHeight:1.7, marginBottom:16 }}>
              {screen === "gameover" ? "Too many classification errors. Security clearance suspended pending review."
                : accuracy >= 80 ? "Exceptional performance. Commendation noted in personnel file."
                : accuracy >= 50 ? "Adequate performance. Additional training recommended."
                : "Unsatisfactory performance. Mandatory re-certification required."}
            </div>
            <div style={{ display:"flex", gap:12, marginBottom:16 }}>
              {[["SCORE",score,C.amberBright],["ACCURACY",accuracy+"%",accuracy>=80?C.green:accuracy>=50?"#e8a820":C.redDark],["REVIEWED",decided+"/"+EMAILS.length,"#a08030"]].map(([label,val,col]) => (
                <div key={label} style={{ flex:1, border:"1px solid " + C.border, padding:"12px", background:"#0a0804", textAlign:"center" }}>
                  <div style={{ fontFamily:"VT323, monospace", fontSize:"2rem", color:col }}>{val}</div>
                  <div style={{ fontFamily:"VT323, monospace", fontSize:"0.7rem", color:C.textHeader, letterSpacing:2 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ border:"1px solid " + C.border, overflow:"hidden", marginBottom:16 }}>
              <div style={{ display:"flex", background:"#0a0804", padding:"4px 10px", borderBottom:"1px solid " + C.border }}>
                {[["#","40px"],["SENDER","flex"],["CLASSIFICATION","140px"],["RESULT","90px"]].map(([l,w]) => (
                  <div key={l} style={{ fontFamily:"VT323, monospace", fontSize:"0.72rem", color:C.textHeader, letterSpacing:2, width:w==="flex"?undefined:w, flex:w==="flex"?1:undefined }}>{l}</div>
                ))}
              </div>
              {Object.entries(decisions).map(([eid, dec], i) => {
                const em = EMAILS.find(e => e.id === parseInt(eid));
                return (
                  <div key={eid} style={{ display:"flex", alignItems:"center", padding:"5px 10px", background:i%2===0?"#080603":"#0a0804", borderBottom:"1px solid #0d0a04" }}>
                    <div style={{ width:40, fontFamily:"VT323, monospace", fontSize:"0.82rem", color:C.textMuted }}>{String(i+1).padStart(2,"0")}</div>
                    <div style={{ flex:1, fontFamily:"VT323, monospace", fontSize:"0.78rem", color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:8 }}>{em.fromName}</div>
                    <div style={{ width:140, fontFamily:"VT323, monospace", fontSize:"0.78rem", color:dec.isPhishing?C.redDark:C.greenDark }}>{dec.isPhishing?"PHISHING":"LEGITIMATE"}</div>
                    <div style={{ width:90, fontFamily:"VT323, monospace", fontSize:"0.85rem", color:dec.correct?C.green:C.red }}>{dec.correct?"CORRECT":"ERROR"}</div>
                  </div>
                );
              })}
            </div>
            <button onClick={reset}
              style={{ width:"100%", background:"#0a0804", border:"2px solid " + C.borderBright, color:C.amberBright, fontFamily:"VT323, monospace", fontSize:"1.3rem", letterSpacing:4, padding:"10px", cursor:"pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background=C.bgDark; }}
              onMouseLeave={e => { e.currentTarget.style.background="#0a0804"; }}
            >REINITIALIZE INSPECTION</button>
          </div>
        </div>
      </div>
    </Shell>
  );

  return null;
}
