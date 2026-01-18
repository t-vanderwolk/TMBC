"use client";

import { useCallback, useMemo, useState } from "react";
import type { Role } from "@prisma/client";
import type {
  CommunityRoomDetail,
  CommunityRoomSummary,
} from "@/lib/services/server/community.service";
import CommunityRoomList from "@/components/community/CommunityRoomList";
import CommunityFeed from "@/components/community/CommunityFeed";

type CommunityLayoutProps = {
  rooms: CommunityRoomSummary[];
  initialRoom: CommunityRoomDetail;
  userRole: Role;
  mockRooms?: Record<string, CommunityRoomDetail>;
};

export default function CommunityLayout({
  rooms,
  initialRoom,
  userRole,
  mockRooms,
}: CommunityLayoutProps) {
  const [currentRoom, setCurrentRoom] = useState(initialRoom);
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoom.id);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);

  const handleRoomSelect = useCallback(
    async (roomId: string) => {
      if (roomId === selectedRoomId) return;
      setIsLoadingRoom(true);
      setRoomError(null);

      try {
        if (mockRooms && roomId in mockRooms) {
          const mockRoom = mockRooms[roomId];
          if (mockRoom) {
            setCurrentRoom(mockRoom);
          }
        } else {
          const response = await fetch(`/api/community/rooms/${roomId}`, {
            cache: "no-store",
            credentials: "include",
          });
          const payload = await response.json();

          if (!response.ok) {
            throw new Error(payload?.error ?? "Unable to open that room right now.");
          }
          if (!payload?.room) {
            throw new Error("Room did not return any data.");
          }

          setCurrentRoom(payload.room);
        }
        setSelectedRoomId(roomId);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Something interrupted that request. Try again.";
        setRoomError(message);
      } finally {
        setIsLoadingRoom(false);
      }
    },
    [selectedRoomId, mockRooms],
  );

  const moduleCount = useMemo(
    () => rooms.filter((room) => Boolean(room.moduleId)).length,
    [rooms],
  );

  return (
    <div className="space-y-8">
      <header className="space-y-3 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#C8A1B4]">Community</p>
        <h1 className="text-4xl font-serif text-[#3E2F35]">Community</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Learn together. Ask questions. Share what’s working. This space is calm, read-first, and
          always emotionally safe.
        </p>
        <p className="text-xs uppercase tracking-[0.4em] text-[#A4556A]">
          {moduleCount} module rooms · {rooms.length - moduleCount} general rooms
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.15fr]">
        <div>
          <CommunityRoomList
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleRoomSelect}
          />
        </div>
        <div>
          <CommunityFeed
            room={currentRoom}
            userRole={userRole}
            isLoading={isLoadingRoom}
            error={roomError}
          />
        </div>
      </div>
    </div>
  );
}
