"use client";

import React, { FormEvent, useState } from "react";

import { updateHouseholdDetails } from "@/app/(dashboard)/dashboard/settings/actions";

export type HouseholdData = {
  partnerName?: string | null;
  partnerHeight?: string | null;
  primaryCaregiver?: string | null;
  secondaryCaregiver?: string | null;
  petsAtHome?: boolean | null;
  petDetails?: string | null;
};

type HouseholdFormProps = {
  household?: HouseholdData;
};

export default function HouseholdForm({ household }: HouseholdFormProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    try {
      await updateHouseholdDetails(formData);
      setStatus("saved");
      setMessage("Household details saved.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to save household info.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.25)]"
    >
      <div className="space-y-1">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Partner & support</p>
        <p className="text-sm text-[#3E2F35]/70">
          Share the people who center you so we can suggest the right gear and mentors.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-[#3E2F35]">
          <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Partner / spouse</span>
          <input
            name="partnerName"
            defaultValue={household?.partnerName ?? ""}
            placeholder="Name"
            className="w-full rounded-2xl border border-[#E3D0D7] px-4 py-3 text-sm"
          />
        </label>
        <label className="space-y-1 text-sm text-[#3E2F35]">
          <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Partner height</span>
          <input
            name="partnerHeight"
            defaultValue={household?.partnerHeight ?? ""}
            placeholder="Height (e.g. 5'11&quot;)"
            className="w-full rounded-2xl border border-[#E3D0D7] px-4 py-3 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-[#3E2F35]">
          <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Primary caregiver</span>
          <input
            name="primaryCaregiver"
            defaultValue={household?.primaryCaregiver ?? ""}
            placeholder="Name or role"
            className="w-full rounded-2xl border border-[#E3D0D7] px-4 py-3 text-sm"
          />
        </label>
        <label className="space-y-1 text-sm text-[#3E2F35]">
          <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Secondary caregiver</span>
          <input
            name="secondaryCaregiver"
            defaultValue={household?.secondaryCaregiver ?? ""}
            placeholder="Name or role"
            className="w-full rounded-2xl border border-[#E3D0D7] px-4 py-3 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-3 text-sm text-[#3E2F35]">
          <input
            type="checkbox"
            name="petsAtHome"
            value="true"
            defaultChecked={Boolean(household?.petsAtHome)}
            className="h-4 w-4 rounded border border-[#C8A1B4]"
          />
          <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
            Pets at home
          </span>
        </label>
        <label className="space-y-1 text-sm text-[#3E2F35]">
          <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Pet details</span>
          <input
            name="petDetails"
            defaultValue={household?.petDetails ?? ""}
            placeholder="Type, names, care routines"
            className="w-full rounded-2xl border border-[#E3D0D7] px-4 py-3 text-sm"
          />
        </label>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-[#3E2F35]/70">
          This information stays in your onboarding profile and does not reset progress.
        </p>
        <button
          type="submit"
          className="rounded-full bg-[#C29EB3] px-6 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white"
        >
          Save household
        </button>
      </div>

      {message && (
        <p
          className={`text-xs uppercase tracking-[0.35em] ${
            status === "error" ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
