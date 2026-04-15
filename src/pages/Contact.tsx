import React, { useState, useMemo } from "react";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Mail,
  Phone,
  User,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SeoHead from "../components/SeoHead";
import { CONTACT_EMAIL, PHONE_NUMBER } from "../constants";
import { PageProps } from "../types";
import { encode } from "../utils/form";

type FormStatus = "idle" | "submitting" | "success" | "error";

const NAME_REGEX =
  /^[A-Za-zÀ-ÖØ-öø-ÿऀ-ॿঅ-ঌএ-ঐও-নপ-রলশ-হਅ-ਊਏ-ਐਓ-ਨਪ-ਲਵ-ਹઅ-ઍએ-ઐઓ-નપ-ળવ-હಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹఅ-ఌఎ-ఐఒ-నప-హഅ-ഌഎ-ഐഒ-നപ-ഹଅ-ଌଏ-ଐଓ-ନପ-ଳশ-ହ\s'.-]+$/;
const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com|live\.com|yahoo\.com|yahoo\.in|rediffmail\.com|rediff\.com|icloud\.com|me\.com|aol\.com|protonmail\.com|zoho\.com|yandex\.com|gmx\.com|mail\.com|inbox\.com|fastmail\.com|msn\.com|pm\.me|rocketmail\.com|btinternet\.com|comcast\.net|cox\.net|verizon\.net|att\.net|bellsouth\.net|earthlink\.net|optonline\.net|shaw\.ca|sympatico\.ca|qq\.com|126\.com|163\.com|sina\.com|kalpixa\.com)$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,15}$/;

type ThankYouWindow = Window & {
  __kalpixaThankYouAccess?: boolean;
  __kalpixaThankYouSubmissionId?: string;
};

const ContactPage: React.FC<PageProps> = ({ navigate }) => {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Website",
    message: "",
  });

  const wordCount = useMemo(() => {
    return formData.message
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  }, [formData.message]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "message") {
      const words = value
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      if (words.length > 1000) {
        const truncated = value.trim().split(/\s+/).slice(0, 1000).join(" ");
        setFormData({ ...formData, message: `${truncated} ` });
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 2) {
      if (wordCount === 0)
        newErrors.message = "Please tell us a bit about your project.";
      if (wordCount > 1000) newErrors.message = "Maximum 1000 words allowed.";
    }

    if (currentStep === 3) {
      if (!NAME_REGEX.test(formData.name.trim())) {
        newErrors.name =
          "Please enter a valid name (letters only, no numbers).";
      }
      if (!EMAIL_REGEX.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (
        formData.phone.trim() !== "" &&
        !PHONE_REGEX.test(formData.phone.trim())
      ) {
        newErrors.phone = "Please enter a valid phone number (min 7 digits).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setStatus("submitting");

    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      setTimeout(() => {
        setStatus("success");

        const submissionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        try {
          sessionStorage.setItem("formSubmitted", "true");
          sessionStorage.setItem("formSubmissionId", submissionId);
        } catch (error) {
          console.warn("Unable to persist form submission state:", error);
        }

        const thankYouWindow = window as ThankYouWindow;
        thankYouWindow.__kalpixaThankYouAccess = true;
        thankYouWindow.__kalpixaThankYouSubmissionId = submissionId;

        navigate("/thank-you", { justSubmitted: true, submissionId });
      }, 1500);
      return;
    }

    const payload: Record<string, string> = {
      ...formData,
      "form-name": "contact",
    };

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload),
      });

      if (!res.ok) throw new Error(`Form POST failed: ${res.status}`);

      setStatus("success");

      const submissionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      try {
        sessionStorage.setItem("formSubmitted", "true");
        sessionStorage.setItem("formSubmissionId", submissionId);
      } catch (error) {
        console.warn("Unable to persist form submission state:", error);
      }

      const thankYouWindow = window as ThankYouWindow;
      thankYouWindow.__kalpixaThankYouAccess = true;
      thankYouWindow.__kalpixaThankYouSubmissionId = submissionId;

      const w = window as any;
      if (typeof w.gtag === "function") {
        w.gtag("event", "generate_lead", { method: "Netlify Form Multi-step" });
      }

      setTimeout(
        () => navigate("/thank-you", { justSubmitted: true, submissionId }),
        1000,
      );
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };

  const getStepMinHeight = () => {
    if (step === 1) return "min-h-[220px] sm:min-h-[240px]";
    if (step === 2) return "min-h-[320px] sm:min-h-[340px]";
    return "min-h-[280px] sm:min-h-[300px]";
  };

  return (
    <div className="relative z-10 w-full py-14 sm:py-16 lg:py-20 flex flex-col items-center">
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 40px #0f172a inset !important;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <SeoHead
        title="Start Your Project"
        description="Get a custom quote."
        path="/contact"
      />

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[2.5rem] sm:text-[3.35rem] lg:text-[4.4rem] font-serif font-bold text-white mb-5 tracking-tight leading-[0.96]"
          >
            Let&apos;s Build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-500">
              Something Great
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-2xl mx-auto text-slate-400 text-[1.02rem] sm:text-[1.08rem] leading-7 sm:leading-8 mb-7"
          >
            Tell us what you need and we&apos;ll guide you toward the right
            solution.
          </motion.p>

          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 md:h-2 w-12 md:w-16 rounded-full transition-all duration-500 ${
                  step >= i
                    ? "bg-accent shadow-[0_0_10px_rgba(251,191,36,0.45)]"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 p-6 sm:p-8 md:p-9 lg:p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.45)] relative flex flex-col w-full max-w-3xl mx-auto mb-10 sm:mb-12">
          <form
            name="contact"
            data-netlify="true"
            netlify-honeypot="bot-field"
            hidden
          >
            <input type="text" name="name" />
            <input type="tel" name="phone" />
            <input type="email" name="email" />
            <select name="service">
              <option value="Website">Website</option>
            </select>
            <textarea name="message" />
          </form>

          <form
            onSubmit={handleSubmit}
            className="flex-grow flex flex-col relative w-full"
          >
            <input type="hidden" name="form-name" value="contact" />

            <div className={`relative w-full ${getStepMinHeight()}`}>
              <AnimatePresence custom={step} mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">
                      What do you need help with?
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                      {["Website", "SEO", "Ecommerce", "Other"].map((srv) => (
                        <div
                          key={srv}
                          onClick={() => {
                            setFormData({ ...formData, service: srv });
                            setTimeout(nextStep, 280);
                          }}
                          className={`p-5 md:p-6 rounded-[22px] border-2 cursor-pointer transition-all duration-300 flex items-center justify-between group ${
                            formData.service === srv
                              ? "bg-accent/10 border-accent text-accent shadow-[0_0_20px_rgba(251,191,36,0.14)]"
                              : "bg-black/20 border-white/5 text-slate-300 hover:border-white/20 hover:bg-black/40"
                          }`}
                        >
                          <span className="font-bold text-base md:text-lg">
                            {srv}
                          </span>
                          <div
                            className={`transition-transform duration-300 ${
                              formData.service === srv
                                ? "scale-110"
                                : "group-hover:scale-110 opacity-50"
                            }`}
                          >
                            <CheckCircle size={24} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full flex flex-col"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                      Tell us a bit about the project.
                    </h3>

                    <div className="relative flex-grow">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="What are your goals? Do you have a timeline in mind?"
                        rows={7}
                        className={`w-full p-5 md:p-6 rounded-[22px] bg-[#0f172a]/80 border text-white placeholder-slate-500 outline-none backdrop-blur-sm transition-all resize-none text-base md:text-lg ${
                          errors.message
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-white/10 focus:border-accent focus:ring-1 focus:ring-accent"
                        }`}
                        required
                      />
                      <div
                        className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
                          wordCount > 950
                            ? "bg-red-500/20 text-red-400"
                            : "bg-black/40 text-slate-400"
                        }`}
                      >
                        {wordCount} / 1000 words
                      </div>
                    </div>

                    {errors.message && (
                      <p className="text-red-400 text-sm mt-3">
                        {errors.message}
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] transition-all"
                      >
                        <ArrowLeft size={18} />
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-primary font-bold hover:brightness-105 transition-all shadow-[0_10px_25px_rgba(251,191,36,0.18)]"
                      >
                        Continue
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
                      Your Contact Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <div className="relative">
                          <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                          />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your Name"
                            className={`w-full pl-11 pr-4 py-4 rounded-[18px] bg-[#0f172a]/80 border text-white placeholder-slate-500 outline-none transition-all ${
                              errors.name
                                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-white/10 focus:border-accent focus:ring-1 focus:ring-accent"
                            }`}
                            required
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-400 text-sm mt-2">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="relative">
                          <Phone
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                          />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone Number (Optional)"
                            className={`w-full pl-11 pr-4 py-4 rounded-[18px] bg-[#0f172a]/80 border text-white placeholder-slate-500 outline-none transition-all ${
                              errors.phone
                                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-white/10 focus:border-accent focus:ring-1 focus:ring-accent"
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-400 text-sm mt-2">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <div className="relative">
                          <Mail
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email Address"
                            className={`w-full pl-11 pr-4 py-4 rounded-[18px] bg-[#0f172a]/80 border text-white placeholder-slate-500 outline-none transition-all ${
                              errors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-white/10 focus:border-accent focus:ring-1 focus:ring-accent"
                            }`}
                            required
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-400 text-sm mt-2">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] transition-all"
                      >
                        <ArrowLeft size={18} />
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-accent text-primary font-bold hover:brightness-105 transition-all shadow-[0_10px_25px_rgba(251,191,36,0.18)] disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {status === "submitting" ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Launching...
                          </>
                        ) : (
                          <>
                            Launch Project
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </div>

                    {status === "error" && (
                      <div className="mt-5 flex items-start gap-3 rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <div>
                          Something went wrong while submitting your request.
                          Please try again.
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        <div className="text-center text-slate-400 text-sm sm:text-base">
          Prefer to email directly? Reach us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent hover:underline"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          or call{" "}
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="text-accent hover:underline"
          >
            {PHONE_NUMBER}
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
