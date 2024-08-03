"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";

export async function handleLogin() {
  cookies().set("session", randomUUID(), {
    httpOnly: true,
    // maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });

  // Redirect or handle the response after setting the cookie
}
