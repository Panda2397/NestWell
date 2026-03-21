import { UserType } from "../types/user";

export type Question = {
  id: number;
  text: string;
  type: UserType;
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "I feel mentally overwhelmed by parenting responsibilities.",
    type: "anxiety",
  },
  {
    id: 2,
    text: "I worry a lot that I am not doing things correctly.",
    type: "anxiety",
  },
  {
    id: 3,
    text: "I often feel emotionally drained or down.",
    type: "lowMood",
  },
  {
    id: 4,
    text: "It is hard for me to feel hopeful or encouraged lately.",
    type: "lowMood",
  },
  {
    id: 5,
    text: "I feel alone in this journey, even when others are around.",
    type: "isolation",
  },
  {
    id: 6,
    text: "I wish I had more people who truly understand what I’m feeling.",
    type: "isolation",
  },
];

export const OPTIONS = [
  { label: "Not at all", value: 1, emoji: "🌱" },
  { label: "A little", value: 2, emoji: "🙂" },
  { label: "Sometimes", value: 3, emoji: "😐" },
  { label: "Often", value: 4, emoji: "😟" },
  { label: "Very much", value: 5, emoji: "😣" },
];

export const RESULT_COPY: Record<
  UserType,
  {
    title: string;
    subtitle: string;
    color: string;
    bg: string;
    emoji: string;
  }
> = {
  anxiety: {
    title: "Feeling Overwhelmed",
    subtitle:
      "You may currently benefit most from calming, grounding, and reassurance-based support.",
    color: "#6D5EF9",
    bg: "#EEEAFE",
    emoji: "🌿",
  },
  lowMood: {
    title: "Feeling Emotionally Drained",
    subtitle:
      "You may currently benefit most from gentle encouragement, reflection, and emotional support.",
    color: "#F97316",
    bg: "#FFF1E8",
    emoji: "☀️",
  },
  isolation: {
    title: "Feeling Alone",
    subtitle:
      "You may currently benefit most from connection, comfort, and support-oriented resources.",
    color: "#14B8A6",
    bg: "#E8FBF8",
    emoji: "🤝",
  },
  stable: {
    title: "Feeling Balanced",
    subtitle:
        "You seem to be in a relatively stable emotional state right now. That’s great — keep taking care of yourself, and we’ll be here whenever you need support.",
    color: "#22C55E",
    bg: "#ECFDF5",
    emoji: "🌿",
    },
    highRisk: {
    title: "You May Need Extra Support",
    subtitle:
      "It looks like you're experiencing multiple sources of emotional strain. You don’t have to go through this alone — consider reaching out or exploring support options available to you.",
    color: "#EF4444",
    bg: "#FEF2F2",
    emoji: "❤️",
    },
    
};