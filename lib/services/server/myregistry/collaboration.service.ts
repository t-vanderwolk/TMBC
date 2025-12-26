const MYREGISTRY_BASE_URL = "https://www.myregistry.com";

type BuildCollaborationInvitePayload = {
  registryId?: string | null;
  mentorEmail: string;
};

export type MyRegistryCollaborationGuidance = {
  guidedInviteUrl: string;
  mentorEmail: string;
  instructions: string[];
};

export const buildMyRegistryCollaboratorInviteUrl = ({
  registryId,
  mentorEmail,
}: BuildCollaborationInvitePayload): MyRegistryCollaborationGuidance => {
  const guidedInviteUrl = registryId
    ? `${MYREGISTRY_BASE_URL}/registry/${registryId}`
    : MYREGISTRY_BASE_URL;

  const instructions = [
    "Log in to MyRegistry.",
    "Open your registry settings and go to Collaborators.",
    "If you land on your public registry view, use the menu to reach Settings > Collaborators.",
    `Invite your mentor using ${mentorEmail}.`,
    'Save the invite, then return here and click "I added my mentor."',
  ];

  return { guidedInviteUrl, mentorEmail, instructions };
};
