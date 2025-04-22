import { Database } from "@/types/database.types";

export type Race = Database["public"]["Tables"]["races"]["Row"] & {
  race_series?: Database["public"]["Tables"]["race_series"]["Row"];
};

export type CalendarEvent = Race;

export type CalendarView = "month" | "year";
