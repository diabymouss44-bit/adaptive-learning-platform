import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { submitExerciseSchema } from '@/lib/validations';
import { processUserAnswer, identifyTopicMastery } from '@/services/adaptiveLearning';
import logger from '@/lib/logger';
import { getServerSession } from 'next-auth/next';

export async function POST(req: NextRequest) {
  try {
    // Vérifie l'authentification
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validatedData = submitExerciseSchema.parse(body);

    // Vérifie que l'exercice existe
    const exercise = await prisma.exercise.findUnique({
      where: { id: validatedData.exerciseId },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercice non trouvé' },
        { status: 404 }
      );
    }

    // Simule la correction (à remplacer par une logique réelle)
    const isCorrect = validatedData.content.length > 10;
    const score = isCorrect ? 100 : 50;

    // Enregistre la réponse
    const answer = await prisma.answer.create({
      data: {
        userId: user.id,
        exerciseId: validatedData.exerciseId,
        content: validatedData.content,
        isCorrect,
        score,
        attemptNumber: 1,
      },
    });

    // Traite la réponse pour l'apprentissage adaptatif
    await processUserAnswer({
      userId: user.id,
      exerciseId: validatedData.exerciseId,
      isCorrect,
      score,
      timeSpent: 300,
    });

    // Identifie les sujets maîtrisés
    await identifyTopicMastery(user.id);

    logger.info(`Exercise submitted by user ${user.id}`);

    return NextResponse.json(
      {
        success: true,
        answer,
        feedback: isCorrect ? 'Excellent!' : 'À améliorer',
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Error submitting exercise:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la soumission' },
      { status: 500 }
    );
  }
}
