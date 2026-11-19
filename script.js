/*
 * Offline demo authentication and reviews. Connect Firebase or Supabase here
 * later by replacing the localStorage helpers and form submit handlers.
 * Passwords are only base64-encoded for this demo; this is not secure storage.
 */
(() => {
  "use strict";

  const DEMO_IDENTITY = "demo@nomadstay.mn";
  const DEMO_PASSWORD = "Demo1234";
  const PAGE_SIZE = 3;
  const categories = [
    ["cleanliness", "Cleanliness", "Цэвэр байдал"],
    ["hospitality", "Hospitality", "Зочломтгой байдал"],
    ["food", "Food", "Хоол"],
    ["location", "Location", "Байршил"],
    ["value", "Value for money", "Үнийн тохироо"],
  ];

  const words = {
    en: {
      tagline: "A little closer to the nomadic way of life.",
      secure: "A more meaningful way to travel",
      welcome: "Welcome back",
      intro: "Sign in to find your place on the steppe.",
      identity: "Email or phone",
      password: "Password",
      remember: "Remember me",
      forgot: "Forgot password?",
      login: "Log in",
      or: "or continue with",
      google: "Continue with Google",
      facebook: "Continue with Facebook",
      new: "New to Nomad Stay?",
      createAccount: "Create an account",
      browseReviews: "Browse host reviews",
      haveAccount: "Already have an account?",
      signIn: "Sign in",
      createTitle: "Join the journey",
      createIntro: "Create an account to meet Mongolia, a little more personally.",
      name: "Your name",
      role: "I’m joining as a...",
      tourist: "Tourist",
      buyer: "Buyer",
      host: "Herder family / Ger camp host",
      create: "Create account",
      demo: "Demo login: demo@nomadstay.mn · Demo1234",
      loggingIn: "Logging in…",
      logout: "Log out",
      hostTitle: "A home beneath the wide Mongolian sky",
      guestRating: "guest rating",
      gerStay: "Traditional ger stay",
      familyMeals: "Meals with the family",
      guestNotes: "GUEST NOTES",
      reviewsTitle: "Reviews from the steppe",
      reviewsIntro: "Stories and helpful details shared by guests who stayed here.",
      writeReview: "Write a review ↗",
      guestReviews: "guest reviews",
      shareExperience: "Share your experience",
      reviewHelp: "Your notes help travelers and support local hosts.",
      guestVoice: "Guest voice",
      overall: "Overall experience *",
      optionalRatings: "Add optional category ratings",
      yourReview: "Your review",
      commentPlaceholder: "What made your stay memorable?",
      addPhotos: "Add photos",
      photoLimit: "Optional · up to 3 images",
      submitReview: "Submit review",
      guestReviewList: "Guest reviews",
      withPhotos: "With photos",
      sortBy: "Sort by",
      newest: "Newest",
      highest: "Highest rated",
      lowest: "Lowest rated",
      emptyTitle: "No reviews with photos yet",
      emptyText: "Try another filter, or be the first to share a moment from your stay.",
      localNote: "Demo reviews and new reviews are stored in this browser only.",
      verified: "Verified guest/buyer",
      hostReply: "Host reply",
      replyAsHost: "Reply as host",
      postReply: "Post reply",
      replyPlaceholder: "Write a kind reply...",
      pleaseLogin: "Please log in first as a tourist or buyer to write a review.",
      hostCannotReview: "Host accounts cannot write guest reviews. Sign in as a tourist or buyer.",
      signIn: "Sign in",
      noReviews: "No reviews found. Try a different filter.",
      previous: "← Previous",
      next: "Next →",
      page: (current, total) => `Page ${current} of ${total}`,
      shown: (count) => `${count} shown`,
      selected: (count) => `${count} selected`,
      successLogin: "You’re signed in. Welcome back!",
      successSignup: "Account created. Welcome to Nomad Stay!",
      successReview: "Thank you — your review has been saved in this browser.",
      successLogout: "You have been signed out.",
      wrongPassword: "Incorrect email or password / Имэйл эсвэл нууц үг буруу байна",
      invalidIdentity: "Enter a valid email address or phone number.",
      accountExists: "An account with that email or phone already exists.",
      invalidRole: "Choose a valid account type.",
      chooseRating: "Choose an overall star rating before submitting.",
      enterComment: "Add a short comment about your experience.",
      tooManyPhotos: "Choose up to 3 photos.",
      imageOnly: "Please choose image files only.",
      storageError: "Browser storage is unavailable or contains invalid data.",
      saveError: "Unable to save in this browser. Check storage space or privacy settings.",
      fileError: "Unable to read one of the selected photos.",
      comingSoon: "Coming soon / Удахгүй нэмэгдэнэ",
      offlineRecovery: "Password recovery is unavailable offline. Use the demo account or create an account.",
      genericError: "Something went wrong. Please try again.",
    },
    mn: {
      tagline: "Нүүдэлчин ахуйтай илүү ойр танилцаарай.",
      secure: "Утга учиртай аялах шинэ зам",
      welcome: "Тавтай морил",
      intro: "Тал нутгийн аяллаа үргэлжлүүлэхийн тулд нэвтэрнэ үү.",
      identity: "И-мэйл эсвэл утас",
      password: "Нууц үг",
      remember: "Намайг сана",
      forgot: "Нууц үгээ мартсан уу?",
      login: "Нэвтрэх",
      or: "эсвэл үргэлжлүүлэх",
      google: "Google-ээр үргэлжлүүлэх",
      facebook: "Facebook-ээр үргэлжлүүлэх",
      new: "Nomad Stay-д шинээр ирсэн үү?",
      createAccount: "Бүртгэл үүсгэх",
      browseReviews: "Айлын сэтгэгдэл үзэх",
      haveAccount: "Бүртгэлтэй юу?",
      signIn: "Нэвтрэх",
      createTitle: "Аялалд нэгдээрэй",
      createIntro: "Монгол орныг илүү ойроос мэдрэх бүртгэл үүсгээрэй.",
      name: "Таны нэр",
      role: "Та хэнээр нэгдэх вэ?",
      tourist: "Аялагч",
      buyer: "Худалдан авагч",
      host: "Малчин айл / гэр буудлын эзэн",
      create: "Бүртгэл үүсгэх",
      demo: "Туршилтын бүртгэл: demo@nomadstay.mn · Demo1234",
      loggingIn: "Нэвтэрч байна…",
      logout: "Гарах",
      hostTitle: "Монголын уудам тал дахь айл",
      guestRating: "зочдын үнэлгээ",
      gerStay: "Уламжлалт гэрт байрлах",
      familyMeals: "Айлын хоол",
      guestNotes: "ЗОЧДЫН СЭТГЭГДЭЛ",
      reviewsTitle: "Тал нутгийн сэтгэгдлүүд",
      reviewsIntro: "Энд байрласан зочдын түүх, хэрэгтэй зөвлөгөөг уншаарай.",
      writeReview: "Сэтгэгдэл бичих ↗",
      guestReviews: "зочны сэтгэгдэл",
      shareExperience: "Туршлагаа хуваалцаарай",
      reviewHelp: "Таны сэтгэгдэл аялагчдад тусалж, нутгийн айлыг дэмжинэ.",
      guestVoice: "Зочны сэтгэгдэл",
      overall: "Ерөнхий үнэлгээ *",
      optionalRatings: "Нэмэлт ангиллын үнэлгээ",
      yourReview: "Таны сэтгэгдэл",
      commentPlaceholder: "Таны аяллыг юу онцгой болгосон бэ?",
      addPhotos: "Зураг нэмэх",
      photoLimit: "Сонголтоор · 3 хүртэл зураг",
      submitReview: "Сэтгэгдэл илгээх",
      guestReviewList: "Зочдын сэтгэгдэл",
      withPhotos: "Зурагтай",
      sortBy: "Эрэмбэлэх",
      newest: "Шинэ нь эхэндээ",
      highest: "Өндөр үнэлгээтэй",
      lowest: "Бага үнэлгээтэй",
      emptyTitle: "Зурагтай сэтгэгдэл алга",
      emptyText: "Шүүлтээ өөрчлөх эсвэл аяллынхаа дурсамжийг хуваалцаарай.",
      localNote: "Жишээ болон шинэ сэтгэгдлүүд зөвхөн энэ хөтөчид хадгалагдана.",
      verified: "Баталгаажсан зочин/худалдан авагч",
      hostReply: "Эзний хариу",
      replyAsHost: "Эзнээр хариу бичих",
      postReply: "Хариу илгээх",
      replyPlaceholder: "Хариу бичих...",
      pleaseLogin: "Сэтгэгдэл бичихийн тулд аялагч эсвэл худалдан авагчаар нэвтэрнэ үү.",
      hostCannotReview: "Эзний бүртгэлээр зочны сэтгэгдэл бичих боломжгүй.",
      signIn: "Нэвтрэх",
      noReviews: "Сэтгэгдэл олдсонгүй. Шүүлтээ өөрчилнө үү.",
      previous: "← Өмнөх",
      next: "Дараах →",
      page: (current, total) => `${total}-с ${current}-р хуудас`,
      shown: (count) => `${count} харуулж байна`,
      selected: (count) => `${count} зураг сонгосон`,
      successLogin: "Амжилттай нэвтэрлээ. Тавтай морил!",
      successSignup: "Бүртгэл үүслээ. Тавтай морил!",
      successReview: "Баярлалаа — сэтгэгдэл энэ хөтөчид хадгалагдлаа.",
      successLogout: "Та системээс гарлаа.",
      wrongPassword: "Имэйл эсвэл нууц үг буруу байна",
      invalidIdentity: "Зөв и-мэйл эсвэл утасны дугаар оруулна уу.",
      accountExists: "Энэ и-мэйл эсвэл утсаар бүртгэл үүссэн байна.",
      invalidRole: "Бүртгэлийн төрлөө сонгоно уу.",
      chooseRating: "Ерөнхий одон үнэлгээгээ сонгоно уу.",
      enterComment: "Аяллынхаа тухай товч сэтгэгдэл бичнэ үү.",
      tooManyPhotos: "3 хүртэл зураг сонгоно уу.",
      imageOnly: "Зөвхөн зургийн файл сонгоно уу.",
      storageError: "Хөтчийн хадгалалт боломжгүй эсвэл өгөгдөл буруу байна.",
      saveError: "Энэ хөтөчид хадгалж чадсангүй. Хадгалах зай болон нууцлалын тохиргоог шалгана уу.",
      fileError: "Сонгосон зургийг уншиж чадсангүй.",
      comingSoon: "Удахгүй нэмэгдэнэ",
      offlineRecovery: "Офлайн хувилбарт нууц үг сэргээх боломжгүй. Туршилтын бүртгэл эсвэл шинээр бүртгүүлнэ үү.",
      genericError: "Алдаа гарлаа. Дахин оролдоно уу.",
    },
  };

  const demoReviews = [
    {
      id: "review-1",
      name: "Emma Wilson",
      country: "United Kingdom",
      flag: "🇬🇧",
      date: "October 12, 2026",
      timestamp: new Date("2026-10-12").getTime(),
      rating: 5,
      comment: "A beautiful, grounding few days. We learned to make airag, rode out across the valley, and were welcomed like old friends. I still think about the quiet mornings here.",
      photos: ["public/images/mongolia-bg.png"],
      verified: true,
    },
    {
      id: "review-2",
      name: "Lucas Martin",
      country: "France",
      flag: "🇫🇷",
      date: "September 26, 2026",
      timestamp: new Date("2026-09-26").getTime(),
      rating: 5,
      comment: "The family was incredibly kind and the homemade food was wonderful. The ger was comfortable, clean, and much warmer than we expected.",
      photos: [],
      verified: true,
      reply: "Thank you for staying with us, Lucas. We loved sharing dinner and stories with you!",
    },
    {
      id: "review-3",
      name: "Hana Sato",
      country: "Japan",
      flag: "🇯🇵",
      date: "September 8, 2026",
      timestamp: new Date("2026-09-08").getTime(),
      rating: 4,
      comment: "A memorable and very genuine experience. The location is remote, so bring a book and enjoy the stars. Breakfast was a highlight.",
      photos: ["public/images/mongolia-bg.png"],
      verified: true,
    },
    {
      id: "review-4",
      name: "Oliver Chen",
      country: "Singapore",
      flag: "🇸🇬",
      date: "August 19, 2026",
      timestamp: new Date("2026-08-19").getTime(),
      rating: 5,
      comment: "Our host showed us how the horses are cared for and made us feel at home from the first cup of tea. Exactly the kind of travel we hoped for.",
      photos: [],
      verified: true,
    },
    {
      id: "review-5",
      name: "Sofia Garcia",
      country: "Spain",
      flag: "🇪🇸",
      date: "August 2, 2026",
      timestamp: new Date("2026-08-02").getTime(),
      rating: 5,
      comment: "We came for one night and wished we had booked three. Lovely hosts, peaceful surroundings, and delicious fresh dairy.",
      photos: [],
      verified: true,
    },
  ];

  const elements = {
    loginPage: document.getElementById("login-page"),
    profilePage: document.getElementById("profile-page"),
    loginForm: document.getElementById("login-form"),
    signupForm: document.getElementById("signup-form"),
    authTitle: document.getElementById("auth-title"),
    authIntro: document.getElementById("auth-intro"),
    authFeedback: document.getElementById("auth-feedback"),
    loginButton: document.getElementById("login-button"),
    switchPrompt: document.getElementById("switch-prompt"),
    demoInfo: document.querySelector(".demo-info"),
    socials: document.querySelector(".social-buttons"),
    signedInAs: document.getElementById("signed-in-as"),
    averageRating: document.getElementById("average-rating"),
    averageStars: document.getElementById("average-stars"),
    reviewCount: document.getElementById("review-count"),
    breakdown: document.getElementById("rating-breakdown"),
    reviewList: document.getElementById("review-list"),
    shownCount: document.getElementById("shown-count"),
    emptyState: document.getElementById("empty-state"),
    pagination: document.getElementById("pagination"),
    reviewForm: document.getElementById("review-form"),
    reviewMessage: document.getElementById("review-message"),
    comment: document.getElementById("review-comment"),
    commentCount: document.getElementById("comment-count"),
    photoInput: document.getElementById("review-photos"),
    photoCount: document.getElementById("photo-count"),
    previews: document.getElementById("upload-previews"),
    toast: document.getElementById("toast"),
    sort: document.getElementById("sort-reviews"),
    photosFilter: document.getElementById("photos-filter"),
  };

  let locale = "en";
  let authMode = "login";
  let users = [];
  let reviews = [];
  let currentUser = null;
  let selectedRating = 0;
  let categoryRatings = {};
  let selectedPhotos = [];
  let currentPage = 1;
  let toastTimer;

  function text(key) {
    return words[locale][key];
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("visible"), 3200);
  }

  function showAuthFeedback(message, isSuccess) {
    elements.authFeedback.textContent = message;
    elements.authFeedback.className = `feedback ${isSuccess ? "success" : "error"}`;
    elements.authFeedback.hidden = false;
  }

  function showReviewFeedback(message, isSuccess) {
    elements.reviewMessage.textContent = message;
    elements.reviewMessage.className = `form-message ${isSuccess ? "success" : "error"}`;
    elements.reviewMessage.hidden = false;
  }

  function readStorage(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      throw new Error(text("storageError"));
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      throw new Error(text("saveError"));
    }
  }

  function encodePassword(password) {
    const bytes = new TextEncoder().encode(password);
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function withoutPassword(user) {
    return {
      id: user.id,
      name: user.name,
      identity: user.identity,
      role: user.role,
    };
  }

  function initializeStorage() {
    const savedUsers = readStorage("users");
    users = Array.isArray(savedUsers) ? savedUsers : [];
    if (!users.some((user) => String(user.identity).toLowerCase() === DEMO_IDENTITY)) {
      users.push({
        id: "demo-tourist",
        name: "Demo Tourist",
        identity: DEMO_IDENTITY,
        password: encodePassword(DEMO_PASSWORD),
        role: "tourist",
      });
      writeStorage("users", users);
    } else if (!Array.isArray(savedUsers)) {
      writeStorage("users", users);
    }

    const savedReviews = readStorage("reviews");
    reviews = Array.isArray(savedReviews) ? savedReviews : demoReviews;
    if (!Array.isArray(savedReviews)) writeStorage("reviews", reviews);

    const savedUser = readStorage("currentUser");
    currentUser = savedUser && typeof savedUser.identity === "string" ? savedUser : null;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
  }

  function setAuthMode(mode) {
    authMode = mode;
    const isSignup = mode === "signup";
    elements.loginForm.hidden = isSignup;
    elements.signupForm.hidden = !isSignup;
    elements.authFeedback.hidden = true;
    elements.authTitle.textContent = text(isSignup ? "createTitle" : "welcome");
    elements.authIntro.textContent = text(isSignup ? "createIntro" : "intro");
    elements.demoInfo.hidden = isSignup;
    elements.socials.hidden = isSignup;
    elements.loginButton.querySelector("[data-copy='login']").textContent = text("login");
    elements.switchPrompt.querySelector("span").textContent = text(isSignup ? "haveAccount" : "new");
    elements.switchPrompt.querySelector("button").textContent = text(isSignup ? "signIn" : "createAccount");
  }

  function setBusy(form, busy) {
    const button = form.querySelector(".primary-button");
    button.disabled = busy;
    button.querySelector(".spinner").hidden = !busy;
    const arrow = button.querySelector(".arrow");
    if (arrow) arrow.hidden = busy;
    const label = button.querySelector("[data-copy]");
    if (label) label.textContent = busy ? text("loggingIn") : text(authMode === "signup" ? "create" : "login");
  }

  function showProfile() {
    elements.loginPage.hidden = true;
    elements.profilePage.hidden = false;
    elements.signedInAs.textContent = currentUser
      ? `${currentUser.name} · ${currentUser.role}`
      : (locale === "mn" ? "Зочин" : "Browsing as guest");
    document.querySelector('[data-action="logout"]').textContent = text(currentUser ? "logout" : "signIn");
    renderReviews();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showLogin() {
    elements.profilePage.hidden = true;
    elements.loginPage.hidden = false;
    setAuthMode("login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validIdentity(identity) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity) || /^\+?[\d ()-]{7,}$/.test(identity);
  }

  function delay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function login(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const identity = String(formData.get("identity") || "").trim();
    const password = String(formData.get("password") || "");
    setBusy(form, true);
    elements.authFeedback.hidden = true;

    try {
      await delay(650);
      const match = users.find((user) =>
        String(user.identity).toLowerCase() === identity.toLowerCase() &&
        user.password === encodePassword(password),
      );
      if (!match) {
        showAuthFeedback(text("wrongPassword"), false);
        return;
      }
      currentUser = withoutPassword(match);
      writeStorage("currentUser", currentUser);
      showAuthFeedback(text("successLogin"), true);
      await delay(350);
      showProfile();
    } catch (error) {
      showAuthFeedback(error instanceof Error ? error.message : text("genericError"), false);
    } finally {
      setBusy(form, false);
    }
  }

  async function register(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const identity = String(formData.get("identity") || "").trim();
    const password = String(formData.get("password") || "");
    const role = String(formData.get("role") || "");
    setBusy(form, true);
    elements.authFeedback.hidden = true;

    try {
      await delay(600);
      if (!validIdentity(identity)) throw new Error(text("invalidIdentity"));
      if (!["tourist", "buyer", "host"].includes(role)) throw new Error(text("invalidRole"));
      if (users.some((user) => String(user.identity).toLowerCase() === identity.toLowerCase())) {
        throw new Error(text("accountExists"));
      }
      const user = {
        id: `user-${Date.now()}`,
        name,
        identity,
        password: encodePassword(password),
        role,
      };
      users = [...users, user];
      writeStorage("users", users);
      currentUser = withoutPassword(user);
      writeStorage("currentUser", currentUser);
      showAuthFeedback(text("successSignup"), true);
      await delay(350);
      showProfile();
    } catch (error) {
      showAuthFeedback(error instanceof Error ? error.message : text("genericError"), false);
    } finally {
      setBusy(form, false);
    }
  }

  function makeStarPicker(container, key, label, compact = false) {
    container.classList.toggle("compact", compact);
    container.setAttribute("aria-label", label);
    container.innerHTML = "";
    for (let value = 1; value <= 5; value += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-label", `${value} ${value === 1 ? "star" : "stars"}`);
      button.textContent = "★";
      button.addEventListener("mouseenter", () => paintStars(container, key, value, true));
      button.addEventListener("mouseleave", () => paintStars(container, key, 0, false));
      button.addEventListener("focus", () => paintStars(container, key, value, true));
      button.addEventListener("blur", () => paintStars(container, key, 0, false));
      button.addEventListener("click", () => {
        if (key === "overall") selectedRating = value;
        else categoryRatings[key] = value;
        paintStars(container, key, 0, false);
      });
      container.appendChild(button);
    }
    paintStars(container, key, 0, false);
  }

  function paintStars(container, key, hoverValue, isHover) {
    const value = isHover ? hoverValue : key === "overall" ? selectedRating : categoryRatings[key] || 0;
    Array.from(container.children).forEach((button, index) => {
      button.classList.toggle("active", index < value);
      button.setAttribute("aria-checked", String(index + 1 === value));
    });
  }

  function setupRatingPickers() {
    makeStarPicker(document.getElementById("overall-stars"), "overall", "Overall rating");
    const categoryContainer = document.getElementById("category-ratings");
    categoryContainer.innerHTML = "";
    categories.forEach(([id, labelEn, labelMn]) => {
      const row = document.createElement("div");
      row.className = "category-row";
      const label = locale === "mn" ? labelMn : labelEn;
      row.innerHTML = `<span>${escapeHtml(label)}</span><div class="star-picker" role="radiogroup"></div>`;
      makeStarPicker(row.querySelector(".star-picker"), id, label, true);
      categoryContainer.appendChild(row);
    });
  }

  function ratingText(rating) {
    return `${"★".repeat(rating)}<span>${"★".repeat(5 - rating)}</span>`;
  }

  function renderBreakdown() {
    const count = reviews.length;
    const average = count ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / count : 0;
    elements.averageRating.textContent = average.toFixed(1);
    elements.averageStars.innerHTML = ratingText(Math.round(average));
    elements.averageStars.setAttribute("aria-label", `${average.toFixed(1)} out of 5 stars`);
    elements.reviewCount.textContent = String(count);
    document.getElementById("host-average").textContent = average.toFixed(1);
    elements.breakdown.innerHTML = [5, 4, 3, 2, 1].map((stars) => {
      const amount = reviews.filter((review) => Number(review.rating) === stars).length;
      const width = count ? (amount / count) * 100 : 0;
      return `<div class="breakdown-row">
        <span>${stars} star</span>
        <div class="progress" role="meter" aria-label="${stars}-star reviews" aria-valuemin="0" aria-valuemax="${count || 1}" aria-valuenow="${amount}">
          <span style="width:${width}%"></span>
        </div>
        <span class="breakdown-count">${amount}</span>
      </div>`;
    }).join("");
  }

  function categoryMarkup(review) {
    if (!review.categories) return "";
    return categories.map(([id, labelEn, labelMn]) => {
      const value = Number(review.categories[id] || 0);
      if (!value) return "";
      return `<span>${escapeHtml(locale === "mn" ? labelMn : labelEn)} <strong>${value}/5</strong></span>`;
    }).join("");
  }

  function reviewMarkup(review) {
    const initials = String(review.name || "Guest").split(/\s+/).map((part) => part[0] || "").join("").slice(0, 2);
    const photos = Array.isArray(review.photos) ? review.photos : [];
    const photoMarkup = photos.map((photo, index) =>
      `<img src="${escapeHtml(photo)}" alt="Photo shared by ${escapeHtml(review.name)} ${index + 1}">`,
    ).join("");
    const replyMarkup = review.reply
      ? `<div class="host-reply"><span aria-hidden="true">↳</span><p><strong>${text("hostReply")}</strong>${escapeHtml(review.reply)}</p></div>`
      : currentUser && currentUser.role === "host"
        ? `<div class="reply-area">
             <button class="reply-button" type="button" data-reply-toggle="${escapeHtml(review.id)}">${text("replyAsHost")}</button>
             <form class="reply-form" data-reply-form="${escapeHtml(review.id)}" hidden>
               <label class="visually-hidden" for="reply-${escapeHtml(review.id)}">${text("hostReply")}</label>
               <input id="reply-${escapeHtml(review.id)}" name="reply" maxlength="500" placeholder="${text("replyPlaceholder")}" required>
               <button type="submit">${text("postReply")}</button>
             </form>
           </div>`
        : "";
    return `<article class="review-card">
      <div class="reviewer">
        <span class="avatar" aria-hidden="true">${escapeHtml(initials)}</span>
        <div class="reviewer-info">
          <strong>${escapeHtml(review.name)}</strong>
          <span>${escapeHtml(review.flag || "🌍")} ${escapeHtml(review.country || "")} · ${escapeHtml(review.date || "")}</span>
        </div>
        ${review.verified ? `<span class="verified">✓ ${text("verified")}</span>` : ""}
      </div>
      <div class="rating-line"><span class="stars" aria-label="${review.rating} out of 5 stars">${"★".repeat(Number(review.rating))}</span><span class="rating-text">${Number(review.rating).toFixed(1)}</span></div>
      <div class="category-scores">${categoryMarkup(review)}</div>
      <p class="review-comment">${escapeHtml(review.comment)}</p>
      ${photoMarkup ? `<div class="review-photos" aria-label="Review photos">${photoMarkup}</div>` : ""}
      ${replyMarkup}
    </article>`;
  }

  function renderReviews() {
    renderBreakdown();
    const sort = elements.sort.value;
    const withPhotos = elements.photosFilter.checked;
    const filtered = reviews.filter((review) => !withPhotos || (Array.isArray(review.photos) && review.photos.length > 0));
    filtered.sort((a, b) => {
      if (sort === "highest") return Number(b.rating) - Number(a.rating) || b.timestamp - a.timestamp;
      if (sort === "lowest") return Number(a.rating) - Number(b.rating) || b.timestamp - a.timestamp;
      return b.timestamp - a.timestamp;
    });
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, pageCount);
    const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    elements.shownCount.textContent = text("shown")(filtered.length);
    elements.reviewList.innerHTML = visible.map(reviewMarkup).join("");
    elements.emptyState.hidden = visible.length > 0;
    elements.reviewList.hidden = visible.length === 0;
    elements.pagination.innerHTML = filtered.length > PAGE_SIZE
      ? `<button type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>${text("previous")}</button>
         <span>${text("page")(currentPage, pageCount)}</span>
         <button type="button" data-page="${currentPage + 1}" ${currentPage === pageCount ? "disabled" : ""}>${text("next")}</button>`
      : "";
  }

  function renderPhotoPreviews() {
    elements.previews.innerHTML = "";
    elements.photoCount.textContent = selectedPhotos.length ? text("selected")(selectedPhotos.length) : "";
    selectedPhotos.forEach((file) => {
      try {
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        image.alt = `Selected photo: ${file.name}`;
        elements.previews.appendChild(image);
      } catch {
        showReviewFeedback(text("fileError"), false);
      }
    });
  }

  function readPhoto(file) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error(text("fileError")));
        reader.onerror = () => reject(new Error(text("fileError")));
        reader.readAsDataURL(file);
      } catch {
        reject(new Error(text("fileError")));
      }
    });
  }

  async function submitReview(event) {
    event.preventDefault();
    elements.reviewMessage.hidden = true;
    if (!currentUser || (currentUser.role !== "tourist" && currentUser.role !== "buyer")) {
      showReviewFeedback(currentUser ? text("hostCannotReview") : text("pleaseLogin"), false);
      return;
    }
    if (!selectedRating) {
      showReviewFeedback(text("chooseRating"), false);
      return;
    }
    if (!elements.comment.value.trim()) {
      showReviewFeedback(text("enterComment"), false);
      return;
    }

    const submitButton = elements.reviewForm.querySelector(".submit-review");
    submitButton.disabled = true;
    try {
      const photoData = await Promise.all(selectedPhotos.map(readPhoto));
      const categoriesSaved = {};
      Object.entries(categoryRatings).forEach(([key, value]) => {
        if (value) categoriesSaved[key] = value;
      });
      const now = new Date();
      const newReview = {
        id: `review-${Date.now()}`,
        name: currentUser.name,
        country: "Your visit",
        flag: "🌍",
        date: now.toLocaleDateString(locale === "mn" ? "mn-MN" : "en-US", { month: "long", day: "numeric", year: "numeric" }),
        timestamp: now.getTime(),
        rating: selectedRating,
        comment: elements.comment.value.trim(),
        photos: photoData,
        categories: categoriesSaved,
        verified: true,
      };
      const nextReviews = [newReview, ...reviews];
      writeStorage("reviews", nextReviews);
      reviews = nextReviews;
      selectedRating = 0;
      categoryRatings = {};
      selectedPhotos = [];
      elements.comment.value = "";
      elements.commentCount.textContent = "0";
      elements.photoInput.value = "";
      elements.previews.innerHTML = "";
      elements.photoCount.textContent = "";
      setupRatingPickers();
      currentPage = 1;
      elements.sort.value = "newest";
      elements.photosFilter.checked = false;
      renderReviews();
      showReviewFeedback(text("successReview"), true);
    } catch (error) {
      showReviewFeedback(error instanceof Error ? error.message : text("genericError"), false);
    } finally {
      submitButton.disabled = false;
    }
  }

  function logout() {
    try {
      localStorage.removeItem("currentUser");
      currentUser = null;
      showToast(text("successLogout"));
      showLogin();
    } catch {
      showToast(text("saveError"));
    }
  }

  function applyLanguage(nextLocale) {
    locale = nextLocale;
    document.documentElement.lang = locale;
    document.querySelectorAll("[data-copy]").forEach((element) => {
      const key = element.dataset.copy;
      if (words[locale][key]) element.textContent = text(key);
    });
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === locale));
    });
    document.querySelectorAll("[data-toggle-password]").forEach((button) => {
      const input = button.parentElement.querySelector("input");
      const visible = input.type === "text";
      button.textContent = visible ? (locale === "mn" ? "Нуух" : "Hide") : (locale === "mn" ? "Харах" : "Show");
      button.setAttribute("aria-label", visible ? (locale === "mn" ? "Нууц үг нуух" : "Hide password") : (locale === "mn" ? "Нууц үг харуулах" : "Show password"));
    });
    document.getElementById("review-comment").placeholder = text("commentPlaceholder");
    document.querySelectorAll(".reply-form input").forEach((input) => { input.placeholder = text("replyPlaceholder"); });
    if (currentUser && !elements.profilePage.hidden) {
      elements.signedInAs.textContent = `${currentUser.name} · ${currentUser.role}`;
      renderReviews();
    } else {
      setAuthMode(authMode);
    }
  }

  elements.loginForm.addEventListener("submit", login);
  elements.signupForm.addEventListener("submit", register);
  elements.reviewForm.addEventListener("submit", submitReview);
  elements.comment.addEventListener("input", () => {
    elements.commentCount.textContent = String(elements.comment.value.length);
  });
  elements.photoInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 3) {
      selectedPhotos = [];
      event.target.value = "";
      renderPhotoPreviews();
      showReviewFeedback(text("tooManyPhotos"), false);
      return;
    }
    if (files.some((file) => !file.type.startsWith("image/"))) {
      selectedPhotos = [];
      event.target.value = "";
      renderPhotoPreviews();
      showReviewFeedback(text("imageOnly"), false);
      return;
    }
    selectedPhotos = files;
    renderPhotoPreviews();
    elements.reviewMessage.hidden = true;
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });
  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      input.type = input.type === "password" ? "text" : "password";
      applyLanguage(locale);
    });
  });
  document.querySelectorAll("[data-social]").forEach((button) => {
    button.addEventListener("click", () => showToast(text("comingSoon")));
  });
  document.querySelectorAll('[data-action="switch"]').forEach((button) => {
    button.addEventListener("click", () => setAuthMode(authMode === "login" ? "signup" : "login"));
  });
  document.querySelectorAll('[data-action="forgot"]').forEach((button) => {
    button.addEventListener("click", () => showAuthFeedback(text("offlineRecovery"), true));
  });
  document.querySelector('[data-action="logout"]').addEventListener("click", logout);
  document.querySelector('[data-action="preview"]').addEventListener("click", showProfile);
  document.querySelector('[data-action="home"]').addEventListener("click", (event) => {
    event.preventDefault();
    showLogin();
  });

  elements.sort.addEventListener("change", () => { currentPage = 1; renderReviews(); });
  elements.photosFilter.addEventListener("change", () => { currentPage = 1; renderReviews(); });
  elements.pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button || button.disabled) return;
    currentPage = Number(button.dataset.page);
    renderReviews();
  });
  elements.reviewList.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-reply-toggle]");
    if (toggle) {
      const form = elements.reviewList.querySelector(`[data-reply-form="${CSS.escape(toggle.dataset.replyToggle)}"]`);
      form.hidden = !form.hidden;
    }
  });
  elements.reviewList.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-reply-form]");
    if (!form) return;
    event.preventDefault();
    if (!currentUser || currentUser.role !== "host") {
      showToast(text("hostCannotReview"));
      return;
    }
    const reply = String(new FormData(form).get("reply") || "").trim();
    if (!reply) return;
    try {
      const updated = reviews.map((review) =>
        review.id === form.dataset.replyForm ? { ...review, reply } : review,
      );
      writeStorage("reviews", updated);
      reviews = updated;
      renderReviews();
    } catch (error) {
      showToast(error instanceof Error ? error.message : text("genericError"));
    }
  });

  try {
    initializeStorage();
    setupRatingPickers();
    renderReviews();
    if (currentUser) showProfile();
    else showLogin();
    applyLanguage(locale);
  } catch (error) {
    showAuthFeedback(error instanceof Error ? error.message : text("genericError"), false);
    setupRatingPickers();
    renderReviews();
  }
})();
