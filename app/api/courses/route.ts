import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paginationSchema } from '@/lib/validations';
import logger from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    const skip = (page - 1) * limit;

    // Construit le filtre
    const where: any = {
      isPublished: true,
    };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    // Récupère les cours
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficulty: true,
          estimatedDuration: true,
          icon: true,
          bannerUrl: true,
        },
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      data: courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cours' },
      { status: 500 }
    );
  }
}
