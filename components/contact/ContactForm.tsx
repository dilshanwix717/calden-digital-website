"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Site } from "@/lib/schemas";
import { buildContactSchema } from "@/lib/contact-schema";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Field, CONTROL_CLASS, controlBorder } from "@/components/ui/Field";
import { Chevron } from "@/components/icons/Chevron";

const INITIAL_STATE: ContactState = { status: "idle" };

type FormValues = {
  name: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
};

const EMPTY_VALUES: FormValues = {
  name: "",
  email: "",
  projectType: "",
  timeline: "",
  budget: "",
  message: "",
};

/**
 * Same component on / and /contact — idPrefix is the only variation, so
 * form-control ids stay unique if both ever appear on one page (they
 * don't currently, but nothing here assumes they can't).
 *
 * <form action={formAction}>, not onSubmit — this is what makes the form
 * work with JavaScript disabled: the browser posts directly to the Server
 * Action's endpoint and React is not required for the submission itself,
 * only for the enhanced client-side validation and state UI layered on top.
 *
 * Every control is CONTROLLED (value + onChange), not defaultValue. Found
 * necessary in Phase 7, not assumed up front: with useActionState, the
 * framework's own form-submission machinery clears uncontrolled fields once
 * the action resolves, even on a failure — exactly the value-loss the "never
 * clear the form on failure" requirement forbids, and exactly what the
 * plan's own pitfall list warned about ("uncontrolled inputs are preserved
 * on the no-JS path automatically but not on the client path"). Controlled
 * state is unaffected by that reset because React owns the value, not the
 * DOM node.
 *
 * contactForm and contactEmail arrive as PROPS from the server-rendered
 * parent (ContactSection.tsx / app/contact/page.tsx), not from a client-side
 * getSite() call. Found necessary in Phase 7: calling getSite() from this
 * client component pulled lib/content.ts's entire static import of all five
 * JSON content files into the client bundle — including projects.json and
 * services.json, which this form never touches. Measured cost of that
 * mistake: the homepage's First Load JS jumped from ~121 KB to 182.6 KB
 * brotli. Props keep this component's bundle limited to what it actually
 * renders.
 */
export function ContactForm({
  idPrefix = "contact",
  contactForm,
  contactEmail,
  whatsappUrl,
}: {
  idPrefix?: string;
  contactForm: Site["contactForm"];
  contactEmail: string;
  /** Pre-built wa.me link — see BUILD-PLAN §Phase 7 for why this arrives as
   * a prop rather than being built by calling lib/whatsapp.ts's
   * whatsappUrl() client-side (same content-bundle leak as contactForm). */
  whatsappUrl: string;
}) {
  const [state, formAction, isPending] = useActionState(submitContact, INITIAL_STATE);
  const [clientFieldErrors, setClientFieldErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);

  const tsRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Written on mount, not defaultValue — a defaultValue would be baked
  // into the static HTML at build time, since this page is statically
  // generated. See BUILD-PLAN §1.14.
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = String(Date.now());
  }, []);

  const serverFieldErrors = state.status === "error" ? state.fieldErrors : undefined;
  const fieldErrors = { ...serverFieldErrors, ...clientFieldErrors };
  const firstErrorField = Object.keys(fieldErrors)[0] ?? null;

  // Move focus to the first invalid control after a failed submit — either
  // source, client or server. `fieldErrors` above already merges both, so a
  // single effect keyed on the field NAME (a primitive, unlike the errors
  // object which is a fresh reference every render) covers both failure
  // paths and only re-fires when the identity of "which field is first
  // invalid" actually changes.
  const prevErrorFieldRef = useRef<string | null>(null);
  useEffect(() => {
    if (firstErrorField && firstErrorField !== prevErrorFieldRef.current) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
      el?.focus();
    }
    prevErrorFieldRef.current = firstErrorField;
  }, [firstErrorField]);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const ContactSchema = buildContactSchema({
      projectTypes: contactForm.projectTypes as [string, ...string[]],
      timelines: contactForm.timelines as [string, ...string[]],
      budgets: contactForm.budgets as [string, ...string[]],
    });
    const result = ContactSchema.safeParse(values);
    if (!result.success) {
      e.preventDefault();
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in errors)) errors[key] = issue.message;
      }
      setClientFieldErrors(errors);
      return;
    }
    setClientFieldErrors({});
    // Let the native submit proceed to formAction — controlled values are
    // already present as each input's `value`, so FormData picks them up
    // from the DOM exactly as an uncontrolled form would.
  }

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold tracking-[-0.015em] text-ink">
          {contactForm.successHeading}
        </h3>
        <p className="t-body text-muted">{contactForm.successBody}</p>
      </div>
    );
  }

  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-[18px]">
      {/* Honeypot — visually hidden with position, not display:none, since
          some bots specifically check for display:none and skip such
          fields. Labelled plausibly for the same reason. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={id("company_website")}>Company website</label>
        <input
          type="text"
          id={id("company_website")}
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input ref={tsRef} type="hidden" name="_ts" />

      <div className="grid grid-cols-1 gap-[18px] desk:grid-cols-2">
        <Field label={contactForm.labels.name} htmlFor={id("name")} required error={fieldErrors.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            placeholder={contactForm.placeholders.name}
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? `${id("name")}-message` : undefined}
            className={`${CONTROL_CLASS} ${controlBorder(!!fieldErrors.name)}`}
          />
        </Field>
        <Field label={contactForm.labels.email} htmlFor={id("email")} required error={fieldErrors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            placeholder={contactForm.placeholders.email}
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? `${id("email")}-message` : undefined}
            className={`${CONTROL_CLASS} ${controlBorder(!!fieldErrors.email)}`}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-[18px] desk:grid-cols-2">
        <Field label={contactForm.labels.projectType} htmlFor={id("projectType")} required error={fieldErrors.projectType}>
          <SelectField
            id={id("projectType")}
            name="projectType"
            placeholder={contactForm.placeholders.projectType}
            options={contactForm.projectTypes}
            value={values.projectType}
            onChange={(v) => setField("projectType", v)}
            hasError={!!fieldErrors.projectType}
            describedBy={fieldErrors.projectType ? `${id("projectType")}-message` : undefined}
          />
        </Field>
        <Field label={contactForm.labels.timeline} htmlFor={id("timeline")} required error={fieldErrors.timeline}>
          <SelectField
            id={id("timeline")}
            name="timeline"
            placeholder={contactForm.placeholders.timeline}
            options={contactForm.timelines}
            value={values.timeline}
            onChange={(v) => setField("timeline", v)}
            hasError={!!fieldErrors.timeline}
            describedBy={fieldErrors.timeline ? `${id("timeline")}-message` : undefined}
          />
        </Field>
      </div>

      <Field label={contactForm.labels.budget} htmlFor={id("budget")} required error={fieldErrors.budget}>
        <SelectField
          id={id("budget")}
          name="budget"
          placeholder={contactForm.placeholders.budget}
          options={contactForm.budgets}
          value={values.budget}
          onChange={(v) => setField("budget", v)}
          hasError={!!fieldErrors.budget}
          describedBy={fieldErrors.budget ? `${id("budget")}-message` : undefined}
        />
      </Field>

      <Field label={contactForm.labels.message} htmlFor={id("message")} required error={fieldErrors.message}>
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          placeholder={contactForm.placeholders.message}
          value={values.message}
          onChange={(e) => setField("message", e.target.value)}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? `${id("message")}-message` : undefined}
          className={`${CONTROL_CLASS} ${controlBorder(!!fieldErrors.message)} resize-y`}
        />
      </Field>

      {state.status === "error" && state.formError && (
        <div role="alert" className="rounded-sm border border-danger bg-surface p-4 text-sm leading-[1.5] text-ink">
          {formatErrorMessage(state.formError, contactEmail, whatsappUrl)}
        </div>
      )}

      <div className="mt-1 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-brand bg-brand px-[22px] py-3 text-[15px] font-semibold leading-none tracking-[-0.01em] text-on-brand transition-colors duration-200 hover:bg-brand-hover disabled:opacity-40"
        >
          {isPending ? "Sending…" : contactForm.submitLabel}
          {!isPending && <span aria-hidden="true" className="arrow">→</span>}
        </button>
        <span className="text-sm text-subtle">{contactForm.replyHint}</span>
      </div>
    </form>
  );
}

/**
 * formError is plain text from state, but WhatsApp/email need to render as
 * real clickable links per §1.15 — a toast or plain text loses that. This
 * splits the known error-message shape into text + link fragments rather
 * than injecting HTML.
 */
function formatErrorMessage(message: string, email: string, whatsappUrl: string) {
  const parts = message.split(/(WhatsApp|hello@calden\.lk|\S+@\S+\.\S+)/g);
  return parts.map((part, i) => {
    if (part === "WhatsApp") {
      return (
        <a key={i} href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline">
          WhatsApp
        </a>
      );
    }
    if (part.includes("@") && part.includes(".")) {
      return (
        <a key={i} href={`mailto:${email}`} className="font-medium text-brand underline">
          {part}
        </a>
      );
    }
    return part;
  });
}

/**
 * Found in Phase 7: React's form-action lifecycle (useActionState) calls
 * the native form.reset() after every action completes, success or
 * failure — this is documented React 19 behaviour, meant to mirror a plain
 * HTML form submission. Controlled <input>/<textarea> survive that reset
 * because React re-applies the `value` DOM property on every commit and
 * that write wins over the native reset. A controlled <select>'s SELECTED
 * OPTION does not reliably survive the same way — the browser's reset
 * walks the <option> elements and sets `selected` natively, and nothing
 * forces React to re-touch the <select> element's value afterwards if the
 * component doesn't re-render with a changed prop.
 *
 * Fix: explicitly re-assert `select.value = value` in a layout effect that
 * runs after every render. This is exactly the kind of DOM synchronisation
 * effects exist for — it doesn't call setState, so it isn't the anti-pattern
 * the React Compiler lint flags elsewhere in this file; it's a one-way sync
 * from React's source of truth back onto a DOM node an external actor (the
 * browser's native reset) may have mutated.
 */
function SelectField({
  id,
  name,
  placeholder,
  options,
  value,
  onChange,
  hasError,
  describedBy,
}: {
  id: string;
  name: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
  describedBy?: string;
}) {
  const ref = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.value !== value) {
      ref.current.value = value;
    }
  });

  return (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={`${CONTROL_CLASS} ${controlBorder(hasError)} appearance-none pr-10`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle">
        <Chevron />
      </span>
    </div>
  );
}
