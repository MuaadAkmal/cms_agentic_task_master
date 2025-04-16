"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Define form schema with Zod
const formSchema = z.object({
  lsa: z.string({
    required_error: "Please select an LSA option",
  }),
  tsp: z.string({
    required_error: "Please select a TSP option",
  }),
  dotAndLea: z.string({
    required_error: "Please select a Dot & Lea option",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  problemDescription: z.string().min(10, {
    message: "Problem description must be at least 10 characters",
  }),
});

export default function TaskForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lsa: "",
      tsp: "",
      dotAndLea: "",
      problemDescription: "",
      date: new Date(),
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Send data to API endpoint
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          date: values.date.toISOString(),
          status: "Pending", // Default status
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit task");
      }

      // Success handling
      const data = await response.json();
      console.log("Task created:", data.task);

      // Reset form and refresh tasks
      form.reset();
      router.refresh();

      // Show success message
      alert("Task submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Two column layout for the form fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left column - LSA and TSP */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="lsa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LSA</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select LSA" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select TSP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tsp1">TSP 1</SelectItem>
                      <SelectItem value="tsp2">TSP 2</SelectItem>
                      <SelectItem value="tsp3">TSP 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right column - Date and Authorizing Committee (Dot & Lea) */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dotAndLea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authorizing Committee</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Committee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dotLea1">Option A</SelectItem>
                      <SelectItem value="dotLea2">Option B</SelectItem>
                      <SelectItem value="dotLea3">Option C</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Problem Description spans both columns */}
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
                />
              </FormControl>
              <FormDescription>
                Provide a clear description of the issue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Task"}
        </Button>
      </form>
    </Form>
  );
}
