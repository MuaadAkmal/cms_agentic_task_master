"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: string;
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      // Add message to UI immediately
      const tempMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "user",
      };
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");

      // You can add API call here if needed
      // const response = await fetch('/api/messages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: newMessage }),
      // });

      // For now, just simulate a response
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "This feature is coming soon!",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="font-semibold">Chat Assistant</CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
