import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import SeoHead from "../components/SeoHead";
import { PageProps } from "../types";
import { CONTACT_EMAIL } from "../constants";

type ThankYouWindow = Window & {
  __kalpixaThankYouAccess?: boolean;
  __kalpixaThankYouSubmissionId?: string;
};

type ThankYouHistoryState = {
  justSubmitted?: boolean;
  submissionId?: string;
};

const ThankYouPage: React.FC<PageProps> = ({ navigate }) => {
  useEffect(() => {
    const thankYouWindow = window as ThankYouWindow;
    const historyState = (window.history.state ?? {}) as ThankYouHistoryState;

    let storedSubmissionFlag = false;
    let storedSubmissionId: string | null = null;

    try {
      storedSubmissionFlag = sessionStorage.getItem("formSubmitted") === "true";
      storedSubmissionId = sessionStorage.getItem("formSubmissionId");
    } catch (error) {
      console.warn("Unable to read form submission state:", error);
    }

    const hasInMemoryAccess = thankYouWindow.__kalpixaThankYouAccess === true;
    const hasMatchingSubmissionId = Boolean(
      historyState.submissionId &&
        storedSubmissionId &&
        historyState.submissionId === storedSubmissionId,
    );
    const hasFreshSubmissionState = Boolean(
      historyState.justSubmitted &&
        storedSubmissionFlag &&
        hasMatchingSubmissionId,
    );

    if (!hasInMemoryAccess && !hasFreshSubmissionState) {
      navigate("/contact");
      return;
    }

    const clearThankYouAccess = () => {
      thankYouWindow.__kalpixaThankYouAccess = false;
      thankYouWindow.__kalpixaThankYouSubmissionId = undefined;

      try {
        sessionStorage.removeItem("formSubmitted");
        sessionStorage.removeItem("formSubmissionId");
      } catch (error) {
        console.warn("Unable to clear form submission state:", error);
      }

      try {
        const currentState = (window.history.state ?? {}) as ThankYouHistoryState;
        if (currentState.justSubmitted || currentState.submissionId) {
          window.history.replaceState({}, "", "/thank-you");
        }
      } catch (error) {
        console.warn("Unable to clear thank you page history state:", error);
      }
    };

    const handleBeforeUnload = () => {
      clearThankYouAccess();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const cleanupTimer = window.setTimeout(() => {
      clearThankYouAccess();
    }, 0);

    return () => {
      window.clearTimeout(cleanupTimer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  return (
    <div className="min-h-[78vh] flex items-center justify-center relative z-10 py-16 sm:py-20 px-4">
      <SeoHead
        title="Project Brief Secured"
        description="Thank you for contacting Kalpixa Web Studio. We are reviewing your requirements."
        path="/thank-you"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, type: "spring", stiffness: 180, damping: 20 }}
        className="max-w-2xl w-full rounded-[32px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl p-8 sm:p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.45)] text-center relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[90px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        <div className="flex justify-center mb-8 relative z-10">
          <div className="w-24 h-24 rounded-full border border-green-500/20 bg-green-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.18)]">
            <motion.svg
              className="w-12 h-12 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
              />
            </motion.svg>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[2.3rem] sm:text-[3rem] md:text-[3.6rem] font-serif font-bold text-white tracking-tight leading-[0.97] relative z-10"
        >
          Brief <span className="text-green-400">Secured.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-5 text-[1.02rem] sm:text-[1.08rem] text-slate-400 leading-7 sm:leading-8 max-w-xl mx-auto relative z-10"
        >
          Your project details have been successfully transmitted to our
          engineering team. We are analyzing your requirements and will reach
          out to you via email within{" "}
          <strong className="text-white font-semibold">24 hours</strong>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62 }}
          className="mt-8 rounded-[24px] border border-white/10 bg-black/15 px-5 py-5 sm:px-6 sm:py-6 text-left relative z-10"
        >
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
            What Happens Next
          </div>

          <div className="mt-4 space-y-3 text-sm sm:text-[0.98rem] text-slate-300">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent shrink-0" />
              <span>We review your project brief and requirements in detail.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent shrink-0" />
              <span>We prepare the best next-step recommendation for your business.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent shrink-0" />
              <span>You receive a direct follow-up from our team by email.</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10"
        >
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-8 py-3.5 font-bold text-white hover:bg-white/[0.14] transition-all"
          >
            <Home size={18} />
            Return to Home
          </button>

          <button
            onClick={() => navigate("/services")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 font-bold text-primary hover:bg-amber-400 transition-all shadow-[0_0_18px_rgba(251,191,36,0.25)] hover:shadow-[0_0_28px_rgba(251,191,36,0.38)]"
          >
            Explore Services
            <ArrowRight size={18} />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.92 }}
          className="mt-10 text-sm text-slate-500 relative z-10"
        >
          Need immediate assistance? Contact us directly at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent hover:underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
