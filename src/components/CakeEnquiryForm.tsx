"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type Control } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Copy, Heart, Instagram, MessageCircle, Upload, X } from "lucide-react";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { editorialEase } from "@/lib/motion";
import { business } from "@/config/business";
import { buildEnquiryMessage, enquirySchema, flavours, getIndiaDate, getWhatsAppUrl, occasions, weights, type CakeEnquiryValues } from "@/lib/enquiry";
import styles from "./CakeEnquiryForm.module.css";

const requiredDetails = ["name", "whatsapp", "occasion", "date", "flavour", "weight", "design"] as const;

function EnquiryProgress({ control }: { control: Control<CakeEnquiryValues> }) {
  const values = useWatch({ control, name: requiredDetails });
  const reduced = useReducedMotionPreference();
  const completed = requiredDetails.reduce((count, field, index) => (
    count + (enquirySchema.shape[field].safeParse(values[index]).success ? 1 : 0)
  ), 0);

  return <div className={styles.completion}>
    <div className={styles.completionLabel}>
      <span>{completed === requiredDetails.length ? "Ready when you are" : "Your idea, taking shape"}</span>
      <span>{completed} / {requiredDetails.length} details</span>
    </div>
    <div className={styles.completionTrack} role="progressbar" aria-label="Enquiry details completed" aria-valuemin={0} aria-valuemax={requiredDetails.length} aria-valuenow={completed} aria-valuetext={`${completed} of ${requiredDetails.length} required details complete`}>
      <motion.div initial={false} animate={{ scaleX: completed / requiredDetails.length }} transition={{ duration: reduced ? 0 : 0.35, ease: editorialEase }}/>
    </div>
  </div>;
}

function ReferencePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url, setUrl] = useState("");
  const reduced = useReducedMotionPreference();
  useEffect(() => {
    const preview = URL.createObjectURL(file);
    setUrl(preview);
    return () => URL.revokeObjectURL(preview);
  }, [file]);
  return <motion.div className={styles.preview} layout="position" initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: reduced ? 1 : 0.94 }} transition={{ duration: reduced ? 0 : 0.25, ease: editorialEase }}>
    {/* A browser-local blob preview cannot use the remote image optimiser. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    {url && <img src={url} alt={`Reference: ${file.name}`} />}
    <span title={file.name}>{file.name}</span>
    <button type="button" onClick={onRemove} aria-label={`Remove ${file.name}`}><X size={14} /></button>
  </motion.div>;
}

export function CakeEnquiryForm() {
  const reduced = useReducedMotionPreference();
  const [references, setReferences] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [minimumDate, setMinimumDate] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const restoreEditFocus = useRef(false);
  const { register, control, handleSubmit, setFocus, formState: { errors, isSubmitting } } = useForm<CakeEnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", whatsapp: "", email: "", occasion: "", date: "", flavour: "", weight: "", design: "", instructions: "" },
    shouldFocusError: true,
  });
  useEffect(() => { setMinimumDate(getIndiaDate()); }, []);
  useEffect(() => {
    if (draft) successRef.current?.focus();
    else if (restoreEditFocus.current) {
      setFocus("name");
      restoreEditFocus.current = false;
    }
  }, [draft, setFocus]);
  const whatsappUrl = getWhatsAppUrl(business.whatsappNumber, draft ?? "");

  function addReferences(files: FileList | null) {
    if (!files) return;
    setUploadError("");
    const incoming = Array.from(files);
    if (incoming.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
      setUploadError("Please choose JPG, PNG or WebP images.");
      return;
    }
    if (incoming.some((file) => file.size > 5 * 1024 * 1024)) {
      setUploadError("Each reference image must be 5 MB or smaller.");
      return;
    }
    const unique = incoming.filter((file) => !references.some((existing) => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified));
    if (references.length + unique.length > 3) {
      setUploadError("You can add up to 3 reference images. Remove one to choose another.");
      return;
    }
    setReferences((current) => [...current, ...unique]);
  }

  async function copyDraft() {
    if (!draft) return;
    setCopyError("");
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(draft);
      else {
        messageRef.current?.select();
        if (!document.execCommand("copy")) throw new Error("Copy unavailable");
      }
      setCopied(true);
    } catch {
      messageRef.current?.focus();
      messageRef.current?.select();
      setCopyError("Your browser couldn't copy automatically. Select the message below and copy it manually.");
    }
  }

  const fieldError = (name: keyof CakeEnquiryValues) => errors[name] ? <span id={`${name}-error`} className={styles.error}>{errors[name]?.message}</span> : null;
  const accessibility = (name: keyof CakeEnquiryValues) => ({ "aria-required": name !== "email" && name !== "instructions", "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });

  return <section id="enquiry" className={styles.section} aria-labelledby="enquiry-heading">
    <div className={styles.layout}>
      <div className={styles.intro}>
        <p className="eyebrow">A LITTLE IDEA. A BEAUTIFUL BEGINNING.</p>
        <h2 id="enquiry-heading">Your dream cake<br />starts <em>right here.</em></h2>
        <p>Big celebrations, little surprises, and everything in between. Tell us what you have in mind, and let’s make it yours.</p>
        <div className={styles.personalNote}><Heart size={21} strokeWidth={1.2} /><div><strong>Made with you. Made for you.</strong><span>Every cake begins with a conversation with Neha.</span></div></div>
        <div className={styles.details}><span>BASED IN BANGALORE</span><p>Every design is personal. Your quote is too.</p></div>
        <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.instagramLink}><Instagram size={17} /> Prefer a little inspiration first? <ArrowRight size={16} /></a>
      </div>
      <div className={styles.formPanel}>
        {draft ? <motion.div className={styles.success} ref={successRef} tabIndex={-1} aria-labelledby="enquiry-ready" initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.45, ease: editorialEase }}>
          <span className={styles.successIcon}>
            <svg width="29" height="29" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <motion.circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 0.6, ease: editorialEase }}/>
              <motion.path d="m10 16 4 4 8-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.2, ease: editorialEase }}/>
            </svg>
          </span>
          <p className="eyebrow">ONE STEP CLOSER</p>
          <h3 id="enquiry-ready">Your sweet idea is ready.</h3>
          <p>Your enquiry is prepared on this device. Send it to Neha to discuss the design, availability and your personalised quote.</p>
          {whatsappUrl ? <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Continue on WhatsApp <ArrowRight size={17} /></a> : <div className={styles.setupNote}><strong>WhatsApp contact coming soon</strong><p>The studio’s WhatsApp number hasn’t been added to this preview yet. Copy your enquiry and send it to Neha on Instagram.</p></div>}
          <div className={styles.successActions}>
            <button type="button" onClick={copyDraft} className="button button-outline">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Enquiry copied" : "Copy enquiry"}</button>
            {!whatsappUrl && <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="button button-primary"><Instagram size={16} /> Message on Instagram</a>}
          </div>
          <p className={styles.copyStatus} role="status">{copyError || (copied ? "Copied. You can now paste your enquiry into your conversation." : "No enquiry has been sent or stored online.")}</p>
          {references.length > 0 && <p className={styles.attachmentNote}>Your {references.length} reference {references.length === 1 ? "image stays" : "images stay"} on your device. Please attach {references.length === 1 ? "it" : "them"} separately in your conversation.</p>}
          <label className={styles.messageLabel} htmlFor="enquiry-message">YOUR ENQUIRY</label>
          <textarea id="enquiry-message" ref={messageRef} value={draft} readOnly className={styles.message} rows={12} />
          <button type="button" className={styles.editButton} onClick={() => { restoreEditFocus.current = true; setDraft(null); setCopied(false); }}>Back to edit your details <ArrowRight size={14} /></button>
        </motion.div> : <form onSubmit={handleSubmit((values) => { setCopied(false); setDraft(buildEnquiryMessage(values, references.map((file) => file.name))); })} noValidate>
          <div className={styles.formHeading}><span>LET’S MAKE SOMETHING LOVELY</span><small>* Required details</small></div>
          <EnquiryProgress control={control}/>
          <div className={styles.fields}>
            <div className={styles.field}><label htmlFor="cake-name">Your name <span>*</span></label><input id="cake-name" placeholder="A name to put to your lovely idea" autoComplete="name" maxLength={100} {...register("name")} {...accessibility("name")} />{fieldError("name")}</div>
            <div className={styles.field}><label htmlFor="cake-whatsapp">WhatsApp number <span>*</span></label><input id="cake-whatsapp" type="tel" placeholder="+91  Your mobile number" autoComplete="tel" maxLength={24} {...register("whatsapp")} {...accessibility("whatsapp")} />{fieldError("whatsapp")}</div>
            <div className={`${styles.field} ${styles.full}`}><label htmlFor="cake-email">Email address <small>(optional)</small></label><input id="cake-email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={254} {...register("email")} {...accessibility("email")} />{fieldError("email")}</div>
            <div className={styles.field}><label htmlFor="cake-occasion">What’s the occasion? <span>*</span></label><select id="cake-occasion" {...register("occasion")} {...accessibility("occasion")}><option value="">Choose your celebration</option>{occasions.map((occasion) => <option key={occasion} value={occasion}>{occasion}</option>)}</select>{fieldError("occasion")}</div>
            <div className={styles.field}><label htmlFor="cake-date">Delivery or pickup date <span>*</span></label><input id="cake-date" type="date" min={minimumDate || undefined} {...register("date")} {...accessibility("date")} />{fieldError("date")}</div>
            <div className={styles.field}><label htmlFor="cake-flavour">Preferred flavour <span>*</span></label><select id="cake-flavour" {...register("flavour")} {...accessibility("flavour")}><option value="">Something delicious</option>{flavours.map((flavour) => <option key={flavour} value={flavour}>{flavour}</option>)}</select>{fieldError("flavour")}</div>
            <div className={styles.field}><label htmlFor="cake-weight">Approximate cake weight <span>*</span></label><select id="cake-weight" {...register("weight")} {...accessibility("weight")}><option value="">Choose a size</option>{weights.map((weight) => <option key={weight} value={weight}>{weight}</option>)}</select>{fieldError("weight")}</div>
            <div className={`${styles.field} ${styles.full}`}><label htmlFor="cake-design">Tell us about your dream cake <span>*</span></label><textarea id="cake-design" rows={3} maxLength={2000} placeholder="A colour palette, a favourite character, a little story…" {...register("design")} {...accessibility("design")} />{fieldError("design")}</div>
            <div className={`${styles.field} ${styles.full}`}><label htmlFor="cake-references">A little inspiration <small>(optional)</small></label><div className={styles.upload}><Upload size={20} strokeWidth={1.4} /><div><strong>Add reference images</strong><span>Up to 3 images · JPG, PNG or WebP · 5 MB each</span></div><input id="cake-references" ref={uploadRef} type="file" accept="image/jpeg,image/png,image/webp" multiple aria-invalid={Boolean(uploadError)} aria-describedby={`reference-help${uploadError ? " reference-error" : ""}`} onChange={(event) => { addReferences(event.target.files); event.target.value = ""; }} /></div><span id="reference-help" className={styles.help}>Previewed on your device. Attach these separately when you message Neha.</span>{uploadError && <span id="reference-error" className={styles.error} role="alert">{uploadError}</span>}{references.length > 0 && <div className={styles.previews}><AnimatePresence initial={false}>{references.map((file, index) => <ReferencePreview key={`${file.name}-${file.lastModified}-${file.size}`} file={file} onRemove={() => { setReferences((current) => current.filter((_, itemIndex) => itemIndex !== index)); setUploadError(""); }} />)}</AnimatePresence></div>}</div>
            <div className={`${styles.field} ${styles.full}`}><label htmlFor="cake-instructions">Anything else we should know? <small>(optional)</small></label><textarea id="cake-instructions" rows={2} maxLength={2000} placeholder="Special requests, dietary questions, or finishing touches…" {...register("instructions")} {...accessibility("instructions")} />{fieldError("instructions")}</div>
          </div>
          <button type="submit" disabled={isSubmitting} className={`button button-primary ${styles.submit}`}>Create My Cake Enquiry <ArrowRight size={17} /></button>
          <p className={styles.privacy}>Your details are used to prepare your message. Nothing is sent until you choose to share it.</p>
        </form>}
      </div>
    </div>
  </section>;
}
