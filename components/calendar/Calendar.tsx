import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EventDetailsModal } from "./EventDetailsModal";
import { CalendarHeader } from "./CalendarHeader";
import { MonthView } from "./MonthView";
import { YearView } from "./YearView";
import type { CalendarEvent, CalendarView } from "./types";

interface CalendarProps {
  events: CalendarEvent[];
}

export function Calendar({ events }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
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
          />
        ) : (
          <YearView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
          />
        )}
      </Card>

      <EventDetailsModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
