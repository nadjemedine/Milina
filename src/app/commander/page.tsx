import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import CheckoutClient from "./CheckoutClient";
import { WILAYAS } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CommanderPage() {
  const row = await db.select().from(settings).where(eq(settings.key, "shippingRates")).limit(1);
  let shippingRates: Record<string, { home: number; desk: number }> = {};
  
  if (row.length > 0 && row[0].value) {
    shippingRates = row[0].value as Record<string, { home: number; desk: number }>;
  } else {
    // defaults
    WILAYAS.forEach(w => {
      shippingRates[w] = { home: 0, desk: 0 };
    });
  }

  return <CheckoutClient shippingRates={shippingRates} />;
}
