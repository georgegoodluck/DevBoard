import { useQuery } from "@tanstack/react-query";
import { ActivityEvent } from "@/types/activity";
import fetcher from "@/lib/api";

export function useActivity() {
  return useQuery<ActivityEvent[]>({
    queryKey: ["activity"],
    queryFn: () => fetcher("/api/activity"),
  });
}
