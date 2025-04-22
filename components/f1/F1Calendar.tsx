import { Race, CalendarView } from "../calendar/types";
import { RaceDetailsModal } from "./RaceDetailsModal";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface F1CalendarProps {
  races: Race[];
  view: CalendarView;
  format: "all" | "sprint" | "standard";
}

const getSeriesStyles = (race: Race) => {
  const seriesCode = race.race_series?.code;
  const isSprintRace = race.sprint_race;

  switch (seriesCode) {
    case "F1":
      return isSprintRace
        ? "border-red-500 border-2 bg-red-50"
        : "border-red-400 border bg-red-50/50";
    case "F2":
      return isSprintRace
        ? "border-blue-500 border-2 bg-blue-50"
        : "border-blue-400 border bg-blue-50/50";
    case "F3":
      return isSprintRace
        ? "border-green-500 border-2 bg-green-50"
        : "border-green-400 border bg-green-50/50";
    default:
      return "border-gray-200 border";
  }
};

const Legend = () => (
  <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
    <div className="text-sm font-medium">Legend:</div>
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-red-50/50 border border-red-400" />
        <span className="text-sm">F1</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-blue-50/50 border border-blue-400" />
        <span className="text-sm">F2</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-green-50/50 border border-green-400" />
        <span className="text-sm">F3</span>
      </div>
    </div>
    <div className="flex items-center gap-2 ml-4">
      <div className="w-4 h-4 rounded border-2 border-gray-400" />
      <span className="text-sm">Sprint Race</span>
    </div>
  </div>
);

export function F1Calendar({ races, view, format }: F1CalendarProps) {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRaceClick = (race: Race) => {
    setSelectedRace(race);
    setModalOpen(true);
  };

  const filteredRaces = races.filter((race) => {
    if (format === "all") return true;
    if (format === "sprint") return race.sprint_race;
    return !race.sprint_race;
  });

  const racesByMonth = filteredRaces.reduce<Record<string, Race[]>>(
    (acc, race) => {
      const month = new Date(race.race_date).toLocaleString("default", {
        month: "long",
      });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(race);
      return acc;
    },
    {}
  );

  return (
    <div>
      <Legend />
      {view === "year" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRaces.map((race) => (
            <Button
              key={race.id}
              onClick={() => handleRaceClick(race)}
              className={cn(
                "p-4 rounded-lg shadow hover:shadow-md transition-shadow w-full h-auto flex flex-col items-start text-left",
                getSeriesStyles(race)
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <div className="font-bold flex-grow">
                  {race.race_series?.name}
                </div>
                {race.sprint_race && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                    Sprint
                  </span>
                )}
              </div>
              <div className="text-sm opacity-75">
                {new Date(race.race_date).toLocaleDateString()}
              </div>
              <div className="font-medium">{race.race_name}</div>
              <div className="text-xs mt-1 opacity-75">
                {race.track_name}, {race.track_city}
              </div>
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(racesByMonth).map(([month, monthRaces]) => (
            <div key={month} className="space-y-4">
              <h2 className="text-2xl font-bold">{month}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthRaces.map((race) => (
                  <Button
                    key={race.id}
                    onClick={() => handleRaceClick(race)}
                    className={cn(
                      "p-4 rounded-lg shadow hover:shadow-md transition-shadow w-full h-auto flex flex-col items-start text-left",
                      getSeriesStyles(race)
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="font-bold flex-grow">
                        {race.race_series?.name}
                      </div>
                      {race.sprint_race && (
                        <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                          Sprint
                        </span>
                      )}
                    </div>
                    <div className="text-sm opacity-75">
                      {new Date(race.race_date).toLocaleDateString()}
                    </div>
                    <div className="font-medium">{race.race_name}</div>
                    <div className="text-xs mt-1 opacity-75">
                      {race.track_name}, {race.track_city}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <RaceDetailsModal
        race={selectedRace}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
