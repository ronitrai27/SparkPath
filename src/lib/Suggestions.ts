// lib/suggestions.ts

const suggestionMap: Record<string, string[]> = {
  "Software Engineer": [
    "Build and deploy a full-stack SaaS app",
    "Master system design for scalable backend",
    "Deep dive into TypeScript and advanced patterns",
    "Learn testing and CI/CD with Jest and GitHub Actions",
    "Create a custom authentication system with JWT and OAuth",
  ],
  "Designer": [
    "Design a complete mobile app UI/UX in Figma",
    "Create a brand identity kit with logo and mockups",
    "Learn advanced UI animations and transitions",
    "Build a design system using tokens and components",
    "Redesign a real-world product with a case study",
  ],
  "Product Manager": [
    "Build a product roadmap from scratch",
    "Write a complete PRD with use cases",
    "Conduct user research and define personas",
    "Prioritize features using frameworks like RICE",
    "Analyze a failed product and create improvement plan",
  ],
  "Other": [
    "Pick a trending tech topic and learn it from scratch",
    "Document your learning on a blog or LinkedIn",
    "Build a personal knowledge base with Notion",
    "Choose a productivity system and apply it",
    "Create your digital portfolio or profile site",
  ],
};

// Stable seeded shuffle using a numeric seed
function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    seed = (seed * 9301 + 49297) % 233280;
  }
  return shuffled;
}

// Generate numeric seed based on occupation + today's date
function getSeed(key: string): number {
  const today = new Date().toISOString().split("T")[0]; // e.g., "2025-07-05"
  const combined = key + today;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Ensure 32bit integer
  }
  return Math.abs(hash);
}

export function getOccupationSuggestions(occupation: string): string[] {
  const suggestions = suggestionMap[occupation] || suggestionMap["Other"];
  const seed = getSeed(occupation);
  const shuffled = seededShuffle(suggestions, seed);
  return shuffled.slice(0, 5);
}
