
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { SoftReveal, StaggerContainer, StaggerItem } from '../components/MotionWrapper';

const plans = [
  {
    name: 'Trial',
    price: 'Free',
    period: '',
    description: 'Try MarketerAI with 3 free workflow generations.',
    features: [
      '3 workflow generations',
      'JSON export',
      'Basic n8n templates',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
    accent: 'bg-warm-100 border-warm-300 text-ink-600',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'Unlimited workflows for growing teams and agencies.',
    features: [
      'Unlimited generations',
      'Priority AI model',
      'Advanced n8n nodes',
      'Workflow history & versioning',
      'Email support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
    accent: 'bg-ink-900 text-white',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations.',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated account manager',
      'SSO & team management',
      'SLA & priority support',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
    highlighted: false,
    accent: 'bg-warm-100 border-warm-300 text-ink-600',
  }
];

const PricingPage: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-24">
      {/* Header */}
      <SoftReveal className="text-center mb-16">
        <span className="pill bg-lavender-50 text-lavender-500 border border-lavender-200 text-xs mb-6 inline-flex">
          <Sparkles size={12} />
          Simple pricing
        </span>
        <h1 className="font-display text-4xl md:text-6xl text-ink-900 mb-4 leading-tight">
          Plans that <span className="text-sage-500 italic">scale with you</span>
        </h1>
        <p className="text-lg text-ink-400 max-w-xl mx-auto font-light">
          Start free, upgrade when you're ready. No hidden fees, cancel anytime.
        </p>
      </SoftReveal>

      {/* Pricing Cards */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {plans.map((plan, i) => (
          <StaggerItem key={plan.name}>
            <div className={`rounded-2xl p-8 h-full ${
              plan.highlighted
                ? 'float-card ring-2 ring-ink-900/10 relative'
                : 'elevated-card'
            }`}>
              {plan.highlighted && (
                <span className="absolute -top-3 left-8 pill bg-sage-500 text-white text-xs font-medium">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-ink-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-ink-400 mb-6">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display text-4xl text-ink-900">{plan.price}</span>
                {plan.period && <span className="text-sm text-ink-400">{plan.period}</span>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                  plan.highlighted
                    ? 'bg-ink-900 text-white shadow-lg shadow-ink-900/10'
                    : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                }`}
              >
                {plan.cta}
                <ArrowRight size={14} />
              </motion.button>

              <div className="divider my-6" />

              <ul className="space-y-3">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-3 text-sm text-ink-500">
                    <Check size={16} className="text-sage-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* FAQ teaser */}
      <SoftReveal delay={0.3} className="text-center mt-20">
        <p className="text-sm text-ink-400">
          Questions? Check our <a href="#/docs" className="text-sage-600 font-medium underline underline-offset-2 hover:text-sage-700 transition-colors">documentation</a> or{' '}
          <a href="mailto:hello@marketerai.com" className="text-sage-600 font-medium underline underline-offset-2 hover:text-sage-700 transition-colors">contact us</a>.
        </p>
      </SoftReveal>
    </div>
  );
};

export default PricingPage;
