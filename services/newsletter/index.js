import { createHash, randomBytes } from "node:crypto";
import { Firestore, FieldValue } from "@google-cloud/firestore";
import { http } from "@google-cloud/functions-framework";

const db = new Firestore();
const collection = db.collection("newsletter_subscribers");
const allowedOrigins = new Set([
  "https://uxpatternsguide.com",
  "https://www.uxpatternsguide.com",
  ...(process.env.ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean)
]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function publicUrl(req) {
  return process.env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`;
}

function setCors(req, res) {
  const origin = req.get("origin");
  if (origin && allowedOrigins.has(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  res.set("Cache-Control", "no-store");
  res.set("X-Content-Type-Options", "nosniff");
}

function page(title, message, returnPath = "/") {
  const safeTitle = title.replace(/[<>&]/g, "");
  const safeMessage = message.replace(/[<>&]/g, "");
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${safeTitle} | UX Patterns Guide</title><style>body{font:16px/1.55 system-ui,sans-serif;color:#17211f;background:#f6f8f7;margin:0;padding:32px}.card{max-width:620px;margin:10vh auto;background:white;border:1px solid #d9dfdc;padding:32px;border-radius:12px}h1{font-size:2rem;margin:0 0 12px}a{display:inline-block;margin-top:12px;color:#073d37;font-weight:700}</style><main class="card"><h1>${safeTitle}</h1><p>${safeMessage}</p><a href="https://uxpatternsguide.com${returnPath}">Return to UX Patterns Guide</a></main></html>`;
}

async function sendConfirmation(email, token, req) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;
  if (!apiKey || !from) return false;

  const confirmUrl = `${publicUrl(req)}/confirm?token=${encodeURIComponent(token)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Confirm your UX Patterns Guide subscription",
      html: `<p>Confirm that you want practical, source-backed UX pattern briefs.</p><p><a href="${confirmUrl}">Confirm subscription</a></p><p>If you did not request this, you can ignore this email.</p>`
    })
  });
  return response.ok;
}

async function subscribe(req, res) {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const email = String(body.email || "").trim().toLowerCase();
  const website = String(body.website || "").trim();
  const startedAt = Number(body.startedAt || 0);

  if (website || (startedAt && Date.now() - startedAt < 1200)) {
    return res.status(202).json({ ok: true, message: "Check your inbox to confirm." });
  }
  if (!emailPattern.test(email) || email.length > 254) {
    return res.status(400).json({ ok: false, message: "Enter a valid email address." });
  }

  const id = hash(email);
  const ref = collection.doc(id);
  const existing = await ref.get();
  if (existing.exists && existing.data()?.status === "confirmed") {
    return res.status(200).json({ ok: true, message: "You are already subscribed." });
  }

  const token = randomBytes(32).toString("hex");
  const source = String(body.source || "/").slice(0, 300);
  const campaign = String(body.campaign || "").slice(0, 120);
  const utmSource = String(body.utmSource || "").slice(0, 120);
  const utmMedium = String(body.utmMedium || "").slice(0, 120);
  const utmContent = String(body.utmContent || "").slice(0, 120);
  const referrerHost = String(body.referrerHost || "").toLowerCase().slice(0, 253);
  await ref.set({
    email,
    status: "pending",
    source,
    campaign,
    utmSource,
    utmMedium,
    utmContent,
    referrerHost,
    consentVersion: "2026-08-30",
    confirmationTokenHash: hash(token),
    confirmationExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    createdAt: existing.exists ? existing.data()?.createdAt : FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  let sent = false;
  try {
    sent = await sendConfirmation(email, token, req);
  } catch (error) {
    console.error("Confirmation delivery failed", error instanceof Error ? error.message : "unknown error");
  }
  await ref.set({ confirmationSentAt: sent ? FieldValue.serverTimestamp() : null }, { merge: true });

  return res.status(202).json({
    ok: true,
    message: sent ? "Check your inbox to confirm." : "Thanks — your email has been saved."
  });
}

async function updateByToken(req, res, nextStatus) {
  const token = String(req.query.token || "");
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return res.status(400).send(page("Link not valid", "This subscription link is invalid or incomplete."));
  }
  const snapshot = await collection.where("confirmationTokenHash", "==", hash(token)).limit(1).get();
  if (snapshot.empty) {
    return res.status(404).send(page("Link expired", "This subscription link is no longer active."));
  }
  const ref = snapshot.docs[0].ref;
  const subscriber = snapshot.docs[0].data();
  const expiresAt = subscriber.confirmationExpiresAt?.toDate?.();
  if (nextStatus === "confirmed" && expiresAt instanceof Date && expiresAt.getTime() < Date.now()) {
    return res.status(410).send(page("Link expired", "This confirmation link has expired. Subscribe again to receive a new link."));
  }
  await ref.set({
    status: nextStatus,
    updatedAt: FieldValue.serverTimestamp(),
    ...(nextStatus === "confirmed"
      ? { confirmedAt: FieldValue.serverTimestamp() }
      : { unsubscribedAt: FieldValue.serverTimestamp() })
  }, { merge: true });
  return res.status(200).send(page(
    nextStatus === "confirmed" ? "Subscription confirmed" : "You are unsubscribed",
    nextStatus === "confirmed"
      ? "You will receive practical UX pattern briefs. You can unsubscribe from any issue."
      : "You will not receive future newsletter issues.",
    "/patterns/"
  ));
}

http("newsletter", async (req, res) => {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  try {
    if (req.method === "GET" && req.path === "/health") return res.status(200).json({ ok: true });
    if (req.method === "POST" && (req.path === "/" || req.path === "/subscribe")) return await subscribe(req, res);
    if (req.method === "GET" && req.path === "/confirm") return await updateByToken(req, res, "confirmed");
    if ((req.method === "GET" || req.method === "POST") && req.path === "/unsubscribe") {
      return await updateByToken(req, res, "unsubscribed");
    }
    return res.status(404).json({ ok: false, message: "Not found." });
  } catch (error) {
    console.error("Newsletter request failed", error instanceof Error ? error.message : "unknown error");
    return res.status(500).json({ ok: false, message: "Subscription is temporarily unavailable. Please try again." });
  }
});
