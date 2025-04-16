"use client";

import { useState, useEffect, useTransition } from "react";
import {
  addTask,
  deleteTask,
  getTasks,
  toggleTask,
} from "@/serverActions/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

interface TaskNote {
  id: string;
  message: string;
  createdAt: Date;
  checked: boolean;
}

export default function TaskNoteWidget() {
  const [tasks, setTasks] = useState<TaskNote[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const fetchedTasks = await getTasks();

    // do error check here both error and success has message property
    if (fetchedTasks instanceof Array) {
      setTasks(fetchedTasks);
      return;
    } else {
      toast.error(fetchedTasks.message);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    startTransition(async () => {
      await addTask(newTask);
      setNewTask("");
      await fetchTasks();
      toast.success("Your new task has been added successfully");
    });
  };

  const handleToggleTask = async (id: string) => {
    startTransition(async () => {
      await toggleTask(id);
      await fetchTasks();
    });
  };

  const handleDeleteTask = async (id: string) => {
    startTransition(async () => {
      await deleteTask(id);
      await fetchTasks();
      toast.success("Task deleted successfully");
    });
  };

  return (
    <Card className="w-full  max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Task Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow"
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
          </Button>
        </form>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center space-x-2">
              <Checkbox
                id={task.id}
                checked={task.checked}
                onCheckedChange={() => handleToggleTask(task.id)}
              />
              <label
                htmlFor={task.id}
                className={`flex-grow ${
                  task.checked ? "line-through text-gray-500" : ""
                }`}
              >
                {task.message}
              </label>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-black-500 hover:text-red-700"
                disabled={isPending}
              >
                <Trash className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
