"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { profile } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

// Public Web3Forms access key, read from env (see .env.example).
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Guard: if the key is missing, fail loudly rather than silently posting.
    if (!WEB3FORMS_KEY) {
      setStatus("error");
      setErrorMsg(
        "Form isn't configured yet — the access key is missing. Reach me on WhatsApp or email meanwhile."
      );
      return;
    }
    data.append("access_key", WEB3FORMS_KEY);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(
          json.message ||
            "Something went wrong sending that. Try again, or reach me directly below."
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(
        "Couldn't reach the server. Check your connection, or message me on WhatsApp."
      );
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-line bg-ink-800 px-4 py-3 text-bone placeholder:text-bone-faint transition-colors focus:border-amber focus:outline-none";
  const labelClass =
    "mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-bone-dim";

  return (
    <section id="contact" className="scroll-mt-24 py-28 sm:py-36">
      <div className="shell">
        <SectionHeader
          eyebrow="Contact"
          index="/ 04"
          title="Have a system worth building? Let's talk."
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal>
              <form onSubmit={handleSubmit} noValidate>
                {/* Web3Forms metadata */}
                <input type="hidden" name="subject" value="New message from portfolio" />
                <input type="hidden" name="from_name" value="Portfolio — Contact" />
                {/* Honeypot: bots fill this, humans never see it */}
                <input
                  type="checkbox"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="message" className={labelClass}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="What are you building, and where do I fit?"
                    className={`${fieldClass} resize-y`}
                  />
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 font-mono text-sm uppercase tracking-[0.16em] text-ink-900 transition-colors hover:bg-amber-bright disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" ? "Sending…" : "Send message"}
                  </button>

                  {/* Live status region for screen readers */}
                  <p aria-live="polite" className="font-mono text-sm">
                    {status === "success" && (
                      <span className="text-amber">
                        Sent. I'll get back to you soon.
                      </span>
                    )}
                    {status === "error" && (
                      <span className="text-bone-dim">{errorMsg}</span>
                    )}
                  </p>
                </div>
              </form>
            </Reveal>
          </div>

          {/* Direct channels */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.1}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
                Or reach me directly
              </p>

              <a
                href={profile.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-amber/40 px-5 py-4 transition-colors hover:bg-amber hover:text-ink-900"
              >
                <span className="font-mono text-sm uppercase tracking-[0.14em]">
                  Message on WhatsApp
                </span>
                <span aria-hidden="true">→</span>
              </a>

              <dl className="mt-8 space-y-5">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${profile.email}`}
                      className="link-underline text-bone transition-colors hover:text-amber"
                    >
                      {profile.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
                    GitHub
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={profile.github.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-bone transition-colors hover:text-amber"
                    >
                      {profile.github.display}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
                    LinkedIn
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={profile.linkedin.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-bone transition-colors hover:text-amber"
                    >
                      {profile.linkedin.display}
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
