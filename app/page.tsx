import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import DairySection from "@/components/DairySection";
import StaysSection from "@/components/StaysSection";
import HerdersSection from "@/components/HerdersSection";
// TEMP: lib/queries.ts бэлэн болмогц импортыг @/lib/queries руу шилжүүлнэ.
import { getProducts, getStays, getHerders } from "@/components/temp-data";

export default async function Home() {
  const [products, stays, herders] = await Promise.all([
    getProducts(),
    getStays(),
    getHerders(),
  ]);

  return (
    <main>
      <Hero />
      <DairySection products={products} />
      <HowItWorks />
      <StaysSection stays={stays} />
      <HerdersSection herders={herders} />
    </main>
  );
}