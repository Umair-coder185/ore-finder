/**
 * Client & Server Contact Form Validation & Anti-Spam Sanitization (Section 5.B & Section 13)
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Strips raw HTML angle brackets to prevent HTML injection in correspondence payloads.
 * @param {string} value
 */
export function sanitizeTextField(value) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .trim();
}

/**
 * Validates a contact form submission payload on both client and server.
 *
 * @param {Object} payload
 * @param {string} [payload.name]
 * @param {string} [payload.email]
 * @param {string} [payload.subject]
 * @param {string} [payload.message]
 * @param {string} [payload.companyWebsite] - Anti-spam honeypot field (must be empty)
 */
export function validateContactSubmission(payload = {}) {
  const errors = {};

  // Anti-spam honeypot check
  const honeypot = String(payload.companyWebsite ?? "").trim();
  if (honeypot.length > 0) {
    return {
      isValid: false,
      isSpam: true,
      errors: { form: "Automated submission rejected by anti-spam filter." },
      sanitized: null,
    };
  }

  const name = sanitizeTextField(payload.name);
  const email = sanitizeTextField(payload.email);
  const subject = sanitizeTextField(payload.subject);
  const message = sanitizeTextField(payload.message);

  if (!name || name.length < 2) {
    errors.name = "Please enter your name (at least 2 characters).";
  } else if (name.length > 80) {
    errors.name = "Name must be 80 characters or fewer.";
  }

  if (!email) {
    errors.email = "Please enter an email address for correspondence.";
  } else if (email.length > 120 || !EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address (e.g., name@example.com).";
  }

  if (!subject || subject.length < 4) {
    errors.subject = "Please enter a clear subject (at least 4 characters).";
  } else if (subject.length > 120) {
    errors.subject = "Subject must be 120 characters or fewer.";
  }

  if (!message || message.length < 20) {
    errors.message = "Please provide a detailed message (at least 20 characters).";
  } else if (message.length > 2500) {
    errors.message = "Message must be 2,500 characters or fewer.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    isSpam: false,
    errors,
    sanitized: isValid
      ? {
          name,
          email,
          subject,
          message,
        }
      : null,
  };
}
