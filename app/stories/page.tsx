import StaysBrowser from "@/components/StaysBrowser";
// TEMP: lib/queries.ts бэлэн болмогц импортыг @/lib/queries руу шилжүүлнэ.
import { getStays } from "@/components/temp-data";

export default async function StoriesPage() {
  const stays = await getStays();
  return (
    <main>
      <StaysBrowser stays={stays} />
    </main>
  );
}