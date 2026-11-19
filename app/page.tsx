import Hero from "@/components/Hero";
import GuestInfoBanner from "@/components/GuestInfoBanner";
import AboutSection from "@/components/AboutSection";
import DairySection from "@/components/DairySection";
import MembershipSection from "@/components/MembershipSection";
import StaysSection from "@/components/StaysSection";
import HerdersSection from "@/components/HerdersSection";
// TEMP: lib/queries.ts бэлэн болмогц импортыг @/lib/queries руу шилжүүлнэ.
import {
  getProductPreviews,
  getStayPreviews,
  getHerderPreviews,
} from "@/components/temp-data";

export default async function Home() {
  const [products, stays, herders] = await Promise.all([
    getProductPreviews(),
    getStayPreviews(),
    getHerderPreviews(),
  ]);

  return (
    <main>
      <Hero />
      <GuestInfoBanner />
      <AboutSection />
      <DairySection products={products} />
      <StaysSection stays={stays} />
      <HerdersSection herders={herders} />
      <MembershipSection />
    </main>
  );
}