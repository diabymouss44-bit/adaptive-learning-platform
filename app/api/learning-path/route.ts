import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAdaptiveLearningPath, getLearningRecommendations } from '@/services/adaptiveLearning';
import { getServerSession } from 'next-auth/next';
import logger from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
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

    const courseId = req.nextUrl.searchParams.get('courseId');
    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId requis' },
        { status: 400 }
      );
    }

    // Génère le parcours adaptatif
    const path = await generateAdaptiveLearningPath(user.id, courseId);
    const recommendations = await getLearningRecommendations(user.id);

    logger.info(`Learning path generated for user ${user.id}`);

    return NextResponse.json({
      success: true,
      path,
      recommendations,
    });
  } catch (error) {
    logger.error('Error generating learning path:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du parcours' },
      { status: 500 }
    );
  }
}
