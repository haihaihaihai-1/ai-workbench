import {
  cardHover,
  easeOut,
  fadeIn,
  fadeInDown,
  fadeInUp,
  listItem,
  messageEnter,
  pageVariants,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
} from "@/lib/motion-presets";
import { describe, expect, it } from "vitest";

describe("motion presets — 基础结构", () => {
  it("easeOut 是 4 元 cubic bezier", () => {
    expect(Array.isArray(easeOut)).toBe(true);
    expect(easeOut).toHaveLength(4);
  });

  it("每个预设都包含 initial / animate / transition", () => {
    for (const preset of [
      fadeIn,
      fadeInUp,
      fadeInDown,
      scaleIn,
      slideInRight,
      slideInLeft,
      messageEnter,
    ]) {
      expect(preset).toHaveProperty("initial");
      expect(preset).toHaveProperty("animate");
      expect(preset).toHaveProperty("transition");
    }
  });

  it("cardHover 包含 whileHover + transition", () => {
    expect(cardHover).toHaveProperty("whileHover");
    expect(cardHover).toHaveProperty("transition");
  });

  it("fadeIn: 仅透明度变化", () => {
    expect(fadeIn.initial).toEqual({ opacity: 0 });
    expect(fadeIn.animate).toEqual({ opacity: 1 });
  });

  it("fadeInUp: 透明度 + y 位移", () => {
    expect(fadeInUp.initial).toEqual({ opacity: 0, y: 8 });
    expect(fadeInUp.animate).toEqual({ opacity: 1, y: 0 });
  });

  it("scaleIn: 缩放进入", () => {
    expect(scaleIn.initial).toEqual({ opacity: 0, scale: 0.95 });
    expect(scaleIn.animate).toEqual({ opacity: 1, scale: 1 });
  });

  it("transition 字段含 duration + ease", () => {
    expect(fadeIn.transition).toHaveProperty("duration");
    expect(fadeIn.transition).toHaveProperty("ease");
    expect(fadeIn.transition.duration).toBe(0.2);
  });
});

describe("motion presets — 函数式", () => {
  it("listItem(0) 默认结构正确", () => {
    const item = listItem(0);
    expect(item.initial).toEqual({ opacity: 0, y: 4 });
    expect(item.transition.delay).toBe(0);
  });

  it("listItem(0.2) 接受自定义 delay", () => {
    const item = listItem(0.2);
    expect(item.transition.delay).toBe(0.2);
  });

  it("staggerContainer 返回 Variants", () => {
    const v = staggerContainer(0.1);
    expect(v).toHaveProperty("animate");
    expect(v).toHaveProperty("initial");
    const animateTransition = (v as { animate: { transition: { staggerChildren: number } } })
      .animate.transition;
    expect(animateTransition.staggerChildren).toBe(0.1);
  });

  it("pageVariants 含 initial/animate/exit", () => {
    expect(pageVariants).toHaveProperty("initial");
    expect(pageVariants).toHaveProperty("animate");
    expect(pageVariants).toHaveProperty("exit");
  });
});
