export function generateInviteCode() {
  return 'TMB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}
