"use client";

import TaskForm from "@/components/task-form";
import TaskTable from "@/components/task-table";
import ChatUI from "@/components/chat-ui";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl container mx-auto py-10 space-y-4">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Card className="grow p-4 ring-1 ring-black/10 shadow-lg">
            <Suspense fallback={<div>Loading form...</div>}>
              <TaskForm />
            </Suspense>
          </Card>
          <div className="col-start-5 col-span-full">
            <ChatUI />
          </div>
        </div>
        <Card className="ring-1 ring-black/10">
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TaskTable />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
