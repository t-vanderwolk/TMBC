interface InviteEmailPayload {
  to: string;
  code: string;
}

export const sendInviteEmail = async ({ to, code }: InviteEmailPayload) => {
  const message = `
Subject: Your Invitation to Taylor-Made Baby Co
Welcome to Taylor-Made Baby Co. 🌸

Your personal invitation code is:

   ${code}

Verify your invitation:
https://taylormadebabyco.com/verify?code=${code}
`;

  // Placeholder email sending logic.
  // eslint-disable-next-line no-console
  console.log(`Sending invite code ${code} to ${to}${message}`);
};
