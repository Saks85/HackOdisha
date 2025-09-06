import { Variants, Transition } from "framer-motion";

export const ease: Transition["ease"] = [0.25, 0.1, 0.25, 1];

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease } },
};

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.25, ease } },
  whileTap: { scale: 0.98 },
};

export const parallaxTilt = {
  initial: { rotateX: 0, rotateY: 0 },
};
