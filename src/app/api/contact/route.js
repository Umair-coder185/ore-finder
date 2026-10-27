import { NextResponse } from "next/server";
import { validateContactSubmission } from "@/lib/validation/contactValidation";

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestLog = new Map();

function checkRateLimit(clientKey) {
  const now = Date.now();
  const timestamps = ipRequestLog.get(clientKey) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestLog.set(clientKey, recent);
    return false;
  }

  recent.push(now);
  ipRequestLog.set(clientKey, recent);
  return true;
}

/**
 * Server-Side Contact Endpoint (`POST /api/contact`).
 *
 * Enforces:
 * 1. Rate limiting per client IP
 * 2. Honeypot anti-spam check
 * 3. Strict server-side field validation (`validateContactSubmission`)
 * 4. Truthful delivery handling: returns `200 OK` ONLY if `process.env.CONTACT_WEBHOOK_URL`
 *    is configured and accepts the message; otherwise returns `503 DELIVERY_NOT_CONFIGURED`
 *    so the UI never displays a fabricated success message.
 */
export async function POST(request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "local-client";
  const clientIp = forwardedFor.split(",")[0].trim();

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      {
        ok: false,
        code: "RATE_LIMITED",
        message: "Too many contact attempts. Please wait one minute before trying again.",
      },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_JSON",
        message: "Request body must be valid JSON.",
      },
      { status: 400 }
    );
  }

  const validation = validateContactSubmission(body);

  if (validation.isSpam) {
    return NextResponse.json(
      {
        ok: false,
        code: "SPAM_REJECTED",
        message: validation.errors.form,
      },
      { status: 400 }
    );
  }

  if (!validation.isValid) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        errors: validation.errors,
        message: "Please correct the highlighted fields and try again.",
      },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      {
        ok: false,
        code: "DELIVERY_NOT_CONFIGURED",
        message:
          "Validation succeeded, but server-side mail delivery (CONTACT_WEBHOOK_URL) is awaiting owner configuration. No message was transmitted.",
      },
      { status: 503 }
    );
  }

  try {
    const upstreamResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "orefinder.io/contact",
        ...validation.sanitized,
      }),
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          code: "UPSTREAM_DELIVERY_FAILED",
          message:
            "The configured mail delivery service returned an error. Your message could not be delivered.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        code: "DELIVERED",
        message:
          "Your message was validated and accepted by the configured correspondence endpoint.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "DELIVERY_NETWORK_ERROR",
        message: "Could not reach the configured delivery endpoint. Please try again later.",
      },
      { status: 502 }
    );
  }
}
