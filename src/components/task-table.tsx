"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Download,
  Pencil,
  Sparkles,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import * as XLSX from "xlsx";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useDebounce } from "@/lib/utils";

// ExpandableText component for handling text truncation with expand/collapse functionality
function ExpandableText({ text }: { text: string; maxLines?: number }) {
  const [expanded, setExpanded] = useState(false);

  if (!text || text === "-") return <span>-</span>;

  // Check if the text is long enough to need truncation
  const needsTruncation = text.length > 150 || text.split("\n").length > 3;

  if (!needsTruncation) {
    return <div className="whitespace-pre-wrap break-words">{text}</div>;
  }

  return (
    <div className="w-full">
      {!expanded ? (
        <div onClick={() => setExpanded(true)} className="cursor-pointer group">
          <div className="line-clamp-3 overflow-hidden w-full break-words">
            {text}
          </div>
          {needsTruncation && (
            <div className="text-blue-500 text-xs mt-1">...</div>
          )}
        </div>
      ) : (
        <div onClick={() => setExpanded(false)} className="cursor-pointer">
          <div className="whitespace-pre-wrap w-full break-words">{text}</div>
          <div className="text-blue-500 text-xs mt-1 flex items-center">
            <ChevronUp className="h-3 w-3 mr-1" />
            Show less
          </div>
        </div>
      )}
    </div>
  );
}

interface Task {
  id: string;
  lsa: string;
  tsp: string;
  dotAndLea: string;
  problemDescription: string;
  status: string;
  solutionProvided?: string;
  remarks?: string;
  createdAt: string;
}

interface EditTaskFormData {
  status: string;
  solutionProvided: string;
  remarks: string;
}

// Sorting related types
type SortableColumn =
  | "lsa"
  | "tsp"
  | "dotAndLea"
  | "problemDescription"
  | "status"
  | "solutionProvided"
  | "remarks"
  | "createdAt";

type SortDirection = "asc" | "desc" | null;

interface SortConfig {
  column: SortableColumn | null;
  direction: SortDirection;
}

export default function TaskTable() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editFormData, setEditFormData] = useState<EditTaskFormData>({
    status: "",
    solutionProvided: "",
    remarks: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  // Add sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    direction: null,
  });
  const ITEMS_PER_PAGE = 10;

  // Apply debounce to search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const queryClient = useQueryClient();

  const fetchTasks = async () => {
    const queryParams = new URLSearchParams();
    if (dateRange?.from) {
      queryParams.append("from", dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      queryParams.append("to", dateRange.to.toISOString());
    }
    if (statusFilter !== "all") {
      queryParams.append("status", statusFilter);
    }
    if (debouncedSearchQuery) {
      queryParams.append("search", debouncedSearchQuery);
    }

    const response = await fetch(`/api/tasks?${queryParams}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  };

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: [
      "tasks",
      dateRange?.from?.toString(),
      dateRange?.to?.toString(),
      statusFilter,
      debouncedSearchQuery, // Use the debounced query here instead of the raw searchQuery
      page,
    ],
    queryFn: fetchTasks,
  });

  const editTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      formData,
    }: {
      taskId: string;
      formData: EditTaskFormData;
    }) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update task");

      return response.json();
    },
    onSuccess: () => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setSelectedTask(null);
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      return response.json();
    },
    onSuccess: () => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTaskToDelete(null);
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const handleEditTask = (taskId: string, formData: EditTaskFormData) => {
    editTaskMutation.mutate({ taskId, formData });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleAISummarize = async () => {
    toast.info("AI Summarize feature coming soon!");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "in progress":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const safeFormatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, "PPP");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Sorting function for table columns
  const handleSort = (column: SortableColumn) => {
    let direction: SortDirection = "asc";

    if (sortConfig.column === column) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ column, direction });
    // Reset to page 1 when sorting changes
    setPage(1);
  };

  // Get the sorted data with current sort configuration
  const getSortedTasks = (data: Task[]) => {
    if (!sortConfig.column || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.column as keyof Task];
      const bValue = b[sortConfig.column as keyof Task];

      // Special handling for dates
      if (sortConfig.column === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Handle string comparison for other fields
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (!bValue) return sortConfig.direction === "asc" ? 1 : -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  };

  const getSortIcon = (column: SortableColumn) => {
    if (sortConfig.column !== column) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }

    if (sortConfig.direction === "asc") {
      return <ChevronUp className="h-4 w-4" />;
    }

    if (sortConfig.direction === "desc") {
      return <ChevronDown className="h-4 w-4" />;
    }

    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  const handleExport = () => {
    const exportData = tasks.map((task: Task, index: number) => ({
      "#": index + 1,
      "Created At": safeFormatDate(task.createdAt),
      LSA: task.lsa,
      TSP: task.tsp,
      "Request Raised By": task.dotAndLea,
      "Problem Description": task.problemDescription,
      Status: task.status,
      Solution: task.solutionProvided || "",
      Remarks: task.remarks || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");

    let filename = "tasks";
    if (dateRange?.from) {
      filename += `_from_${format(dateRange.from, "yyyy-MM-dd")}`;
    }
    if (dateRange?.to) {
      filename += `_to_${format(dateRange.to, "yyyy-MM-dd")}`;
    }
    filename += ".xlsx";

    XLSX.writeFile(wb, filename);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Apply sorting before pagination
  const sortedTasks = getSortedTasks(tasks);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTasks = sortedTasks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[300px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search in description or solution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />

          <Button
            onClick={handleAISummarize}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            AI Summarize
          </Button>
        </div>

        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead
                onClick={() => handleSort("lsa")}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>LSA</span>
                  {getSortIcon("lsa")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("tsp")}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>TSP</span>
                  {getSortIcon("tsp")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("dotAndLea")}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Raised By</span>
                  {getSortIcon("dotAndLea")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("problemDescription")}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Problem Description</span>
                  {getSortIcon("problemDescription")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("status")}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon("status")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("solutionProvided")}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Solution</span>
                  {getSortIcon("solutionProvided")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("remarks")}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Remarks</span>
                  {getSortIcon("remarks")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("createdAt")}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Created At</span>
                  {getSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTasks.map((task, index) => (
              <TableRow key={task.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{task.lsa}</TableCell>
                <TableCell>{task.tsp}</TableCell>
                <TableCell>{task.dotAndLea}</TableCell>
                <TableCell className="max-w-[200px]">
                  <ExpandableText text={task.problemDescription} />
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <ExpandableText text={task.solutionProvided || "-"} />
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <ExpandableText text={task.remarks || "-"} />
                </TableCell>
                <TableCell>{safeFormatDate(task.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTask(task);
                            setEditFormData({
                              status: task.status,
                              solutionProvided: task.solutionProvided || "",
                              remarks: task.remarks || "",
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Select
                              value={editFormData.status}
                              onValueChange={(value) =>
                                setEditFormData({
                                  ...editFormData,
                                  status: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="resolved">
                                  Resolved
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Solution
                            </label>
                            <Textarea
                              placeholder="Enter solution..."
                              value={editFormData.solutionProvided}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  solutionProvided: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Remarks
                            </label>
                            <Textarea
                              placeholder="Enter remarks..."
                              value={editFormData.remarks}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  remarks: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedTask(null);
                              setEditFormData({
                                status: "",
                                solutionProvided: "",
                                remarks: "",
                              });
                              setIsDialogOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              if (selectedTask) {
                                handleEditTask(selectedTask.id, editFormData);
                              }
                            }}
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setTaskToDelete(task.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setTaskToDelete(null);
                setIsDeleteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (taskToDelete) {
                  handleDeleteTask(taskToDelete);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedTasks.length)} of{" "}
          {sortedTasks.length} tasks
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setPage((p) => Math.max(1, p - 1));
            }}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setPage((p) => Math.min(totalPages, p + 1));
            }}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
