"use client";

import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createSupabaseClient } from "./supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export function useSupabaseWithAuth(): {
  getClient: () => Promise<SupabaseClient>;
} {
  const { getToken } = useAuth();

  const getClient = useMemo(
    () => async () => {
      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("Not authenticated");
      return createSupabaseClient(token);
    },
    [getToken]
  );

  return { getClient };
}
