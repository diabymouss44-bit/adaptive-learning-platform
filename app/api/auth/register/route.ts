import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signUpSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = signUpSchema.parse(body);

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      logger.warn(`Registration attempt with existing email: ${validatedData.email}`);
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Crée l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Crée les métriques adaptatives initiales
    await prisma.adaptiveMetrics.create({
      data: {
        userId: user.id,
        recommendedLevel: 'BEGINNER',
      },
    });

    logger.info(`User registered successfully: ${user.email}`);

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Validation error during registration', error.errors);
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    logger.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
