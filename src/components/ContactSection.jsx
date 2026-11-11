import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Mail, PenLine } from "lucide-react";
import { Eyebrow } from "./ui/typography";
import { SelectField, TextField, TextAreaField, goldButton, isEmail, focusFirstError } from "./ui/form-fields";

const EMPTY = { name: "", email: "", phone: "", topic: "", message: "" };

const TOPICS = [
  { value: "listing", label: "A book listing" },
  { value: "submitting", label: "Submitting my book" },
  { value: "events", label: "Readings & events" },
  { value: "other", label: "Something else" },
];

const CONTAINER = "mx-auto max-w-[1700px] px-5 sm:px-10 lg:px-16";

/**
 * Contact Us — UI only.
 * To connect a backend later, replace the fake delay inside handleSubmit.
 */
export default function ContactSection({
  eyebrow = "Get in touch",
  title = "Contact Us",
  description = "Have a question about a listing, an event or submitting your book? Send us a message and we’ll reply within two working days.",
  email = "hello@booknshelves.com",
  hours = "Mon – Fri, 9 am – 6 pm EST",
  headingLevel = "h1", // use "h2" when this sits inside another page
}) {
  const HeadingTag = headingLevel;
  const reduce = useReducedMotion();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your full name.";
    if (!form.email.trim()) e.email = "Enter your email.";
    else if (!isEmail(form.email)) e.email = "Enter a valid email, like name@example.com.";
    if (form.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (!form.message.trim()) e.message = "Write your message.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return focusFirstError();

    setStatus("sending");
    await new Promise((r) => setTimeout(r, 800)); // ← replace with your API call later
    setStatus("sent");
    setForm(EMPTY);
  };

  const fade = (delay = 0) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } };

  return (
    <section className="bg-[#FAF7F2] py-16 sm:py-24">
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20`}>
        {/* ---------- Left: intro + details ---------- */}
        <motion.div {...fade(0)}>
          <Eyebrow size="md" color="inherit" className="text-[#D9773B]">{eyebrow}</Eyebrow>
          <HeadingTag className="mt-3 font-[family-name:var(--font-heading)] text-[40px] font-normal leading-[1.12] tracking-[-0.015em] text-[#14213D] md:text-[56px] md:tracking-[-0.02em]">
            {title}
          </HeadingTag>
          {description && <p className="mt-5 max-w-md text-[15px] leading-[1.85] text-[#4a4440]">{description}</p>}

          <ul className="mt-10 grid max-w-md gap-px overflow-hidden rounded-md border border-[#E4DDD3] bg-[#E4DDD3]">
            <li className="flex gap-4 bg-white p-5">
              <Mail aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#B39262]" strokeWidth={1.6} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#77736D]">Email us</p>
                <a href={`mailto:${email}`} className="mt-0.5 block text-[15px] font-medium text-[#14213D] hover:underline">
                  {email}
                </a>
              </div>
            </li>
            <li className="flex gap-4 bg-white p-5">
              <Clock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#B39262]" strokeWidth={1.6} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#77736D]">Hours</p>
                <p className="mt-0.5 text-[15px] font-medium text-[#14213D]">{hours}</p>
                <p className="text-[13px] text-[#77736D]">We reply within two working days.</p>
              </div>
            </li>
            <li className="flex gap-4 bg-white p-5">
              <PenLine aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#B39262]" strokeWidth={1.6} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#77736D]">Are you an author?</p>
                <Link to="/submit" className="group mt-0.5 inline-flex items-center gap-1.5 text-[15px] font-medium text-[#14213D]">
                  Submit your book
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* ---------- Right: form ---------- */}
        <motion.div {...fade(0.1)}>
          {status === "sent" ? (
            <div role="status" className="flex h-full flex-col items-center justify-center rounded-md border border-[#E4DDD3] bg-white px-6 py-16 text-center">
              <CheckCircle2 aria-hidden="true" className="h-11 w-11 text-[#B39262]" strokeWidth={1.6} />
              <p className="mt-4 font-[family-name:var(--font-heading)] text-[28px] text-[#14213D]">Message sent</p>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[#63524E]">
                Thank you for reaching out. We’ll get back to you within two working days.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 text-[13px] font-semibold text-[#14213D] underline underline-offset-4 hover:text-[#B39262]"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-5 rounded-md border border-[#E4DDD3] bg-white p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Full name" required autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
                <TextField label="Email" required type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
                <TextField label="Phone" type="tel" autoComplete="tel" placeholder="Optional" value={form.phone} onChange={set("phone")} error={errors.phone} />
                <SelectField label="What’s it about?" placeholder="Choose a topic" options={TOPICS} value={form.topic} onChange={set("topic")} />
              </div>
              <TextAreaField
                label="Message"
                required
                rows={7}
                placeholder="How can we help?"
                value={form.message}
                onChange={set("message")}
                error={errors.message}
              />
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EFE9E1] pt-5">
                <p className="text-[12px] text-[#77736D]">
                  Fields marked <span className="text-[#14213D]">*</span> are required.
                </p>
                <button type="submit" disabled={status === "sending"} className={goldButton}>
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}