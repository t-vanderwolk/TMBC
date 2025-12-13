import { getUserOrThrow } from "@/lib/auth/getUser";
import { getCommunityRoom } from "@/lib/services/server/community.service";

import CommunityRoomThread from "../CommunityRoomThread";

type RoomPageProps = {
  params: {
    roomId: string;
  };
};

export default async function MemberCommunityRoomPage({ params }: RoomPageProps) {
  const user = await getUserOrThrow();
  const room = await getCommunityRoom(user.role, params.roomId);

  return (
    <div className="space-y-6">
      <CommunityRoomThread initialRoom={room} userRole={user.role} />
    </div>
  );
}
