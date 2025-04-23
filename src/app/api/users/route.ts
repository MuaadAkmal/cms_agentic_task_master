import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return new NextResponse('Error fetching users', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Create a new user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role || 'employee', // Default role
      },
    });

    // Remove sensitive data before sending response
    const { ...userWithoutSensitiveInfo } = user;

    return NextResponse.json({ user: userWithoutSensitiveInfo }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}