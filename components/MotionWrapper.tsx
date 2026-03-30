
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { GLOBAL_SPRING, EASE_OUT_EXPO } from '../constants';

// Soft fade-in with subtle upward movement
export const SoftReveal: React.FC<HTMLMotionProps<"div"> & { delay?: number }> = ({
  children,
  delay = 0,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.7,
      delay,
      ease: EASE_OUT_EXPO,
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger container
export const StaggerContainer: React.FC<HTMLMotionProps<"div">> = ({
  children,
  ...props
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-40px" }}
    variants={{
      visible: {
        transition: {
          staggerChildren: 0.08,
          delayChildren: 0.1,
        }
      }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger item
export const StaggerItem: React.FC<HTMLMotionProps<"div">> = ({
  children,
  ...props
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE_OUT_EXPO }
      }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Interactive hover button (subtle)
export const InteractiveButton: React.FC<HTMLMotionProps<"button">> = ({
  children,
  ...props
}) => (
  <motion.button
    whileHover={{ scale: 1.015 }}
    whileTap={{ scale: 0.975 }}
    transition={GLOBAL_SPRING}
    {...props}
  >
    {children}
  </motion.button>
);

// Fade-in on scroll
export const FadeIn: React.FC<HTMLMotionProps<"div"> & { delay?: number }> = ({
  children,
  delay = 0,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
    {...props}
  >
    {children}
  </motion.div>
);
