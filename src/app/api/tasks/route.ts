import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build the query filter
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    // Add search functionality
    if (search) {
      filter.OR = [
        { problemDescription: { contains: search } },
        { solutionProvided: { contains: search } },
      ];
    }

    // Fetch tasks from the database
    const tasks = await prisma.task.findMany({
      where: filter,
      include: {
        assignedTo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      // If no search, limit to latest 6 tasks
      ...(search ? {} : { take: 6 }),
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create a new task
    const task = await prisma.task.create({
      data: {
        lsa: body.lsa,
        tsp: body.tsp,
        dotAndLea: body.dotAndLea,
        problemDescription: body.problemDescription,
        status: body.status || 'Pending',
        solutionProvided: body.solutionProvided,
        remarks: body.remarks,
        // If there's an assignedToId in the request, assign the task
        ...(body.assignedToId && { assignedToId: body.assignedToId }),
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}