import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "dark" | "light" | "system";

export type AISettings = {
  defaultModel: string;
  routingStrategy: string;
  apiKey: string;
  temperature: number;
  topP: number;
  freqPenalty: number;
  maxTokens: number;
  enabledModels: Record<string, boolean>;
};

export type NotificationSettings = {
  wecomWebhook: string;
  types: Record<string, boolean>;
};

export type SecuritySettings = {
  piiDetection: boolean;
  piiStrictness: string;
  injectionDetection: boolean;
  injectionMode: string;
  contentModeration: boolean;
  dataRetentionDays: number;
};

export type AppearanceSettings = {
  themeMode: ThemeMode;
  primaryColor: string;
  fontSize: string;
  compactMode: boolean;
  animations: boolean;
};

export type SLOSettings = {
  errorRateThreshold: number;
  p99LatencyThreshold: number;
  availabilityThreshold: number;
};

export type SettingsState = {
  ai: AISettings;
  notification: NotificationSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
  slo: SLOSettings;
  setAI: (partial: Partial<AISettings>) => void;
  setNotification: (partial: Partial<NotificationSettings>) => void;
  setSecurity: (partial: Partial<SecuritySettings>) => void;
  setAppearance: (partial: Partial<AppearanceSettings>) => void;
  setSLO: (partial: Partial<SLOSettings>) => void;
};

const DEFAULT_AI: AISettings = {
  defaultModel: "claude-sonnet-4.5",
  routingStrategy: "quality",
  apiKey: "",
  temperature: 0.7,
  topP: 0.9,
  freqPenalty: 0,
  maxTokens: 4096,
  enabledModels: {
    "claude-sonnet-4.5": true,
    "gpt-5": true,
    "gemini-2.5-pro": false,
    "minimax-m3": true,
  },
};

const DEFAULT_NOTIFICATION: NotificationSettings = {
  wecomWebhook: "",
  types: {
    safety: true,
    daily: true,
    anomaly: true,
    ticket: false,
    crisis: true,
    release: true,
  },
};

const DEFAULT_SECURITY: SecuritySettings = {
  piiDetection: true,
  piiStrictness: "standard",
  injectionDetection: true,
  injectionMode: "hybrid",
  contentModeration: true,
  dataRetentionDays: 90,
};

const DEFAULT_APPEARANCE: AppearanceSettings = {
  themeMode: "dark",
  primaryColor: "purple",
  fontSize: "standard",
  compactMode: false,
  animations: true,
};

const DEFAULT_SLO: SLOSettings = {
  errorRateThreshold: 1.0,
  p99LatencyThreshold: 2000,
  availabilityThreshold: 99.5,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ai: DEFAULT_AI,
      notification: DEFAULT_NOTIFICATION,
      security: DEFAULT_SECURITY,
      appearance: DEFAULT_APPEARANCE,
      slo: DEFAULT_SLO,
      setAI: (partial) => set((s) => ({ ai: { ...s.ai, ...partial } })),
      setNotification: (partial) =>
        set((s) => ({ notification: { ...s.notification, ...partial } })),
      setSecurity: (partial) =>
        set((s) => ({ security: { ...s.security, ...partial } })),
      setAppearance: (partial) =>
        set((s) => ({ appearance: { ...s.appearance, ...partial } })),
      setSLO: (partial) => set((s) => ({ slo: { ...s.slo, ...partial } })),
    }),
    {
      name: "ai-workbench-settings",
      version: 1,
    },
  ),
);
