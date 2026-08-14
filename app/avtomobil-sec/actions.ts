"use server";

import type { ConciergeIntent } from "@/lib/carbon-ai";
import {
  buildConciergeResponse,
  enrichConciergeResponseWithOpenAI,
  mergeIntent,
  parseIntentWithOpenAI,
} from "@/lib/carbon-ai";
import { getCarsForSite } from "@/lib/supabase/cars";

export async function runCarbonAiAction({
  message,
  currentIntent,
  patch,
}: {
  message?: string;
  currentIntent?: ConciergeIntent;
  patch?: Partial<ConciergeIntent>;
}) {
  const cars = await getCarsForSite();
  const patchedIntent = patch
    ? mergeIntent(currentIntent, patch)
    : currentIntent;
  const intent = message?.trim()
    ? await parseIntentWithOpenAI(message, cars, patchedIntent)
    : mergeIntent(patchedIntent, {});

  const rankedResponse = buildConciergeResponse(
    cars,
    intent,
  );

  return enrichConciergeResponseWithOpenAI(
    rankedResponse,
    message ?? "",
  );
}
