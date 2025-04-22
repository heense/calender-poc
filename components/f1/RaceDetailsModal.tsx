import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Flag } from "lucide-react";
import { Race } from "../calendar/types";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface DriverEntry {
  driver: {
    first_name: string | null;
    last_name: string | null;
    nationality: string | null;
  } | null;
  team: {
    name: string | null;
  } | null;
}

interface RaceDetailsModalProps {
  race: Race | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RaceDetailsModal({
  race,
  open,
  onOpenChange,
}: RaceDetailsModalProps) {
  const [danishDrivers, setDanishDrivers] = useState<DriverEntry[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDrivers() {
      if (!race?.race_series?.id) return;

      const { data, error } = await supabase
        .from("driver_entries")
        .select(
          `
          *,
          driver:drivers(*),
          team:teams(*)
        `
        )
        .eq("series_id", race.race_series.id)
        .eq("driver.nationality", "Denmark");

      if (!error && data) {
        setDanishDrivers(data);
      }
    }

    if (open) {
      fetchDrivers();
    }
  }, [race?.race_series?.id, open]);

  if (!race) return null;

  const raceDate = parseISO(race.race_date);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            {race.race_name}
            {race.sprint_race && (
              <Badge variant="secondary" className="ml-2">
                Sprint
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5" />
            <span>{format(raceDate, "EEEE, MMMM d, yyyy")}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Flag className="w-5 h-5" />
            <span>{race.track_name}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5" />
            <span>
              {race.track_city}, {race.track_country}
            </span>
          </div>

          {danishDrivers.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Danish Drivers</h3>
              <div className="space-y-1">
                {danishDrivers.map((entry) => {
                  if (!entry.driver || !entry.team) return null;
                  return (
                    <div
                      key={`${entry.driver.first_name}-${entry.driver.last_name}`}
                      className="text-sm text-gray-600"
                    >
                      {entry.driver.first_name} {entry.driver.last_name} -{" "}
                      {entry.team.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
