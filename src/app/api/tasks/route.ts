import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: {
      status?: string;
      OR?: Array<{ problemDescription?: { contains: string }; solutionProvided?: { contains: string }; remarks?: { contains: string } }>;
      createdAt?: { gte?: Date; lte?: Date };
    } = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { problemDescription: { contains: search } },
        { solutionProvided: { contains: search } },
        { remarks: { contains: search } },
      ];
    }

    if (from || to) {
      where.createdAt = {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return new NextResponse(JSON.stringify(tasks), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch tasks' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = await prisma.task.create({
      data: {
        lsa: body.lsa,
        tsp: body.tsp,
        dotAndLea: body.dotAndLea,
        problemDescription: body.problemDescription,
        status: body.status,
      },
    });

    // Ensure immediate revalidation
    revalidatePath("/dashboard");
    revalidatePath("/");
    
    return NextResponse.json({ task, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}


