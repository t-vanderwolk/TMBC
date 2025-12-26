import crypto from "crypto";

const INVITE_PREFIX = "TMBC-";
const INVITE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DEFAULT_CODE_LENGTH = 6;

export function generateInviteCode(length = DEFAULT_CODE_LENGTH) {
  const size = Math.min(Math.max(length, 6), 8);
  const bytes = crypto.randomBytes(size);
  let code = "";
  for (let i = 0; i < size; i += 1) {
    const byte = bytes[i] ?? 0;
    code += INVITE_ALPHABET[byte % INVITE_ALPHABET.length];
  }
  return `${INVITE_PREFIX}${code}`;
}
