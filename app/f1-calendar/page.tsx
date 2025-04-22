"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/calendar/Calendar";
import Loading from "./loading";
import { Database } from "@/types/database.types";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Race = Database["public"]["Tables"]["races"]["Row"] & {
  race_series?: Database["public"]["Tables"]["race_series"]["Row"];
  driver_entries?: Array<{
    driver?: {
      first_name: string;
      last_name: string;
      nationality: string;
    };
    team?: {
      name: string;
    };
  }>;
};
type RaceSeries = Database["public"]["Tables"]["race_series"]["Row"];

export default function RacingCalendarPage() {
  const [races, setRaces] = useState<Race[]>([]);
  const [series, setSeries] = useState<RaceSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all series
      const { data: seriesData, error: seriesError } = await supabase
        .from("race_series")
        .select("*")
        .order("name");

      if (seriesError) throw seriesError;
      setSeries(seriesData);

      // Fetch all races with series information
      const { data: racesData, error: racesError } = await supabase
        .from("races")
        .select(
          `
          *,
          race_series (
            id,
            name,
            code
          )
        `
        )
        .order("race_date");

      if (racesError) throw racesError;
      setRaces(racesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setSeries([]);
      setRaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p>{error}</p>
          <button
            onClick={fetchData}
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
      <h1 className="text-4xl font-bold">Racing Calendar 2025</h1>
      <div className="mb-8">
        <Calendar events={races} />
      </div>
    </div>
  );
}

