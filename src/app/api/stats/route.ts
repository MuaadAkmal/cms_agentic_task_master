import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { startOfMonth, subDays } from "date-fns";

export async function GET() {
  try {
    // Get total tasks count
    const totalTasks = await prisma.task.count();

    // Get resolved and pending tasks
    const resolvedTasks = await prisma.task.count({
      where: { status: "resolved" }
    });

    const pendingTasks = await prisma.task.count({
      where: { status: "pending" }
    });

    // Get tasks created this month
    const monthlyTasks = await prisma.task.count({
      where: {
        createdAt: {
          gte: startOfMonth(new Date())
        }
      }
    });

    // Get recent activity (last 7 days)
    const recentActivity = await prisma.task.findMany({
      where: {
        createdAt: {
          gte: subDays(new Date(), 7)
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        problemDescription: true,
        status: true,
        createdAt: true,
        tsp: true,
        lsa: true,
        assignedTo: {
          select: {
            name: true
          }
        }
      }
    });

    // Get TSP distribution
    const tspStats = await prisma.task.groupBy({
      by: ['tsp'],
      _count: {
        tsp: true
      }
    });

    // Get LSA distribution
    const lsaStats = await prisma.task.groupBy({
      by: ['lsa'],
      _count: {
        lsa: true
      }
    });

    // Get status distribution
    const statusStats = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    return NextResponse.json({
      totalTasks,
      resolvedTasks,
      pendingTasks,
      monthlyTasks,
      recentActivity,
      tspStats: tspStats.map(stat => ({
        name: stat.tsp,
        count: stat._count.tsp
      })),
      lsaStats: lsaStats.map(stat => ({
        name: stat.lsa,
        count: stat._count.lsa
      })),
      statusDistribution: statusStats.map(stat => ({
        name: stat.status,
        value: stat._count.status
      }))
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}