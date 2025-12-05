// @mini-nexus-virtual-lab/client/src/hooks/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../lib/authClient";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });
}
