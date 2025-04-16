"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  senderName?: string;
  groupChatId?: string;
  receiverId?: string;
}

// For demonstration, we'll use a fixed current user
// In a real app, this would come from authentication
const currentUser = {
  id: "user1",
  name: "Sofia Davis",
  email: "m@example.com",
  role: "employee",
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<"group" | string>("group");
  const [activeChatName, setActiveChatName] = useState("Group Chat");
  const [activeChatEmail, setActiveChatEmail] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    // First, fetch existing messages
    fetchMessages();

    // Then fetch users
    fetchUsers();

    // Connect to Socket.IO server
    // In production, we'd use the actual server URL
    const socketInstance = io("http://localhost:3001");

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);

      // Join the group chat room
      socketInstance.emit("join-room", "group");
    });

    socketInstance.on("new-message", (message: Message) => {
      console.log("New message received:", message);
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    socketInstance.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    setSocket(socketInstance);

    // Cleanup function
    return () => {
      if (socketInstance) {
        console.log("Disconnecting socket");
        socketInstance.disconnect();
      }
    };
  }, []);

  // Fetch existing messages
  const fetchMessages = async () => {
    try {
      // In a real app we'd have an API endpoint for messages
      // For now, just simulate some loading time
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for now
      const mockMessages: Message[] = [
        {
          id: "msg1",
          senderId: "user2",
          content: "Hi, how can I help you today?",
          createdAt: new Date("2025-04-16T09:30:00").toISOString(),
          senderName: "Sofia Davis",
          groupChatId: "group",
        },
        {
          id: "msg2",
          senderId: "user1",
          content: "Hey, I'm having trouble with my account.",
          createdAt: new Date("2025-04-16T09:32:00").toISOString(),
          senderName: "John Doe",
          groupChatId: "group",
        },
        {
          id: "msg3",
          senderId: "user2",
          content: "What seems to be the problem?",
          createdAt: new Date("2025-04-16T09:33:00").toISOString(),
          senderName: "Sofia Davis",
          groupChatId: "group",
        },
        {
          id: "msg4",
          senderId: "user1",
          content: "I can't log in.",
          createdAt: new Date("2025-04-16T09:34:00").toISOString(),
          senderName: "John Doe",
          groupChatId: "group",
        },
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for direct messaging
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      // Filter out current user
      const otherUsers = data.users.filter(
        (user: User) => user.id !== currentUser.id
      );
      setUsers(otherUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      content: newMessage,
      senderId: currentUser.id,
      senderName: currentUser.name,
      ...(activeChat === "group"
        ? { groupChatId: "group" }
        : { receiverId: activeChat }),
    };

    console.log("Sending message:", messageData);

    // Emit the message to the socket server
    socket.emit("send-message", messageData);

    // Clear the input
    setNewMessage("");
  };

  // Format timestamp to a readable time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle changing active chat
  const handleChatChange = (userId: string, name: string, email?: string) => {
    setActiveChat(userId);
    setActiveChatName(name);
    setActiveChatEmail(email || "");

    if (socket) {
      // Join the room for this chat
      socket.emit("join-room", userId === "group" ? "group" : userId);
    }
  };

  // Filter messages based on active chat
  const filteredMessages = messages.filter((message) => {
    if (activeChat === "group") {
      return message.groupChatId === "group";
    } else {
      // Direct messages involving the current user and selected user
      return (
        (message.senderId === currentUser.id &&
          message.receiverId === activeChat) ||
        (message.senderId === activeChat &&
          message.receiverId === currentUser.id)
      );
    }
  });

  return (
    <div className="border rounded-md overflow-hidden h-[500px] bg-white dark:bg-gray-950 flex flex-col shadow-md">
      {/* Chat header with user info and actions */}
      <div className="p-3 border-b flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>{activeChatName[0] || "G"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{activeChatName}</p>
            {activeChatEmail && (
              <p className="text-xs text-muted-foreground">{activeChatEmail}</p>
            )}
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Switch conversation</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleChatChange("group", "Group Chat")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>G</AvatarFallback>
                      </Avatar>
                      <span>Group Chat</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Direct Messages</DropdownMenuLabel>
                  {users.map((user) => (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() =>
                        handleChatChange(user.id, user.name, user.email)
                      }
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>New conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex max-w-[80%] mb-4 ${
                message.senderId === currentUser.id ? "ml-auto" : ""
              }`}
            >
              {message.senderId !== currentUser.id && (
                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                  <AvatarFallback>
                    {message.senderName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <div
                  className={`rounded-lg p-3 ${
                    message.senderId === currentUser.id
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground block mt-1">
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t p-3 flex items-center gap-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={!isConnected}
          className="rounded-full"
        />
        <Button
          className="rounded-full flex-shrink-0 h-10 w-10 p-2"
          onClick={handleSendMessage}
          disabled={!isConnected || newMessage.trim() === ""}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}