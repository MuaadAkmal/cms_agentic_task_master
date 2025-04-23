"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getTasks() {
  try {
    const tasks = await prisma.taskNote.findMany({
      orderBy: { createdAt: "desc" },
    });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { message: "Failed to fetch tasks" };
  }
}

export async function addTask(message: string) {
  try {
    await prisma.taskNote.create({
      data: {
        message,
        checked: false,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { message: "Task added successfully" };
  } catch (error) {
    console.error("Error adding task:", error);
    return { message: "Failed to add task" };
  }
}

export async function toggleTask(id: string) {
  try {
    const task = await prisma.taskNote.findUnique({
      where: { id },
    });

    if (!task) {
      return { message: "Task not found" };
    }

    await prisma.taskNote.update({
      where: { id },
      data: {
        checked: !task.checked,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { message: "Task updated successfully" };
  } catch (error) {
    console.error("Error toggling task:", error);
    return { message: "Failed to update task" };
  }
}

export async function deleteTask(id: string) {
  try {
    await prisma.taskNote.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { message: "Task deleted successfully" };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { message: "Failed to delete task" };
  }
}