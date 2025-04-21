"use client";

import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/calendar/Calendar";
import Loading from "./loading";
import { Database } from "@/types/database.types";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type RaceFormat = "all" | "sprint" | "standard";
type F1Race = Database["public"]["Tables"]["f1_races_2025"]["Row"];

export default function F1CalendarPage() {
  const [races, setRaces] = useState<F1Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [raceFormat, setRaceFormat] = useState<RaceFormat>("all");

  const fetchRaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("f1_races_2025")
        .select("*")
        .order("race_date", { ascending: true });

      if (error) {
        setError(error.message);
        setRaces([]);
      } else {
        setRaces(data || []);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setRaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaces();
  }, []);

  const filteredRaces = races.filter((race) => {
    const matchesSearch =
      race.race_name.toLowerCase().includes(search.toLowerCase()) ||
      race.track_name.toLowerCase().includes(search.toLowerCase()) ||
      race.track_country.toLowerCase().includes(search.toLowerCase()) ||
      race.track_city.toLowerCase().includes(search.toLowerCase());

    const matchesFormat =
      raceFormat === "all" ||
      (raceFormat === "sprint" && race.sprint_race === true) ||
      (raceFormat === "standard" && race.sprint_race !== true);

    return matchesSearch && matchesFormat;
  });

  const stats = {
    totalRaces: races.length,
    sprintRaces: races.filter((r) => r.sprint_race === true).length,
    countries: new Set(races.map((r) => r.track_country)).size,
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p>{error}</p>
          <button
            onClick={fetchRaces}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-4xl font-bold">F1 Calendar 2025</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Races</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRaces}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sprint Races</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sprintRaces}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.countries}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search races, tracks, or locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/2"
        />
        <Select
          value={raceFormat}
          onValueChange={(value: RaceFormat) => setRaceFormat(value)}
        >
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Race format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All formats</SelectItem>
            <SelectItem value="sprint">Sprint weekends</SelectItem>
            <SelectItem value="standard">Standard weekends</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-8">
        <Calendar events={filteredRaces} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grand Prix</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Circuit</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Format</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRaces.map((race) => (
              <TableRow key={race.id}>
                <TableCell className="font-medium">{race.race_name}</TableCell>
                <TableCell>
                  {format(new Date(race.race_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{race.track_name}</TableCell>
                <TableCell>{`${race.track_city}, ${race.track_country}`}</TableCell>
                <TableCell>
                  {race.sprint_race === true ? (
                    <Badge variant="secondary">Sprint</Badge>
                  ) : (
                    <Badge variant="outline">Standard</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredRaces.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No races found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
