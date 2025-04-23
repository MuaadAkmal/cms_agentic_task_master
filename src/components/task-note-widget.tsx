"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useState } from "react";

interface TaskNote {
  id: string;
  message: string;
  createdAt: Date;
  checked: boolean;
}

export default function TaskNoteWidget() {
  const [newTask, setNewTask] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const tasks: TaskNote[] = Array.isArray(data) ? data : [];

  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setNewTask("");
      toast.success("Your new task has been added successfully");
    },
    onError: () => {
      toast.error("Failed to add task");
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: toggleTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTaskMutation.mutate(newTask);
  };

  const handleToggleTask = (id: string) => {
    toggleTaskMutation.mutate(id);
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  return (
    <Card className="w-full max-w-md mx-auto pt-2.5">
      <CardHeader>
        <CardTitle className="text-md font-medium">Task Notes</CardTitle>
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
          <Button type="submit" disabled={addTaskMutation.isPending}>
            {addTaskMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </form>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task: TaskNote) => (
              <li key={task.id} className="flex items-center space-x-2">
                <Checkbox
                  id={task.id}
                  checked={task.checked}
                  onCheckedChange={() => handleToggleTask(task.id)}
                  disabled={toggleTaskMutation.isPending}
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
                  disabled={deleteTaskMutation.isPending}
                >
                  <Trash className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
