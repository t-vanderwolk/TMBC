interface InviteEmailPayload {
  to: string;
  code: string;
}

export const sendInviteEmail = async ({ to, code }: InviteEmailPayload) => {
  // Placeholder email sending logic.
  // eslint-disable-next-line no-console
  console.log(`Sending invite code ${code} to ${to}`);
};
