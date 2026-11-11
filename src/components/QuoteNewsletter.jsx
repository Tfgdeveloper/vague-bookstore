import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { buttonClasses } from "./ui/button";
import { Eyebrow, Description } from "./ui/typography";

/**
 * Newsletter signup — "A little literary inspiration."
 *
 * onSubscribe(email) — your API call. Return a promise; throw to show an error.
 * <QuoteNewsletter onSubscribe={(email) => fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) })} />
 *
 * Use "\n" in `title` to choose where the line breaks.
 */

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function QuoteNewsletter({
  eyebrow = "Letters from our bookshop",
  title = "A little literary inspiration.\nStraight to your inbox.",
  description = "Reading lists, new discoveries from independent authors, and first word on upcoming readings, once a month.",
  label = "Your email address",
  placeholder = "you@example.com",
  buttonLabel = "Turn the page · Subscribe",
  note = "Only good stories. No spam. Unsubscribe whenever you like.",
  privacyTo = "/privacy",
  onSubscribe = async () => {},
}) {
  const reduce = useReducedMotion();
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Enter your email address.");
    if (!isEmail(email)) return setError("Enter a valid email, like name@example.com.");

    setError("");
    setStatus("loading");
    try {
      await onSubscribe(email.trim());
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
    }
  };

  const fade = (delay) =>
    reduce
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section className="bg-[#EFE7DB] py-14 sm:py-20">
      <div className="mx-auto grid max-w-[1700px] grid-cols-1 items-center gap-10 px-5 sm:px-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20 lg:px-16">
        {/* ---------- Text ---------- */}
        <div className="text-center lg:text-left">
          <motion.div {...fade(0)}>
            <Eyebrow size="md" color="inherit" className="mb-4 text-[#D9773B]">
              {eyebrow}
            </Eyebrow>
          </motion.div>
          <motion.h2
            {...fade(0.08)}
            className="whitespace-pre-line font-[family-name:var(--font-heading)] text-[32px] font-normal leading-[1.15] tracking-[-0.01em] text-[#14213D] [text-wrap:balance] sm:text-[40px] lg:text-[44px] lg:leading-[1.12]"
          >
            {title}
          </motion.h2>
          {description && (
            <motion.div {...fade(0.16)}>
              <Description size="md" color="muted" className="mx-auto mt-5 max-w-xl lg:mx-0">
                {description}
              </Description>
            </motion.div>
          )}
        </div>

        {/* ---------- Form ---------- */}
        <motion.div {...fade(0.2)} className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
          {status === "success" ? (
            <div role="status" className="flex items-start gap-3 rounded-md bg-white/70 px-5 py-6">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-[#C9A36B]" />
              <div>
                <p className="font-[family-name:var(--font-heading)] text-xl text-[#14213D]">You’re on the list.</p>
                <p className="mt-1 text-[13px] text-[#63524E]">Watch your inbox for our next letter.</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-3 text-[12px] font-semibold text-[#611C24] underline-offset-4 hover:underline"
                >
                  Use a different email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor={inputId} className="mb-2 block text-[13px] font-medium text-[#14213D]">
                {label}
              </label>
              <div
                className={`flex h-12 items-center gap-3 rounded-md border bg-white px-4 transition-[border-color,box-shadow] focus-within:shadow-[0_0_0_4px_rgba(201,163,107,0.25)] ${
                  error ? "border-red-600" : "border-transparent focus-within:border-[#C9A36B]"
                }`}
              >
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-[#C9A36B]" />
                <input
                  id={inputId}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder={placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  className="h-full w-full min-w-0 bg-transparent text-sm text-[#14213D] outline-none placeholder:text-[#9a8e84]"
                />
              </div>
              {error && (
                <p id={errorId} role="alert" className="mt-2 text-[12px] text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className={`${buttonClasses("primary", "lg")} mt-4 h-12 w-full rounded-md normal-case tracking-normal`}
              >
                {status === "loading" ? "Subscribing…" : buttonLabel}
                {status !== "loading" && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
              </button>

              <p className="mt-4 text-[11px] leading-relaxed text-[#77736D]">
                {note}
                {privacyTo && (
                  <>
                    <br />
                    By subscribing, you agree to our{" "}
                    <Link to={privacyTo} className="underline underline-offset-2 ">
                      Privacy Policy
                    </Link>
                    .
                  </>
                )}
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}