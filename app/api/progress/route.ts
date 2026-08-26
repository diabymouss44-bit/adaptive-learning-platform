import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
      include: {
        courseProgress: true,
        adaptiveMetrics: true,
        achievements: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        totalXP: user.totalXP,
      },
      progress: user.courseProgress,
      metrics: user.adaptiveMetrics,
      achievements: user.achievements,
    });
  } catch (error) {
    logger.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la progression' },
      { status: 500 }
    );
  }
}
