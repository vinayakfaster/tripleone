// hooks/useCurrentUser.ts
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { SafeUser } from "@/types";

export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/current")
      .then(res => setCurrentUser(res.data))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { currentUser, loading };
}
