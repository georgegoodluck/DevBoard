import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project } from "@/types/projects";
import fetcher from "@/lib/api";

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => fetcher("/api/projects"),
  });
}
