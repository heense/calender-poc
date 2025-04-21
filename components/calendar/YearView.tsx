import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from "date-fns";
import type { CalendarEvent } from "./types";

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function YearView({ currentDate, events, onEventClick }: YearViewProps) {
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const monthsInYear = eachMonthOfInterval({
    start: yearStart,
    end: yearEnd,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {monthsInYear.map((month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const calendarStart = startOfWeek(monthStart);
        const calendarEnd = endOfWeek(monthEnd);
        const daysToDisplay = eachDayOfInterval({
          start: calendarStart,
          end: calendarEnd,
        });

        return (
          <div key={month.toString()} className="border rounded-lg p-4 w-full">
            <h3 className="text-base font-semibold mb-3">
              {format(month, "MMMM")}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-xs text-gray-500 font-medium pb-2"
                >
                  {day}
                </div>
              ))}
              {daysToDisplay.map((day) => {
                const isCurrentMonth = isSameMonth(day, month);
                const dayEvents = events.filter((event) =>
                  isSameDay(parseISO(event.race_date), day)
                );

                return (
                  <button
                    key={day.toString()}
                    onClick={() => dayEvents[0] && onEventClick(dayEvents[0])}
                    className={`text-sm h-8 relative flex items-center justify-center
                      ${isCurrentMonth ? "text-gray-900" : "text-gray-300"}
                      ${dayEvents.length > 0 ? "hover:bg-gray-100 cursor-pointer" : "cursor-default"}
                      rounded-full
                    `}
                  >
                    {format(day, "d")}
                    {dayEvents.length > 0 && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-[2px]">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
