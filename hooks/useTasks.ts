import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/tasks";
import fetcher from "@/lib/api";

// Hook 1 - Read Data
export function useTasks() {
  // tells typescript the data returned from the API will be an array of task objects
  return useQuery<Task[]>({
    // cache tasks under the key "tasks"
    queryKey: ["tasks"],
    queryFn: () => fetcher("/api/tasks"),
  });
}
