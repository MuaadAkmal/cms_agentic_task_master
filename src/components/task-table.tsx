"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Types for task data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Task {
  id: string;
  lsa: string;
  tsp: string;
  dotAndLea: string;
  problemDescription: string;
  status: string;
  solutionProvided?: string | null;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo?: User | null;
  assignedToId?: string | null;
}

interface TaskTableProps {
  filter: "all" | "pending" | "approved";
}

export default function TaskTable({ filter }: TaskTableProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [solution, setSolution] = useState("");
  const router = useRouter();

  // Fetch tasks from API
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        // Build URL with query parameters
        const queryParams = new URLSearchParams();
        if (filter !== "all") {
          queryParams.append("status", filter);
        }
        if (searchQuery) {
          queryParams.append("search", searchQuery);
        }
        
        const response = await fetch(`/api/tasks?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const data = await response.json();
        setTasks(data.tasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTasks();
  }, [filter, searchQuery]);

  // Fetch users for task assignment
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    }
    
    fetchUsers();
  }, []);

  // Format date for display
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Handle task status update
  async function updateTaskStatus(taskId: string, newStatus: string, solution?: string) {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          ...(solution && { solutionProvided: solution }),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      
      // Refresh the task list
      router.refresh();
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus, ...(solution && { solutionProvided: solution }) } 
            : task
        )
      );
      
      // Close dialog
      setIsUpdateDialogOpen(false);
      setSelectedTask(null);
      
      // Success message
      alert('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  }

  // Handle task search
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // The search query is already set via the input field
    // The effect will trigger a new API call
  }

  return (
    <div className="space-y-4">
      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit">Search</Button>
      </form>
      
      {/* Task table */}
      <Table>
        <TableCaption>List of tasks in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>LSA</TableHead>
            <TableHead>TSP</TableHead>
            <TableHead>Dot & Lea</TableHead>
            <TableHead className="w-[300px]">Problem Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Loading tasks...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.lsa}</TableCell>
                <TableCell>{task.tsp}</TableCell>
                <TableCell>{task.dotAndLea}</TableCell>
                <TableCell className="max-w-[300px] truncate" title={task.problemDescription}>
                  {task.problemDescription}
                </TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === "Pending" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : task.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </TableCell>
                <TableCell>
                  {task.assignedTo?.name || "Unassigned"}
                </TableCell>
                <TableCell>{formatDate(task.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTask(task);
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTask(task);
                          setNewStatus(task.status);
                          setSolution(task.solutionProvided || "");
                          setIsUpdateDialogOpen(true);
                        }}
                      >
                        Update Status
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Task update dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task Status</DialogTitle>
            <DialogDescription>
              Change the status and provide solution details if necessary.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Problem Description</h4>
                <p className="text-sm">{selectedTask.problemDescription}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Status</h4>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Solution / Comments</h4>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={4}
                  className="w-full p-2 border rounded"
                  placeholder="Enter solution details or comments..."
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedTask) {
                  updateTaskStatus(selectedTask.id, newStatus, solution);
                }
              }}
            >
              Update Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}