"use client";

import React from 'react'
import { LogoutButtonProps } from '../types'

const LogoutButton = ({children}:LogoutButtonProps) => {
    const onLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.assign("/auth/logout");
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
