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
  // ... add other occupations here (from previous list)
  "Other": [
    "Pick a trending tech topic and learn it from scratch",
    "Document your learning on a blog or LinkedIn",
    "Build a personal knowledge base with Notion",
    "Choose a productivity system and apply it",
    "Create your digital portfolio or profile site",
  ],
};

export function getOccupationSuggestions(occupation: string): string[] {
  const suggestions = suggestionMap[occupation] || suggestionMap["Other"];
  const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
}
