"use client";

import { useEffect } from "react";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function HandleSession() {
  useEffect(() => {
    if (!document.cookie) {
      document.cookie = `user-session=${generateUUID()}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax;`;
    }
  }, []);

  return <></>;
}
