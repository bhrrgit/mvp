
import React from 'react';
import { Instagram, Send, Database, MessageSquare, Layout, Bell, Share2, Mail, Webhook, CreditCard } from 'lucide-react';

export const GLOBAL_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 28,
  mass: 0.9,
};

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const SUGGESTIONS = [
  "Capture Instagram leads",
  "Sync CRM with Sheets",
  "Email follow-up automation",
  "Slack payment alerts"
];

export const PREBUILT_FLOWS = [
  {
    title: "Instagram to Notion",
    description: "Auto-capture social leads into your workspace database",
    icon: <Instagram size={20} className="text-pink-500" />,
    category: "Social",
    accent: "bg-pink-50 border-pink-100"
  },
  {
    title: "Webhook to Slack",
    description: "Instant team notifications when custom events fire",
    icon: <Webhook size={20} className="text-sage-500" />,
    category: "Messaging",
    accent: "bg-sage-50 border-sage-100"
  },
  {
    title: "Chatbot to Sheets",
    description: "Collect and store conversations automatically",
    icon: <MessageSquare size={20} className="text-lavender-500" />,
    category: "Data",
    accent: "bg-lavender-50 border-lavender-100"
  },
  {
    title: "Email to HubSpot",
    description: "Parse incoming inquiries into CRM contacts",
    icon: <Mail size={20} className="text-amber-600" />,
    category: "CRM",
    accent: "bg-amber-50 border-amber-100"
  },
  {
    title: "Stripe to Discord",
    description: "Celebrate new sales with the whole team",
    icon: <CreditCard size={20} className="text-indigo-500" />,
    category: "Payments",
    accent: "bg-indigo-50 border-indigo-100"
  }
];

export const getIcon = (name: string) => {
  const icons: Record<string, any> = {
    Instagram, Send, Database, MessageSquare, Layout, Bell, Share2, Mail, Webhook, CreditCard,
    Slack: MessageSquare,
    Sheets: Database,
    HubSpot: Layout,
    Notion: Database
  };
  const IconComponent = icons[name] || Layout;
  return <IconComponent size={18} />;
};
