import DairyBrowser from "@/components/DairyBrowser";
// TEMP: lib/queries.ts бэлэн болмогц импортыг @/lib/queries руу шилжүүлнэ.
import { getProducts } from "@/components/temp-data";

export default async function ListingsPage() {
  const products = await getProducts();
  return (
    <main>
      <DairyBrowser products={products} />
    </main>
  );
}