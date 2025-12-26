import { getOfficialSenderEmail } from "@/lib/utils/server/officialSender";

interface InviteEmailPayload {
  to: string;
  code: string;
}

export const sendInviteEmail = async ({ to, code }: InviteEmailPayload) => {
  const fromEmail = getOfficialSenderEmail();
  const message = `
From: ${fromEmail}
Subject: Your Invitation to Taylor-Made Baby Co
Welcome to Taylor-Made Baby Co. 🌸

Your personal invitation code is:

   ${code}

Verify your invitation:
https://taylormadebabyco.com/verify?code=${code}
`;

  // Placeholder email sending logic.
  // eslint-disable-next-line no-console
  console.log(`Sending invite code ${code} from ${fromEmail} to ${to}${message}`);
};
