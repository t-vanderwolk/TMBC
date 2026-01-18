"use client";

import { useCallback, type ChangeEvent } from "react";
import type { Role } from "@prisma/client";
import type { CommunityRoomSummary } from "@/lib/services/server/community.service";

type CommunityRoomListProps = {
  rooms: CommunityRoomSummary[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
};

const roleLabel = (role: Role) => {
  if (role === "MENTOR") return "Mentor-moderated";
  if (role === "ADMIN") return "Admin space";
  return "Open to members";
};

export default function CommunityRoomList({
  rooms,
  selectedRoomId,
  onSelectRoom,
}: CommunityRoomListProps) {
  const handleSelectChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onSelectRoom(event.target.value);
    },
    [onSelectRoom],
  );

  if (rooms.length === 0) {
    return (
      <div className="rounded-[2.25rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-sm">
        <p className="text-sm text-[#3E2F35]/70">Rooms are being prepared for you.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Rooms</p>
          <h3 className="text-lg font-semibold text-[#3E2F35]">Community rooms</h3>
        </div>
        <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">
          {rooms.length} available
        </span>
      </div>

      <div className="space-y-3 hidden lg:block">
        {rooms.map((room) => {
          const isSelected = room.id === selectedRoomId;
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelectRoom(room.id)}
              aria-pressed={isSelected}
              className={`w-full rounded-[1.75rem] border px-4 py-4 text-left transition ${
                isSelected
                  ? "border-[#C8A1B4] bg-[#FDF7F6]"
                  : "border-[#E3C6D4] bg-white hover:border-[#C8A1B4]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                  {room.moduleTitle ? `${room.moduleTitle} · Module` : "Community room"}
                </p>
                <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">
                  {roleLabel(room.minRole)}
                </span>
              </div>
              <h4 className="mt-1 text-base font-semibold text-[#3E2F35]">{room.name}</h4>
              {room.description && (
                <p className="mt-1 text-sm text-[#3E2F35]/70">{room.description}</p>
              )}
              {room.latestPostSnippet && (
                <div className="mt-3 rounded-2xl border border-[#F1D5DA] bg-[#FFF8F6] p-3 text-sm text-[#3E2F35]/80">
                  <p className="font-semibold text-[#3E2F35]">Latest</p>
                  <p className="leading-relaxed">{room.latestPostSnippet}</p>
                  <p className="mt-1 text-[0.65rem] tracking-[0.3em] text-[#3E2F35]/60">
                    {room.latestPostAuthor || "Member"} ·{" "}
                    {room.latestPostAt
                      ? new Date(room.latestPostAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      : "moments ago"}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="lg:hidden">
        <label htmlFor="community-room-select" className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
          Choose a room
        </label>
        <div className="mt-2">
          <select
            id="community-room-select"
            className="w-full rounded-[1.35rem] border border-[#E3C6D4] bg-white px-4 py-3 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]"
            value={selectedRoomId}
            onChange={handleSelectChange}
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
