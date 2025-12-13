import { NextResponse } from 'next/server';

const formatMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Something went wrong';
};

export const communityErrorResponse = (error: unknown) => {
  const message = formatMessage(error);
  const normalized = message.toLowerCase();
  let status = 400;
  if (normalized.includes('not found')) status = 404;
  else if (normalized.includes('restricted') || normalized.includes('access')) status = 403;
  else if (normalized.includes('unauthorized')) status = 401;
  return NextResponse.json({ error: message }, { status });
};
