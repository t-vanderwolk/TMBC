export const getOfficialSenderEmail = () => {
  const email = process.env.OFFICIAL_SENDER_EMAIL;
  if (!email) {
    throw new Error('OFFICIAL_SENDER_EMAIL is not set');
  }
  return email;
};
