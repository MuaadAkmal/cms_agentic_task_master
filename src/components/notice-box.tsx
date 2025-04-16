"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

export default function NoticeBox() {
  return (
    <Alert className="border border-gray-200 dark:border-gray-800">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        Schema Updates <Badge variant="outline">New</Badge>
      </AlertTitle>
      <AlertDescription>
        <p className="text-sm mt-1">
          Recent Prisma schema changes have been applied to the database.
        </p>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li>Added <code className="text-xs bg-muted px-1 py-0.5 rounded">Notice</code> model for system notifications</li>
          <li>Updated <code className="text-xs bg-muted px-1 py-0.5 rounded">Task</code> model with priority field</li>
          <li>Added relations between <code className="text-xs bg-muted px-1 py-0.5 rounded">User</code> and <code className="text-xs bg-muted px-1 py-0.5 rounded">Notice</code></li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}