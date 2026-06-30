export type ProjectStatus = "In Progress" | "Planning" | "Review" | "Active"

export type Project = {
    id: string;
    name: string;
    description: string;
    emoji: string;
    
}