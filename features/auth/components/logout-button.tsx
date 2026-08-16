"use client";

import React, { useTransition } from "react";
import { LogoutButtonProps } from "../types";
import { logout } from "../actions";

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const onLogout = () => {
    startTransition(async () => {
      try {
        await logout();
      } catch {
        // catch NEXT_REDIRECT
      } finally {
        window.location.href = "/";
      }
    });
  };

  return (
    <span
      role="button"
      tabIndex={0}
      className={`w-full text-left cursor-pointer inline-flex items-center ${isPending ? "opacity-50 pointer-events-none" : ""}`}
      onClick={onLogout}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onLogout();
        }
      }}
    >
      {children}
    </span>
  );
};

export default LogoutButton;
