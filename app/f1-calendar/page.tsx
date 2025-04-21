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

type F1Race = Database["public"]["Tables"]["f1_races_2025"]["Row"];

export default function F1CalendarPage() {
  const [races, setRaces] = useState<F1Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="mb-8">
        <Calendar events={races} />
      </div>
    </div>
  );
}
