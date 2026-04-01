import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BadgeCheck } from 'lucide-react';

interface PurchaseRequestFormProps {
  className?: string;
}

type PurchaseField = 'name' | 'email' | 'phone';

interface PurchaseFormValues {
  name: string;
  email: string;
  phone: string;
}

type FieldErrors = Partial<Record<PurchaseField, string>>;
type TouchedFields = Record<PurchaseField, boolean>;
type SubmitState = 'idle' | 'success';

const INITIAL_VALUES: PurchaseFormValues = {
  name: '',
  email: '',
  phone: '',
};

const INITIAL_TOUCHED: TouchedFields = {
  name: false,
  email: false,
  phone: false,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_CHARS_REGEX = /^[+()\-\s\d]+$/;
const MIN_PHONE_DIGITS = 8;

function getPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

function validatePurchaseForm(values: PurchaseFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }

  if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const phoneValue = values.phone.trim();
  if (!phoneValue) {
    errors.phone = 'Please enter your phone number.';
  } else if (!PHONE_ALLOWED_CHARS_REGEX.test(phoneValue)) {
    errors.phone = 'Phone supports digits, spaces, parentheses, + and -.';
  } else if (getPhoneDigits(phoneValue).length < MIN_PHONE_DIGITS) {
    errors.phone = 'Phone number looks too short.';
  }

  return errors;
}

const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({ className = '' }) => {
  const [values, setValues] = useState<PurchaseFormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<TouchedFields>(INITIAL_TOUCHED);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const errors = useMemo(() => validatePurchaseForm(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  const setFieldValue = (field: PurchaseField, nextValue: string) => {
    setValues((prev) => ({ ...prev, [field]: nextValue }));
    if (submitState !== 'idle') {
      setSubmitState('idle');
    }
  };

  const setFieldTouched = (field: PurchaseField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const markAllTouched = () => {
    setTouched({
      name: true,
      email: true,
      phone: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markAllTouched();

    if (hasErrors) {
      return;
    }

    setSubmitState('success');
    setValues(INITIAL_VALUES);
    setTouched(INITIAL_TOUCHED);
  };

  const hasVisibleError = (field: PurchaseField) => touched[field] && Boolean(errors[field]);

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <div className="float-card rounded-3xl p-6 md:p-8 border border-warm-300/80 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white via-warm-50/40 to-sage-50/50" />
        <div className="relative">
          <span className="pill bg-warm-100 text-ink-500 border border-warm-300 text-[11px]">
            Purchase Request
          </span>
          <h4 className="font-display text-2xl md:text-[2rem] text-ink-900 mt-4 leading-tight">
            Request a custom purchase plan
          </h4>
          <p className="text-sm md:text-base text-ink-400 mt-2 leading-relaxed">
            Share your details and our team will contact you with the best plan for your workflow volume.
          </p>

          <form className="mt-6" noValidate onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="purchase-name" className="text-xs font-medium tracking-wide text-ink-500 uppercase">
                  Name
                </label>
                <input
                  id="purchase-name"
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  onBlur={() => setFieldTouched('name')}
                  placeholder="Jane Doe"
                  aria-invalid={hasVisibleError('name')}
                  aria-describedby={hasVisibleError('name') ? 'purchase-name-error' : undefined}
                  className={`mt-2 w-full rounded-xl border bg-white/90 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 transition-all focus:outline-none focus:ring-4 focus:ring-sage-100 ${
                    hasVisibleError('name') ? 'border-red-300 focus:ring-red-50' : 'border-ink-200 focus:border-sage-300'
                  }`}
                />
                <AnimatePresence mode="wait">
                  {hasVisibleError('name') && (
                    <motion.p
                      id="purchase-name-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-1.5 text-xs text-red-500"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label htmlFor="purchase-email" className="text-xs font-medium tracking-wide text-ink-500 uppercase">
                  Email
                </label>
                <input
                  id="purchase-email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={values.email}
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  onBlur={() => setFieldTouched('email')}
                  placeholder="you@company.com"
                  aria-invalid={hasVisibleError('email')}
                  aria-describedby={hasVisibleError('email') ? 'purchase-email-error' : undefined}
                  className={`mt-2 w-full rounded-xl border bg-white/90 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 transition-all focus:outline-none focus:ring-4 focus:ring-sage-100 ${
                    hasVisibleError('email') ? 'border-red-300 focus:ring-red-50' : 'border-ink-200 focus:border-sage-300'
                  }`}
                />
                <AnimatePresence mode="wait">
                  {hasVisibleError('email') && (
                    <motion.p
                      id="purchase-email-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-1.5 text-xs text-red-500"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="purchase-phone" className="text-xs font-medium tracking-wide text-ink-500 uppercase">
                  Phone
                </label>
                <input
                  id="purchase-phone"
                  name="phone"
                  autoComplete="tel"
                  type="tel"
                  value={values.phone}
                  onChange={(e) => setFieldValue('phone', e.target.value)}
                  onBlur={() => setFieldTouched('phone')}
                  placeholder="+1 (555) 123-4567"
                  aria-invalid={hasVisibleError('phone')}
                  aria-describedby={hasVisibleError('phone') ? 'purchase-phone-error' : undefined}
                  className={`mt-2 w-full rounded-xl border bg-white/90 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 transition-all focus:outline-none focus:ring-4 focus:ring-sage-100 ${
                    hasVisibleError('phone') ? 'border-red-300 focus:ring-red-50' : 'border-ink-200 focus:border-sage-300'
                  }`}
                />
                <AnimatePresence mode="wait">
                  {hasVisibleError('phone') && (
                    <motion.p
                      id="purchase-phone-error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-1.5 text-xs text-red-500"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-ink-400">
                This is a UI-only request. Submission is not sent to an external server yet.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-ink-900/10 hover:bg-ink-800 transition-colors"
              >
                Request Purchase
                <ArrowRight size={15} />
              </motion.button>
            </div>

            <div className="mt-4 min-h-[2rem]" aria-live="polite">
              <AnimatePresence mode="wait">
                {submitState === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-sage-50 px-3 py-1.5 text-xs font-medium text-sage-700"
                    role="status"
                  >
                    <BadgeCheck size={14} />
                    We received your request and will contact you soon.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestForm;
