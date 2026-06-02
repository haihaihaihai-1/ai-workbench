// 统一的动效预设 — 供全站复用的 motion 配置对象
// 用法：<motion.div initial={fadeIn.initial} animate={fadeIn.animate} transition={fadeIn.transition} />

import type { Transition, Variants } from "motion/react";

export const easeOut: Transition["ease"] = [0.16, 1, 0.3, 1];

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: easeOut },
} as const;

export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: easeOut },
} as const;

export const fadeInDown = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: easeOut },
} as const;

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: easeOut },
} as const;

export const slideInRight = {
  initial: { x: 16, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.2, ease: easeOut },
} as const;

export const slideInLeft = {
  initial: { x: -16, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.2, ease: easeOut },
} as const;

// 消息入场（柔和）
export const messageEnter = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: easeOut },
} as const;

// 列表项入场（带 delay）
export const listItem = (
  delay = 0,
): {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number };
  transition: { duration: number; ease: Transition["ease"]; delay: number };
} => ({
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: easeOut, delay },
});

// 卡片悬停
export const cardHover = {
  whileHover: { y: -2 },
  transition: { duration: 0.15, ease: easeOut },
} as const;

// 页面切换 variants（配合 AnimatePresence）
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeOut } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: easeOut } },
};

// 父级 stagger 容器
export const staggerContainer = (delay = 0.04): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: delay,
      delayChildren: 0.05,
    },
  },
});
