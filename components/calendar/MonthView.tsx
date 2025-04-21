import React from "react";
import {
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import type { CalendarEvent } from "./types";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function MonthView({
  currentDate,
  events,
  onEventClick,
}: MonthViewProps) {
  const findEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(parseISO(event.race_date), day));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const daysToDisplay = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysToDisplay.map((day) => {
          const dayEvents = findEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] p-2 border rounded-md ${
                isCurrentMonth ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div
                className={`text-sm ${
                  isCurrentMonth ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left text-xs p-1 rounded bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    <div className="font-medium">{event.race_name}</div>
                    <div className="text-gray-500">{event.track_name}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
