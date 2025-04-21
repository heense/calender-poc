import type { Database } from "@/types/database.types";

export type CalendarEvent = Database["public"]["Tables"]["f1_races"]["Row"];
export type CalendarView = "month" | "year";
