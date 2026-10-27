"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Info, Send } from "lucide-react";
import { validateContactSubmission } from "@/lib/validation/contactValidation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * Accessible Contact Form with Real Client-Side & Server-Side Validation (Section 5.B).
 *
 * Truthfulness Policy:
 * - Never displays a successful delivery message unless the server endpoint (`/api/contact`)
 *   actually accepts and delivers the payload via a configured `CONTACT_WEBHOOK_URL`.
 * - When `CONTACT_WEBHOOK_URL` is not configured (`isDeliveryConfigured === false`),
 *   clearly communicates that server delivery is awaiting owner credentials while allowing
 *   full client + server validation testing.
 *
 * @param {Object} props
 * @param {boolean} [props.isDeliveryConfigured=false]
 */
export function ContactForm({ isDeliveryConfigured = false }) {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    companyWebsite: "", // Hidden anti-spam honeypot
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);

  function handleChange(field, value) {
    setFields((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setServerResponse(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerResponse(null);

    const clientCheck = validateContactSubmission(fields);
    if (!clientCheck.isValid) {
      setErrors(clientCheck.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setServerResponse({
          type: "success",
          title: "Message Delivered",
          message: data.message,
        });
        setFields({
          name: "",
          email: "",
          subject: "",
          message: "",
          companyWebsite: "",
        });
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        setServerResponse({
          type: data.code === "DELIVERY_NOT_CONFIGURED" ? "info" : "error",
          title:
            data.code === "DELIVERY_NOT_CONFIGURED"
              ? "Validation Passed — Delivery Endpoint Awaiting Owner Configuration"
              : "Submission Not Delivered",
          message: data.message || "Your message could not be delivered at this time.",
        });
      }
    } catch {
      setServerResponse({
        type: "error",
        title: "Network Error",
        message: "Unable to reach the contact validation endpoint. Please check your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact and technical feedback form"
      className="space-y-5 rounded-2xl border border-[#DCE2DA] bg-white p-6 shadow-xs sm:p-8"
    >
      <div className="border-b border-[#E4E8E2] pb-4">
        <h2 className="font-heading text-xl font-bold text-[#202722]">
          Send Technical Feedback or Inquiry
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#65716B]">
          All fields are validated on both client and server.{" "}
          {!isDeliveryConfigured && (
            <span className="font-medium text-[#326B55]">
              (Note: Live email relay is currently disabled awaiting owner{" "}
              <code className="font-mono">CONTACT_WEBHOOK_URL</code> credentials.)
            </span>
          )}
        </p>
      </div>

      {/* Hidden Anti-Spam Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-company-website">Leave this field blank</label>
        <input
          id="contact-company-website"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={fields.companyWebsite}
          onChange={(e) => handleChange("companyWebsite", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#202722]"
          >
            Name <span className="text-[#B43E34]">*</span>
          </label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={80}
            value={fields.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Your name or handle"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <p
              id="contact-name-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-[#B43E34]"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#202722]"
          >
            Email Address <span className="text-[#B43E34]">*</span>
          </label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={120}
            value={fields.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <p
              id="contact-email-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-[#B43E34]"
            >
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#202722]"
        >
          Subject <span className="text-[#B43E34]">*</span>
        </label>
        <Input
          id="contact-subject"
          name="subject"
          type="text"
          required
          maxLength={120}
          value={fields.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          placeholder="e.g., Java 1.21 Seed Verification Report or Editorial Question"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
        />
        {errors.subject && (
          <p
            id="contact-subject-error"
            role="alert"
            className="mt-1.5 text-xs font-medium text-[#B43E34]"
          >
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#202722]"
        >
          Message <span className="text-[#B43E34]">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          maxLength={2500}
          value={fields.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Include relevant details such as Minecraft Edition (Java or Bedrock), release version, world seed, and coordinates if reporting a technical question…"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className="w-full rounded-lg border border-[#DCE2DA] bg-white p-3 text-sm text-[#202722] placeholder:text-[#828E88] focus:border-[#326B55] focus:outline-none"
        />
        {errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            className="mt-1.5 text-xs font-medium text-[#B43E34]"
          >
            {errors.message}
          </p>
        )}
      </div>

      {/* Server Status Banner */}
      {serverResponse && (
        <div
          role="status"
          aria-live="polite"
          className={
            serverResponse.type === "success"
              ? "flex items-start gap-2.5 rounded-xl border border-[#C8DDD0] bg-[#E9F1EC] p-4 text-xs sm:text-sm text-[#202722]"
              : serverResponse.type === "info"
                ? "flex items-start gap-2.5 rounded-xl border border-[#E5D5B5] bg-[#FAF4E8] p-4 text-xs sm:text-sm text-[#202722]"
                : "flex items-start gap-2.5 rounded-xl border border-[#E8C5C1] bg-[#FDF2F1] p-4 text-xs sm:text-sm text-[#8F2D24]"
          }
        >
          {serverResponse.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#326B55]" aria-hidden="true" />
          ) : serverResponse.type === "info" ? (
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#946B2D]" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B43E34]" aria-hidden="true" />
          )}
          <div>
            <strong className=" block font-semibold">{serverResponse.title}</strong>
            <span className="mt-0.5 block leading-relaxed">{serverResponse.message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          <Send className="h-4 w-4" aria-hidden="true" />
          <span>
            {isSubmitting
              ? "Validating Submission…"
              : isDeliveryConfigured
                ? "Send Message"
                : "Validate Form Input (Relay Inactive)"}
          </span>
        </Button>

        <span className="text-xs text-[#65716B]">
          Protected by server-side rate limiting &amp; honeypot validation.
        </span>
      </div>
    </form>
  );
}
