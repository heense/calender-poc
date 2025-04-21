import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  getMonth,
  getDaysInMonth,
  getDay,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RaceDetailsModal } from "./RaceDetailsModal";

type F1Race = {
  id: number;
  race_name: string;
  race_date: string;
  track_name: string;
  track_country: string;
  track_city: string;
  sprint_race: boolean;
};

interface F1CalendarProps {
  races: F1Race[];
}

export function F1Calendar({ races }: F1CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "year">("month");
  const [selectedRace, setSelectedRace] = useState<F1Race | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRaceClick = (race: F1Race) => {
    setSelectedRace(race);
    setModalOpen(true);
  };

  const findRacesForDay = (day: Date) => {
    return races.filter((race) => isSameDay(parseISO(race.race_date), day));
  };

  const findRacesForMonth = (month: Date) => {
    return races.filter(
      (race) => getMonth(parseISO(race.race_date)) === getMonth(month)
    );
  };

  const goToPrevious = () => {
    setCurrentDate((prev) => {
      if (view === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      } else {
        return new Date(prev.getFullYear() - 1, 0, 1);
      }
    });
  };

  const goToNext = () => {
    setCurrentDate((prev) => {
      if (view === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      } else {
        return new Date(prev.getFullYear() + 1, 0, 1);
      }
    });
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((day) => {
            const dayRaces = findRacesForDay(day);
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
                  {dayRaces.map((race) => (
                    <button
                      key={race.id}
                      onClick={() => handleRaceClick(race)}
                      className="w-full text-left text-xs p-1 rounded bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      <div className="font-medium">{race.race_name}</div>
                      <div className="text-gray-500">{race.track_name}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderYearView = () => {
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
          const daysInMonth = getDaysInMonth(month);
          const firstDayOfMonth = getDay(monthStart);
          const startDate = startOfWeek(monthStart);
          const endDate = endOfWeek(addDays(monthStart, daysInMonth - 1));
          const daysToDisplay = eachDayOfInterval({
            start: startDate,
            end: endDate,
          });
          const monthRaces = races.filter((race) =>
            isSameMonth(parseISO(race.race_date), month)
          );

          return (
            <div
              key={month.toString()}
              className="border rounded-lg p-4 w-full"
            >
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
                  const hasRace = races.some((race) =>
                    isSameDay(parseISO(race.race_date), day)
                  );
                  const dayRaces = races.filter((race) =>
                    isSameDay(parseISO(race.race_date), day)
                  );

                  return (
                    <button
                      key={day.toString()}
                      onClick={() =>
                        dayRaces[0] && handleRaceClick(dayRaces[0])
                      }
                      className={`text-sm h-8 relative flex items-center justify-center
                        ${isCurrentMonth ? "text-gray-900" : "text-gray-300"}
                        ${dayRaces.length > 0 ? "hover:bg-gray-100 cursor-pointer" : "cursor-default"}
                        rounded-full
                      `}
                    >
                      {format(day, "d")}
                      {dayRaces.length > 0 && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-[2px]">
                          {dayRaces.map((race) => (
                            <div
                              key={race.id}
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
  };

  return (
    <>
      <Card
        className={`p-6 ${view === "year" ? "w-full max-w-[1400px] mx-auto" : ""}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {view === "month"
              ? format(currentDate, "MMMM yyyy")
              : format(currentDate, "yyyy")}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevious}>
              Previous
            </Button>
            <div className="flex gap-1">
              <Button
                variant={view === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("month")}
              >
                Month
              </Button>
              <Button
                variant={view === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("year")}
              >
                Year
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={goToNext}>
              Next
            </Button>
          </div>
        </div>

        {view === "month" ? renderMonthView() : renderYearView()}
      </Card>

      <RaceDetailsModal
        race={selectedRace}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
