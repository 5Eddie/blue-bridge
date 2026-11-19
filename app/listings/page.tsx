import DairyBrowser from "@/components/DairyBrowser";
// TEMP: lib/queries.ts бэлэн болмогц импортыг @/lib/queries руу шилжүүлнэ.
import { getProductPreviews } from "@/components/temp-data";

export default async function ListingsPage() {
  const products = await getProductPreviews();
  return (
    <main>
      <DairyBrowser products={products} />
    </main>
  );
}