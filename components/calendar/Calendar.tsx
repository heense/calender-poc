import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarHeader } from "./CalendarHeader";
import { MonthView } from "./MonthView";
import { YearView } from "./YearView";
import type { CalendarEvent, CalendarView } from "./types";
import { cn } from "@/lib/utils";
import { RaceDetailsModal } from "../f1/RaceDetailsModal";

interface CalendarProps {
  events: CalendarEvent[];
}

const getSeriesStyles = (event: CalendarEvent) => {
  const seriesCode = event.race_series?.code;
  const isSprintRace = event.sprint_race;

  switch (seriesCode) {
    case "F1":
      return {
        bg: isSprintRace ? "bg-red-100" : "bg-red-50",
        border: isSprintRace ? "border-red-500" : "border-red-200",
        dot: "bg-red-500",
      };
    case "F2":
      return {
        bg: isSprintRace ? "bg-blue-100" : "bg-blue-50",
        border: isSprintRace ? "border-blue-500" : "border-blue-200",
        dot: "bg-blue-500",
      };
    case "F3":
      return {
        bg: isSprintRace ? "bg-green-100" : "bg-green-50",
        border: isSprintRace ? "border-green-500" : "border-green-200",
        dot: "bg-green-500",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        dot: "bg-gray-500",
      };
  }
};

const Legend = () => (
  <div className="flex flex-wrap gap-4 mb-6">
    <div className="text-sm font-medium">Legend:</div>
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-red-50 border border-red-200" />
        <span className="text-sm">F1</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-blue-50 border border-blue-200" />
        <span className="text-sm">F2</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-green-50 border border-green-200" />
        <span className="text-sm">F3</span>
      </div>
    </div>
    <div className="flex items-center gap-2 ml-4">
      <div className="w-4 h-4 rounded border-2 border-gray-400" />
      <span className="text-sm">Sprint Race</span>
    </div>
  </div>
);

export function Calendar({ events }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [selectedRace, setSelectedRace] = useState<CalendarEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedRace(event);
    setModalOpen(true);
  };

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      if (view === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      } else {
        return new Date(prev.getFullYear() - 1, 0, 1);
      }
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      if (view === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      } else {
        return new Date(prev.getFullYear() + 1, 0, 1);
      }
    });
  };

  return (
    <>
      <Card
        className={`p-6 ${view === "year" ? "w-full max-w-[1400px] mx-auto" : ""}`}
      >
        <Legend />
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        {view === "month" ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            getSeriesStyles={getSeriesStyles}
          />
        ) : (
          <YearView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            getSeriesStyles={getSeriesStyles}
          />
        )}
      </Card>

      <RaceDetailsModal
        race={selectedRace}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
