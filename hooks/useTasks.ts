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

// Hook 2 - Changing Data
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate tasks cache so the list refetches
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// How invalidateQueries on success works - After creating a task, the cached task list is stale. It doesn't include the new task yet. Invalidating forces a refetch so the UI updates automatically. This is the React Query pattern for keeping server and client state in sync.
