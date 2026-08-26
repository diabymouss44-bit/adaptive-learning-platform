import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate une date en format lisible
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calcule le pourcentage de progression
 */
export function calculateProgress(completed: number, total: number): number {
  return Math.round((completed / total) * 100);
}

/**
 * Détermine le niveau de difficulté suivant
 */
export function getNextDifficulty(
  currentDifficulty: string,
  performanceScore: number
): string {
  const difficultyLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
  const currentIndex = difficultyLevels.indexOf(currentDifficulty);

  if (performanceScore >= 85 && currentIndex < difficultyLevels.length - 1) {
    return difficultyLevels[currentIndex + 1];
  }

  if (performanceScore < 60 && currentIndex > 0) {
    return difficultyLevels[currentIndex - 1];
  }

  return currentDifficulty;
}

/**
 * Calcule l'XP gagné
 */
export function calculateXP(
  difficulty: string,
  isCorrect: boolean,
  timeSpent: number
): number {
  const difficultyMultiplier: Record<string, number> = {
    BEGINNER: 10,
    INTERMEDIATE: 25,
    ADVANCED: 50,
    EXPERT: 100,
  };

  const baseXP = difficultyMultiplier[difficulty] || 0;
  const correctBonus = isCorrect ? baseXP * 0.5 : 0;
  const timeBonus = timeSpent < 300 ? baseXP * 0.25 : 0;

  return Math.round(baseXP + correctBonus + timeBonus);
}

/**
 * Génère un parcours d'apprentissage adaptatif
 */
export function generateAdaptivePath(
  userMetrics: {
    averageScore: number;
    strongTopics: string[];
    weakTopics: string[];
    learningPace: string;
  }
): string[] {
  const path: string[] = [];

  // Commence par les points faibles
  if (userMetrics.weakTopics.length > 0) {
    path.push(...userMetrics.weakTopics);
  }

  // Puis consolide les points forts
  if (userMetrics.strongTopics.length > 0) {
    path.push(...userMetrics.strongTopics);
  }

  return path;
}

/**
 * Formate une durée en minutes/heures
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}
