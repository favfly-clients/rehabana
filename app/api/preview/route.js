import { redirectToPreviewURL } from "@prismicio/next";

import { createClient } from "../../../prismicio";
import { linkResolver } from "@/lib/conditions";

export async function GET(request) {
  const client = createClient();

  return await redirectToPreviewURL({ client, request, linkResolver });
}
