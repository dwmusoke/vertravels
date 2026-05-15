"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function AgencySelector({ value, onChange }: { value?: string; onChange: (id: string) => void }) {
  const [agencies, setAgencies] = useState<{ id: string; agency_name: string }[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("agencies")
      .select("id, agency_name")
      .order("agency_name")
      .then(({ data }: { data: { id: string; agency_name: string }[] | null }) => setAgencies(data || []));
  }, []);

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg"
    >
      <option value="">Select an agency...</option>
      {agencies.map((a) => (
        <option key={a.id} value={a.id}>
          {a.agency_name}
        </option>
      ))}
    </select>
  );
}
