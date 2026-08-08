"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import BorderBeam from "@/components/BorderBeam";
import CtaArrow from "@/components/CtaArrow";
import MotionReveal from "@/components/MotionReveal";
import SpotlightCard from "@/components/SpotlightCard";
import styles from "./Contact.module.css";

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "info@mrdigitalbee.com",
    href: "mailto:info@mrdigitalbee.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 63809 86703",
    href: "tel:+916380986703",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "UAE, INDIA",
    href: null,
  },
] as const;

const SERVICES = [
  "Website Development",
  "Website Maintenance",
  "CRM / Dashboard",
  "Logo Design",
  "Other",
] as const;

type Service = (typeof SERVICES)[number];

type FormErrors = {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState<Service | "">("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) next.name = "Name is required.";
    if (!trimmedEmail) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = "Enter a valid email address.";
    }
    if (!service) next.service = "Please select a service.";
    if (!trimmedMessage) next.message = "Message is required.";

    return next;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.service) setMenuOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service,
          message: message.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setSubmitError(
          data?.error || "Could not send your message. Please try again.",
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError("");
    setName("");
    setEmail("");
    setMessage("");
    setService("");
    setErrors({});
    setMenuOpen(false);
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  return (
    <section id="contact" className={styles.section} aria-label="Contact Us">
      <div className={styles.inner}>
        <SpotlightCard
          className={styles.card}
          spotlightColor="rgba(255, 255, 255, 0.28)"
        >
          <div className={styles.waves} aria-hidden />

          <div className={styles.layout}>
            <MotionReveal className={styles.info} y={28} x={-12}>
              <span className={styles.badge}>Contact Us</span>
              <h2 className={styles.heading}>
                Let’s build something that works for your brand.
              </h2>
              <p className={styles.lead}>
                Strategy, design, and development — websites, CRMs, logos, and
                ongoing care. Tell us what you need and we’ll reply within one
                business day.
              </p>

              <ul className={styles.details}>
                {DETAILS.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <>
                      <span className={styles.detailIcon} aria-hidden>
                        <Icon size={16} strokeWidth={1.75} />
                      </span>
                      <span className={styles.detailCopy}>
                        <span className={styles.detailLabel}>{item.label}</span>
                        <span className={styles.detailValue}>{item.value}</span>
                      </span>
                    </>
                  );

                  return (
                    <li key={item.label} className={styles.detailItem}>
                      {item.href ? (
                        <a href={item.href} className={styles.detailLink}>
                          {content}
                        </a>
                      ) : (
                        <div className={styles.detailLink}>{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className={styles.social}>
                <span className={styles.socialLabel}>Follow</span>
                <div className={styles.socialLinks}>
                  <a
                    href="https://instagram.com"
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="https://linkedin.com"
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon />
                  </a>
                </div>
              </div>
            </MotionReveal>

            <MotionReveal className={styles.formWrap} delay={0.12} y={32} x={12}>
              <BorderBeam className={styles.formBeam} compact tone="black">
                <div className={styles.formPanel}>
                  {submitted ? (
                    <div className={styles.success} role="status">
                      <h3 className={styles.successTitle}>Message sent</h3>
                      <p className={styles.successBody}>
                        Thanks for reaching out to Mrdigital Bee. We’ll get back
                        to you shortly with next steps.
                      </p>
                      <button
                        type="button"
                        className={styles.reset}
                        onClick={resetForm}
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form
                      className={styles.form}
                      onSubmit={onSubmit}
                      noValidate
                    >
                      <div className={styles.formHeader}>
                        <h3 className={styles.formTitle}>Start a project</h3>
                        <p className={styles.formLead}>
                          Share a few details and we’ll take it from there.
                        </p>
                      </div>

                      <div className={styles.row}>
                        <label className={styles.field}>
                          <span className={styles.label}>
                            Name <span className={styles.required}>*</span>
                          </span>
                          <input
                            className={`${styles.input} ${
                              errors.name ? styles.inputError : ""
                            }`}
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Your name"
                            value={name}
                            maxLength={100}
                            required
                            aria-required="true"
                            aria-invalid={Boolean(errors.name)}
                            onChange={(event) => {
                              setName(event.target.value);
                              clearError("name");
                            }}
                          />
                          {errors.name ? (
                            <p className={styles.fieldError} role="alert">
                              {errors.name}
                            </p>
                          ) : null}
                        </label>
                        <label className={styles.field}>
                          <span className={styles.label}>
                            Email <span className={styles.required}>*</span>
                          </span>
                          <input
                            className={`${styles.input} ${
                              errors.email ? styles.inputError : ""
                            }`}
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@company.com"
                            value={email}
                            maxLength={254}
                            required
                            aria-required="true"
                            aria-invalid={Boolean(errors.email)}
                            onChange={(event) => {
                              setEmail(event.target.value);
                              clearError("email");
                            }}
                          />
                          {errors.email ? (
                            <p className={styles.fieldError} role="alert">
                              {errors.email}
                            </p>
                          ) : null}
                        </label>
                      </div>

                      <div className={styles.field}>
                        <span className={styles.label} id={`${listboxId}-label`}>
                          Service <span className={styles.required}>*</span>
                        </span>
                        <input type="hidden" name="service" value={service} />
                        <div className={styles.dropdown} ref={dropdownRef}>
                          <button
                            type="button"
                            className={`${styles.dropdownTrigger} ${
                              menuOpen ? styles.dropdownTriggerOpen : ""
                            } ${errors.service ? styles.dropdownTriggerError : ""}`}
                            aria-haspopup="listbox"
                            aria-expanded={menuOpen}
                            aria-controls={listboxId}
                            aria-labelledby={`${listboxId}-label`}
                            aria-required="true"
                            aria-invalid={Boolean(errors.service)}
                            onClick={() => setMenuOpen((open) => !open)}
                          >
                            <span
                              className={
                                service
                                  ? styles.dropdownValue
                                  : styles.dropdownPlaceholder
                              }
                            >
                              {service || "What do you need?"}
                            </span>
                            <ChevronDown
                              size={16}
                              strokeWidth={2}
                              className={`${styles.dropdownChevron} ${
                                menuOpen ? styles.dropdownChevronOpen : ""
                              }`}
                              aria-hidden
                            />
                          </button>

                          {menuOpen ? (
                            <ul
                              id={listboxId}
                              className={styles.dropdownMenu}
                              role="listbox"
                              aria-labelledby={`${listboxId}-label`}
                            >
                              {SERVICES.map((option) => {
                                const selected = service === option;
                                return (
                                  <li key={option} role="presentation">
                                    <button
                                      type="button"
                                      role="option"
                                      aria-selected={selected}
                                      className={`${styles.dropdownOption} ${
                                        selected
                                          ? styles.dropdownOptionActive
                                          : ""
                                      }`}
                                      onClick={() => {
                                        setService(option);
                                        clearError("service");
                                        setMenuOpen(false);
                                      }}
                                    >
                                      {option}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}
                        </div>
                        {errors.service ? (
                          <p className={styles.fieldError} role="alert">
                            {errors.service}
                          </p>
                        ) : null}
                      </div>

                      <label className={styles.field}>
                        <span className={styles.label}>
                          Message <span className={styles.required}>*</span>
                        </span>
                        <textarea
                          className={`${styles.input} ${styles.textarea} ${
                            errors.message ? styles.inputError : ""
                          }`}
                          name="message"
                          rows={5}
                          placeholder="Goals, timeline, and anything we should know…"
                          value={message}
                          maxLength={5000}
                          required
                          aria-required="true"
                          aria-invalid={Boolean(errors.message)}
                          onChange={(event) => {
                            setMessage(event.target.value);
                            clearError("message");
                          }}
                        />
                        {errors.message ? (
                          <p className={styles.fieldError} role="alert">
                            {errors.message}
                          </p>
                        ) : null}
                      </label>

                      {submitError ? (
                        <p className={styles.submitError} role="alert">
                          {submitError}
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        className={styles.submit}
                        data-cta
                        disabled={submitting}
                      >
                        <span>{submitting ? "Sending…" : "Send message"}</span>
                        <span className={styles.submitArrow}>
                          <CtaArrow />
                        </span>
                      </button>
                    </form>
                  )}
                </div>
              </BorderBeam>
            </MotionReveal>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
