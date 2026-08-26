import { prisma } from "@/lib/prisma";
import { Difficulty } from "@prisma/client";
import { calculateXP, getNextDifficulty } from "@/lib/utils";

/**
 * Service d'apprentissage adaptatif
 * Responsable de l'ajustement du parcours d'apprentissage basé sur les performances
 */

interface UserPerformance {
  userId: string;
  exerciseId: string;
  isCorrect: boolean;
  score: number;
  timeSpent: number;
}

export async function processUserAnswer(
  performance: UserPerformance
): Promise<void> {
  const { userId, exerciseId, isCorrect, score, timeSpent } = performance;

  // Récupère l'exercice pour connaître la difficulté
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise) throw new Error("Exercise not found");

  // Calcule l'XP gagné
  const xpEarned = calculateXP(
    exercise.difficulty,
    isCorrect,
    timeSpent
  );

  // Met à jour l'utilisateur
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalXP: {
        increment: xpEarned,
      },
    },
  });

  // Met à jour les métriques d'apprentissage adaptatif
  await updateAdaptiveMetrics(userId, isCorrect, score, exercise.difficulty);
}

/**
 * Met à jour les métriques d'apprentissage adaptatif
 */
async function updateAdaptiveMetrics(
  userId: string,
  isCorrect: boolean,
  score: number,
  difficulty: Difficulty
): Promise<void> {
  const metrics = await prisma.adaptiveMetrics.findUnique({
    where: { userId },
  });

  if (!metrics) {
    await prisma.adaptiveMetrics.create({
      data: {
        userId,
        totalAttempts: 1,
        correctAnswers: isCorrect ? 1 : 0,
        incorrectAnswers: isCorrect ? 0 : 1,
        averageScore: score,
        recommendedLevel: difficulty,
      },
    });
    return;
  }

  const newTotalAttempts = metrics.totalAttempts + 1;
  const newCorrectAnswers = metrics.correctAnswers + (isCorrect ? 1 : 0);
  const newAverageScore =
    (metrics.averageScore * metrics.totalAttempts + score) / newTotalAttempts;

  // Détermine le niveau recommandé
  const performancePercentage = (newCorrectAnswers / newTotalAttempts) * 100;
  const nextDifficulty = getNextDifficulty(
    metrics.recommendedLevel,
    performancePercentage
  );

  await prisma.adaptiveMetrics.update({
    where: { userId },
    data: {
      totalAttempts: newTotalAttempts,
      correctAnswers: newCorrectAnswers,
      incorrectAnswers: newTotalAttempts - newCorrectAnswers,
      averageScore: newAverageScore,
      recommendedLevel: nextDifficulty as Difficulty,
      lastCalculatedAt: new Date(),
    },
  });
}

/**
 * Génère un parcours d'apprentissage adaptatif pour un utilisateur
 */
export async function generateAdaptiveLearningPath(
  userId: string,
  courseId: string
): Promise<string[]> {
  const metrics = await prisma.adaptiveMetrics.findUnique({
    where: { userId },
  });

  if (!metrics) {
    // Commence par les exercices de niveau BEGINNER
    const beginnerExercises = await prisma.exercise.findMany({
      where: { difficulty: Difficulty.BEGINNER },
      select: { id: true },
      take: 10,
    });
    return beginnerExercises.map((e) => e.id);
  }

  // Récupère les sujets faibles et forts
  const weakTopics = metrics.weakTopics || [];
  const strongTopics = metrics.strongTopics || [];

  // Construit un parcours personnalisé
  const exercises = await prisma.exercise.findMany({
    where: {
      difficulty: metrics.recommendedLevel,
    },
    select: { id: true },
    take: 20,
  });

  // Priorise les sujets faibles
  const prioritized = exercises
    .sort((a, b) => {
      const aInWeak = weakTopics.includes(a.id);
      const bInWeak = weakTopics.includes(b.id);
      return aInWeak ? -1 : bInWeak ? 1 : 0;
    })
    .map((e) => e.id);

  return prioritized;
}

/**
 * Récupère les recommandations d'apprentissage pour un utilisateur
 */
export async function getLearningRecommendations(userId: string): Promise<{
  nextDifficulty: Difficulty;
  suggestedTopics: string[];
  estimatedDuration: number;
}> {
  const metrics = await prisma.adaptiveMetrics.findUnique({
    where: { userId },
  });

  if (!metrics) {
    return {
      nextDifficulty: Difficulty.BEGINNER,
      suggestedTopics: [],
      estimatedDuration: 30,
    };
  }

  return {
    nextDifficulty: metrics.recommendedLevel,
    suggestedTopics: metrics.weakTopics,
    estimatedDuration: Math.max(
      30,
      Math.ceil((100 - metrics.averageScore) * 1.5)
    ),
  };
}

/**
 * Détecte et marque les sujets faibles et forts
 */
export async function identifyTopicMastery(userId: string): Promise<void> {
  const answers = await prisma.answer.findMany({
    where: { userId },
    include: { exercise: true },
  });

  if (answers.length === 0) return;

  // Groupe par sujet
  const topicScores: Record<string, { correct: number; total: number }> = {};

  answers.forEach((answer) => {
    const topic = answer.exercise.type;
    if (!topicScores[topic]) {
      topicScores[topic] = { correct: 0, total: 0 };
    }
    topicScores[topic].total++;
    if (answer.isCorrect) {
      topicScores[topic].correct++;
    }
  });

  // Détermine les sujets faibles et forts
  const weakTopics = Object.entries(topicScores)
    .filter(([_, scores]) => (scores.correct / scores.total) * 100 < 70)
    .map(([topic]) => topic);

  const strongTopics = Object.entries(topicScores)
    .filter(([_, scores]) => (scores.correct / scores.total) * 100 >= 85)
    .map(([topic]) => topic);

  await prisma.adaptiveMetrics.update({
    where: { userId },
    data: {
      weakTopics,
      strongTopics,
    },
  });
}
