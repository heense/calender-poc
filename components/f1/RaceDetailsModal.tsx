import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Flag } from "lucide-react";
import { Database } from "@/types/database.types";

type F1Race = Database["public"]["Tables"]["f1_races_2025"]["Row"];

interface RaceDetailsModalProps {
  race: F1Race | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RaceDetailsModal({
  race,
  open,
  onOpenChange,
}: RaceDetailsModalProps) {
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
