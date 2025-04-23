"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "next-auth";

interface UserAvatarProps {
  user: User;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar>
      {user.avatar ? (
        <AvatarImage src={user.avatar} alt={user.name || ""} />
      ) : (
        <AvatarFallback>{getInitials(user.name || "")}</AvatarFallback>
      )}
    </Avatar>
  );
}
