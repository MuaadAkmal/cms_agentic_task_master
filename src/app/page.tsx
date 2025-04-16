import TaskForm from "@/components/task-form";
import ChatUI from "@/components/chat-ui";
import TaskTable from "@/components/task-table";
import NoticeBox from "@/components/notice-box";
import CalendarEvent from "@/components/calendar-event";
import TaskNoteWidget from "@/components/task-note-widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="flex flex-col space-y-4">
      {/* Main grid layout to match the image */}
      <div className="grid grid-cols-3 gap-4">
        {/* First row - 3 equal columns */}
        <Card className="p-3 aspect-square">
          <h2 className="text-lg font-medium mb-2">System Notices</h2>
          <NoticeBox />
        </Card>

        <div className="aspect-square">
          <ChatUI />
        </div>

        <div className="row-span-2 p-0 space-y-4 ">
          <CalendarEvent />
          <TaskNoteWidget />
        </div>

        {/* Second row - Task Form (spans 2 cols) and Task Note Widget (1 col) */}
        <Card className="col-span-2 p-3">
          <h2 className="text-lg font-medium mb-2">Task Entry Form</h2>
          <TaskForm />
        </Card>

        <div></div>

        {/* Third row - Table spans all 3 columns */}
        <Card className="col-span-3 p-3">
          <h2 className="text-lg font-medium mb-2">Tasks</h2>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-2">
              <TaskTable filter="all" />
            </TabsContent>
            <TabsContent value="pending" className="pt-2">
              <TaskTable filter="pending" />
            </TabsContent>
            <TabsContent value="approved" className="pt-2">
              <TaskTable filter="approved" />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Toast notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}
