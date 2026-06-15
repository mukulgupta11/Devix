"use client";

import React from 'react'
import { LogoutButtonProps } from '../types'
import { signOut } from 'next-auth/react';

const LogoutButton = ({children}:LogoutButtonProps) => {
    const onLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await signOut({ redirectTo: "/" });
    }

  return (
    <button
        type="button"
        className="w-full text-left cursor-pointer"
        onClick={onLogout}
    >
        {children}
    </button>
  )
}

export default LogoutButton
