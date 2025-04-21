import type { Database } from "../../types/database.types";

export type CalendarEvent =
  Database["public"]["Tables"]["f1_races_2025"]["Row"];
export type CalendarView = "month" | "year";
