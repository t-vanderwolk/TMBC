import { getOfficialSenderEmail } from "@/lib/utils/server/officialSender";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://www.taylormadebaby.co";
const FROM_NAME = "Taylor-Made Baby Co.";

type SendInviteEmailOptions = {
  email: string;
  inviteCode: string;
};

export async function sendInviteEmail({ email, inviteCode }: SendInviteEmailOptions) {
  if (!SENDGRID_API_KEY) {
    throw new Error("Missing SendGrid API key");
  }

  const fromEmail = getOfficialSenderEmail();

  const message = [
    "Hi,",
    "",
    "Your invite request has been approved 🎉",
    "",
    "Use the invite code below to create your account:",
    "",
    `INVITE CODE: ${inviteCode}`,
    "",
    `Get started here: ${FRONTEND_URL}/?invite=${encodeURIComponent(inviteCode)}`,
    "",
    "This invite is unique to you.",
    "",
    "— Taylor-Made Baby Co.",
  ].join("\n");

  const payload = {
    personalizations: [
      {
        to: [{ email }],
      },
    ],
    from: {
      email: fromEmail,
      name: FROM_NAME,
    },
    subject: "You're Invited to Taylor-Made Baby Co.",
    content: [
      {
        type: "text/plain",
        value: message,
      },
    ],
  };

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SendGrid failed: ${response.status} ${text}`);
  }
}
