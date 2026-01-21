import { NextRequest } from "next/server";

import { determinePlanRole, respondWithRole } from "../utils";

export async function GET(request: NextRequest) {
  const role = await determinePlanRole(request);
  return respondWithRole({ signals: [] }, role);
}
