"use client";

import React from 'react'
import { LogoutButtonProps } from '../types'
import { logout } from '@/features/auth/actions';
import { useRouter } from 'next/navigation';

const LogoutButton = ({children}:LogoutButtonProps) => {
    const router = useRouter();

    const onLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Clear the session first
        await logout();
        // Then redirect after session is confirmed cleared
        router.push('/');
        router.refresh();
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