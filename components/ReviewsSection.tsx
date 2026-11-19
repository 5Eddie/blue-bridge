"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  clearCurrentUser,
  initializeDemoStorage,
  sampleReviews,
  saveDemoReviews,
  type DemoReview,
  type DemoUser,
} from "@/lib/offline-demo";
import styles from "./reviews-section.module.css";

type ReviewCategory = "cleanliness" | "hospitality" | "food" | "location" | "value";
type Review = DemoReview;

const categories: { id: ReviewCategory; label: string }[] = [
  { id: "cleanliness", label: "Cleanliness" },
  { id: "hospitality", label: "Hospitality" },
  { id: "food", label: "Food" },
  { id: "location", label: "Location" },
  { id: "value", label: "Value for money" },
];

function StarPicker({
  label,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  value: number;
  onChange: (rating: number) => void;
  compact?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div
      className={`${styles.starPicker} ${compact ? styles.compactPicker : ""}`}
      role="radiogroup"
      aria-label={label}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const rating = index + 1;
        return (
          <button
            key={rating}
            className={rating <= shown ? styles.starActive : styles.star}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
            onMouseEnter={() => setHovered(rating)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(rating)}
            onBlur={() => setHovered(0)}
            onClick={() => onChange(rating)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.displayStars} aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}<span>{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function fileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Unable to read one of the selected photos."));
    };
    reader.onerror = () => reject(new Error("Unable to read one of the selected photos."));
    reader.readAsDataURL(file);
  });
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [currentUser, setCurrentUser] = useState<Omit<DemoUser, "password"> | null>(null);
  const [sort, setSort] = useState("newest");
  const [withPhotos, setWithPhotos] = useState(false);
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<Record<ReviewCategory, number>>({
    cleanliness: 0,
    hospitality: 0,
    food: 0,
    location: 0,
    value: 0,
  });
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [replyFor, setReplyFor] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => initializeDemoStorage())
      .then((initial) => {
        if (!active) return;
        setReviews(initial.reviews);
        setCurrentUser(initial.currentUser);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setFormError(
          error instanceof Error ? error.message : "Unable to load saved demo data.",
        );
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => photos.forEach(({ url }) => URL.revokeObjectURL(url));
  }, [photos]);

  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length,
  }));
  const sortedReviews = useMemo(() => {
    const filtered = withPhotos ? reviews.filter((review) => review.photos.length > 0) : reviews;
    return [...filtered].sort((a, b) => {
      if (sort === "highest") return b.rating - a.rating || b.timestamp - a.timestamp;
      if (sort === "lowest") return a.rating - b.rating || b.timestamp - a.timestamp;
      return b.timestamp - a.timestamp;
    });
  }, [reviews, sort, withPhotos]);
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(sortedReviews.length / pageSize));
  const visibleReviews = sortedReviews.slice((page - 1) * pageSize, page * pageSize);

  function choosePhotos(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length > 3) {
      setFormError("Choose up to 3 photos.");
      event.target.value = "";
      return;
    }
    if (selected.some((file) => !file.type.startsWith("image/"))) {
      setFormError("Please choose image files only.");
      event.target.value = "";
      return;
    }
    setFormError("");
    setPhotos(selected.map((file) => ({ file, url: URL.createObjectURL(file) })));
  }

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!currentUser || (currentUser.role !== "tourist" && currentUser.role !== "buyer")) {
      setFormError("Please log in first as a tourist or buyer.");
      return;
    }
    if (!rating) {
      setFormError("Choose an overall star rating before submitting.");
      return;
    }
    if (!comment.trim()) {
      setFormError("Add a short comment about your experience.");
      return;
    }

    try {
      const today = new Date();
      const selectedCategories: Record<string, number> = {};
      categories.forEach(({ id }) => {
        if (categoryRatings[id]) selectedCategories[id] = categoryRatings[id];
      });
      const review: Review = {
        id: `review-${Date.now()}`,
        name: currentUser.name,
        country: "Your visit",
        flag: "🌍",
        date: today.toLocaleDateString("en", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        timestamp: today.getTime(),
        rating,
        comment: comment.trim(),
        photos: await Promise.all(photos.map(({ file }) => fileAsDataUrl(file))),
        categories: selectedCategories,
        verified: true,
      };

      const updatedReviews = [review, ...reviews];
      saveDemoReviews(updatedReviews);
      setReviews(updatedReviews);
      setSort("newest");
      setWithPhotos(false);
      setPage(1);
      setRating(0);
      setCategoryRatings({
        cleanliness: 0,
        hospitality: 0,
        food: 0,
        location: 0,
        value: 0,
      });
      setComment("");
      setNotice("Thank you — your review has been saved in this browser.");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to save your review in this browser.",
      );
    }
  }

  function submitReply(event: FormEvent<HTMLFormElement>, reviewId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const reply = String(formData.get("reply") ?? "").trim();
    if (!reply) return;
    try {
      const updatedReviews = reviews.map((review) =>
        review.id === reviewId ? { ...review, reply } : review,
      );
      saveDemoReviews(updatedReviews);
      setReviews(updatedReviews);
      setReplyFor(null);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to save the host reply.",
      );
    }
  }

  function logout() {
    try {
      clearCurrentUser();
      setCurrentUser(null);
      setNotice("You have been signed out.");
      setFormError("");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to sign out.");
    }
  }

  const canReview =
    currentUser?.role === "tourist" || currentUser?.role === "buyer";

  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>GUEST NOTES</span>
          <h2 id="reviews-title">Reviews from the steppe</h2>
          <p>Stories and helpful details shared by guests who stayed here.</p>
        </div>
        {canReview && (
          <a className={styles.writeLink} href="#write-review">
            Write a review <span aria-hidden="true">↗</span>
          </a>
        )}
        {currentUser && (
          <button className={styles.logoutButton} type="button" onClick={logout}>
            Sign out · {currentUser.name}
          </button>
        )}
      </div>

      <div className={styles.summary}>
        <div className={styles.average}>
          <strong>{average.toFixed(1)}</strong>
          <Stars rating={Math.round(average)} />
          <span>{reviews.length} guest reviews</span>
        </div>
        <div className={styles.breakdown} aria-label="Rating breakdown">
          {breakdown.map(({ stars, count }) => (
            <div className={styles.breakdownRow} key={stars}>
              <span>{stars} star</span>
              <div
                className={styles.progress}
                role="meter"
                aria-label={`${stars}-star reviews`}
                aria-valuemin={0}
                aria-valuemax={reviews.length || 1}
                aria-valuenow={count}
              >
                <span style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
              </div>
              <span className={styles.count}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {canReview ? (
        <form id="write-review" className={styles.reviewForm} onSubmit={submitReview}>
          <div className={styles.formHeading}>
            <div>
              <h3>Share your experience</h3>
              <p>Your notes help travelers and support local hosts.</p>
            </div>
            <span className={styles.formBadge}>✦ Guest voice</span>
          </div>

          <fieldset className={styles.overallRating}>
            <legend>Overall experience <span aria-hidden="true">*</span></legend>
            <StarPicker label="Overall rating" value={rating} onChange={setRating} />
          </fieldset>

          <details className={styles.categoryDetails}>
            <summary>Add optional category ratings</summary>
            <div className={styles.categoryGrid}>
              {categories.map(({ id, label }) => (
                <div className={styles.categoryRow} key={id}>
                  <span>{label}</span>
                  <StarPicker
                    compact
                    label={`${label} rating`}
                    value={categoryRatings[id]}
                    onChange={(value) =>
                      setCategoryRatings((current) => ({ ...current, [id]: value }))
                    }
                  />
                </div>
              ))}
            </div>
          </details>

          <label className={styles.commentField}>
            <span>Your review</span>
            <textarea
              value={comment}
              maxLength={500}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What made your stay memorable?"
              rows={4}
              required
            />
            <span className={styles.charCount} aria-live="polite">
              {comment.length}/500
            </span>
          </label>

          <div className={styles.uploadRow}>
            <div>
              <label className={styles.uploadLabel} htmlFor="review-photos">
                <span aria-hidden="true">＋</span> Add photos
              </label>
              <input
                className={styles.fileInput}
                id="review-photos"
                type="file"
                accept="image/*"
                multiple
                onChange={choosePhotos}
              />
              <span className={styles.uploadHint}>Optional · up to 3 images</span>
            </div>
            {photos.length > 0 && (
              <span className={styles.photoCount}>{photos.length} selected</span>
            )}
          </div>
          {photos.length > 0 && (
            <div className={styles.uploadPreviews} aria-label="Selected photos">
              {photos.map(({ file, url }) => (
                <div key={`${file.name}-${file.lastModified}`} className={styles.uploadPreview}>
                  <div
                    className={styles.uploadPreviewImage}
                    role="img"
                    aria-label={`Selected photo: ${file.name}`}
                    style={{ backgroundImage: `url("${url}")` }}
                  />
                </div>
              ))}
            </div>
          )}

          {formError && <p className={styles.formError} role="alert">{formError}</p>}
          {notice && <p className={styles.formSuccess} role="status">{notice}</p>}
          <button className={styles.submitButton} type="submit">Submit review <span>→</span></button>
        </form>
      ) : (
        <div className={styles.signInPrompt}>
          <div>
            <strong>Stayed here or bought from this family?</strong>
            <p>{currentUser ? "Switch to a tourist or buyer account to review." : "Please log in first as a tourist or buyer to write a review."}</p>
          </div>
          <Link href="/login">Sign in</Link>
        </div>
      )}

      <div className={styles.listHeading}>
        <div>
          <h3>Guest reviews</h3>
          <span>{sortedReviews.length} shown</span>
        </div>
        <div className={styles.filters}>
          <label className={styles.photoFilter}>
            <input
              type="checkbox"
              checked={withPhotos}
              onChange={(event) => {
                setWithPhotos(event.target.checked);
                setPage(1);
              }}
            />
            With photos
          </label>
          <label className={styles.sortLabel}>
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
              aria-label="Sort reviews"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </label>
        </div>
      </div>

      {visibleReviews.length > 0 ? (
        <div className={styles.reviewList}>
          {visibleReviews.map((review) => (
            <article className={styles.reviewCard} key={review.id}>
              <div className={styles.reviewer}>
                <span className={styles.avatar} aria-hidden="true">
                  {review.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </span>
                <div className={styles.reviewerInfo}>
                  <strong>{review.name}</strong>
                  <span>{review.flag} {review.country} <i aria-hidden="true">·</i> {review.date}</span>
                </div>
                {review.verified && <span className={styles.verified}>✓ Verified guest</span>}
              </div>
              <div className={styles.ratingLine}>
                <Stars rating={review.rating} />
                <span className={styles.ratingText}>{review.rating}.0</span>
              </div>
              {review.categories && Object.keys(review.categories).length > 0 && (
                <div className={styles.categoryScores}>
                  {categories.map(({ id, label }) =>
                    review.categories?.[id] ? (
                      <span key={id}>{label} <strong>{review.categories[id]}/5</strong></span>
                    ) : null,
                  )}
                </div>
              )}
              <p className={styles.comment}>{review.comment}</p>
              {review.photos.length > 0 && (
                <div className={styles.reviewPhotos} aria-label="Review photos">
                  {review.photos.map((photo, index) => (
                    <Image
                      key={`${review.id}-${index}`}
                      src={photo}
                      alt={`Photo shared by ${review.name}`}
                      width={200}
                      height={150}
                      unoptimized={photo.startsWith("blob:")}
                    />
                  ))}
                </div>
              )}
              {review.reply ? (
                <div className={styles.hostReply}>
                  <span className={styles.hostReplyMark}>↳</span>
                  <p><strong>Host reply</strong>{review.reply}</p>
                </div>
              ) : (
                <div className={styles.replyArea}>
                  <button
                    className={styles.replyButton}
                    type="button"
                    aria-expanded={replyFor === review.id}
                    onClick={() => setReplyFor(replyFor === review.id ? null : review.id)}
                  >
                    Reply as host
                  </button>
                  {replyFor === review.id && (
                    <form className={styles.replyForm} onSubmit={(event) => submitReply(event, review.id)}>
                      <label className={styles.visuallyHidden} htmlFor={`reply-${review.id}`}>Host reply</label>
                      <input id={`reply-${review.id}`} name="reply" maxLength={500} placeholder="Write a kind reply..." required />
                      <button type="submit">Post reply</button>
                    </form>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span aria-hidden="true">✦</span>
          <h3>No reviews with photos yet</h3>
          <p>Try another filter, or be the first to share a moment from your stay.</p>
        </div>
      )}

      {sortedReviews.length > pageSize && (
        <nav className={styles.pagination} aria-label="Review pages">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            ← Previous
          </button>
          <span>Page {page} of {pageCount}</span>
          <button
            type="button"
            disabled={page === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            Next →
          </button>
        </nav>
      )}
      {(formError || notice) && (
        <p className={formError ? styles.formError : styles.formSuccess} role={formError ? "alert" : "status"}>
          {formError || notice}
        </p>
      )}
      <p className={styles.demoNote}>Demo reviews and new reviews are stored in this browser only.</p>
    </section>
  );
}
