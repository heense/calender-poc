import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { CalendarView } from "./types";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
}: CalendarHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">
        {view === "month"
          ? format(currentDate, "MMMM yyyy")
          : format(currentDate, "yyyy")}
      </h2>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPrevious}>
          Previous
        </Button>
        <div className="flex gap-1">
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("year")}
          >
            Year
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
