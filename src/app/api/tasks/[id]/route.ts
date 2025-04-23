import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const taskId = await (await params).id;
    
    const task = await prisma.task.update({
      where: { id: taskId },
      data: body,
    });

    // Revalidate all necessary paths
    revalidatePath("/dashboard");
    revalidatePath("/");
    
    return new Response(JSON.stringify(task), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return new Response(
      JSON.stringify({ message: "Error updating task" }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        }
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params before accessing id property
    const taskId = await (await params).id;
    
    await prisma.task.delete({
      where: { id: taskId },
    });

    // Revalidate all necessary paths
    revalidatePath("/dashboard");
    revalidatePath("/");
    
    return new Response(JSON.stringify({ message: "Task deleted successfully" }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting task" }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        }
      }
    );
  }
}