"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DotLeaOptions,
  LSAOptions,
  TSPOptions,
  StatusOptions,
  taskFormSchema,
  type TaskFormValues,
} from "@/types/type";
import { toast } from "sonner";

export default function TaskForm() {
  const [isPending, startTransition] = useTransition();

  const queryClient = useQueryClient();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema) as Resolver<TaskFormValues>,
    defaultValues: {
      lsa: LSAOptions[0],
      tsp: TSPOptions[0],
      dotAndLea: DotLeaOptions[0],
      problemDescription: "",
      status: "pending" as const,
    },
    mode: "onBlur",
  });

  async function onSubmit(values: TaskFormValues) {
    startTransition(async () => {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to submit task");
        }

        form.reset();
        // Invalidate the tasks query to refresh the task table
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success("Task submitted successfully!");
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit task. Please try again.");
      }
    });
  }

  // Handle form submission on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="lsa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LSA</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select LSA" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LSAOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tsp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TSP</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select TSP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TSPOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {StatusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="dotAndLea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Raised By</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Committee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DotLeaOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="problemDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problem Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the problem in detail..."
                  className="resize-none"
                  {...field}
                  rows={5}
                  onKeyDown={handleKeyDown}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground mt-1">
                Press Ctrl + Enter to submit
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Task"}
        </Button>
      </form>
    </Form>
  );
}
