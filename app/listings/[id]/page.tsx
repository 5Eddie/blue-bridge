import Link from "next/link";
import ReviewsSection from "@/components/ReviewsSection";
import styles from "./listing-detail.module.css";

export default function ListingDetailPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/stories" className={styles.backLink}>← Back to family stays</Link>
        <section className={styles.profileHero} aria-labelledby="profile-title">
          <div className={styles.profilePhoto} role="img" aria-label="Horses gather at a steppe watering place" />
          <div className={styles.profileDetails}>
            <span className={styles.eyebrow}>HERDER FAMILY · ARKHANGAI</span>
            <h1 id="profile-title">A home beneath the wide Mongolian sky</h1>
            <p className={styles.hostName}>Hosted by the Bat-Erdene family</p>
            <p className={styles.location}>⌖ Tsenkher, Arkhangai Province</p>
            <div className={styles.profileMeta}>
              <span><strong>4.8</strong> ★ guest rating</span>
              <span>Traditional ger stay</span>
              <span>Meals with the family</span>
            </div>
          </div>
        </section>

        <ReviewsSection />
      </div>
    </main>
  );
}
