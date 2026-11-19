"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createDemoUser,
  findDemoUser,
  initializeDemoStorage,
  isDemoPlan,
  saveCurrentUser,
  type DemoPlan,
  type DemoRole,
} from "@/lib/offline-demo";
import styles from "./login-experience.module.css";

type Locale = "en" | "mn";
type View = "login" | "signup" | "recovery";

const copy = {
  en: {
    tagline: "A little closer to the nomadic way of life.",
    welcome: "Welcome back",
    intro: "Sign in to find your place on the steppe.",
    email: "Email or phone",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    remember: "Remember me",
    forgot: "Forgot password?",
    login: "Log in",
    or: "or continue with",
    google: "Continue with Google",
    facebook: "Continue with Facebook",
    noAccount: "New to Nomad Stay?",
    createAccount: "Create an account",
    haveAccount: "Already have an account?",
    signIn: "Sign in",
    createTitle: "Join the journey",
    createIntro: "Create an account to meet Mongolia, a little more personally.",
    name: "Your name",
    chooseRole: "I’m joining as a...",
    tourist: "Tourist",
    buyer: "Buyer",
    host: "Herder family / Ger camp host",
    membershipPlan: "Membership plan",
    freePlan: "Free",
    premiumPlan: "Premium",
    proPlan: "Pro",
    create: "Create account",
    recoveryTitle: "Reset your password",
    recoveryIntro: "Password recovery is unavailable in this offline demo.",
    sendLink: "Send reset link",
    back: "Back to sign in",
    secure: "A more meaningful way to travel",
    error: "Please check your details and try again.",
    demo: "Demo login: demo@nomadstay.mn · Demo1234",
    loggingIn: "Logging in…",
    language: "Choose language",
  },
  mn: {
    tagline: "Нүүдэлчин ахуйтай илүү ойр танилцаарай.",
    welcome: "Тавтай морил",
    intro: "Тал нутгийн аяллаа үргэлжлүүлэхийн тулд нэвтэрнэ үү.",
    email: "И-мэйл эсвэл утас",
    password: "Нууц үг",
    showPassword: "Нууц үг харуулах",
    hidePassword: "Нууц үг нуух",
    remember: "Намайг сана",
    forgot: "Нууц үгээ мартсан уу?",
    login: "Нэвтрэх",
    or: "эсвэл үргэлжлүүлэх",
    google: "Google-ээр үргэлжлүүлэх",
    facebook: "Facebook-ээр үргэлжлүүлэх",
    noAccount: "Nomad Stay-д шинээр ирсэн үү?",
    createAccount: "Бүртгэл үүсгэх",
    haveAccount: "Бүртгэлтэй юу?",
    signIn: "Нэвтрэх",
    createTitle: "Аялалд нэгдээрэй",
    createIntro: "Монгол орныг илүү ойроос мэдрэх бүртгэл үүсгээрэй.",
    name: "Таны нэр",
    chooseRole: "Та хэнээр нэгдэх вэ?",
    tourist: "Аялагч",
    buyer: "Худалдан авагч",
    host: "Малчин айл / гэр буудлын эзэн",
    membershipPlan: "Гишүүнчлэлийн багц",
    freePlan: "Энгийн",
    premiumPlan: "Premium",
    proPlan: "Pro",
    create: "Бүртгэл үүсгэх",
    recoveryTitle: "Нууц үг сэргээх",
    recoveryIntro: "Энэ офлайн хувилбарт нууц үг сэргээх боломжгүй.",
    sendLink: "Холбоос илгээх",
    back: "Нэвтрэх хэсэг рүү буцах",
    secure: "Утга учиртай аялах шинэ зам",
    error: "Мэдээллээ шалгаад дахин оролдоно уу.",
    demo: "Туршилтын бүртгэл: demo@nomadstay.mn · Demo1234",
    loggingIn: "Нэвтэрч байна…",
    language: "Хэл сонгох",
  },
} as const;

export default function LoginExperience({
  returnTo,
  initialMode,
  initialPlan,
  initialRole,
}: {
  returnTo: string;
  initialMode: "login" | "signup";
  initialPlan: DemoPlan;
  initialRole: DemoRole;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [view, setView] = useState<View>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const t = copy[locale];

  useEffect(() => {
    try {
      const { currentUser } = initializeDemoStorage();
      if (currentUser) router.replace(returnTo);
    } catch (error) {
      window.setTimeout(() => {
        setFeedback(error instanceof Error ? error.message : t.error);
      }, 0);
    }
  }, [returnTo, router, t.error]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setSuccess(false);
    setBusy(true);
    const formData = new FormData(event.currentTarget);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 650));

      if (view === "recovery") {
        setSuccess(true);
        setFeedback(t.recoveryIntro);
        return;
      }

      const identity = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");

      if (view === "signup") {
        const name = String(formData.get("display_name") ?? "").trim();
        const emailOrPhone = identity;
        const role = String(formData.get("role") ?? "");
        const plan = String(formData.get("plan") ?? initialPlan);
        if (!name || !emailOrPhone || password.length < 6) {
          setFeedback(t.error);
          return;
        }
        if (role !== "tourist" && role !== "buyer" && role !== "host") {
          setFeedback("Choose a valid account type.");
          return;
        }
        if (!isDemoPlan(plan)) {
          setFeedback(locale === "en" ? "Choose a valid membership plan." : "Гишүүнчлэлийн багцаа зөв сонгоно уу.");
          return;
        }
        const user = createDemoUser(
          { name, identity: emailOrPhone, role, plan },
          password,
        );
        saveCurrentUser(user);
        setSuccess(true);
        setFeedback(locale === "en" ? "Account created. Welcome to Nomad Stay!" : "Бүртгэл үүслээ. Тавтай морил!");
        await new Promise((resolve) => window.setTimeout(resolve, 450));
        router.replace(returnTo);
        return;
      }

      const user = findDemoUser(identity, password);
      if (!user) {
        setFeedback("Incorrect email or password / Имэйл эсвэл нууц үг буруу байна");
        return;
      }
      saveCurrentUser(user);
      setSuccess(true);
      setFeedback(locale === "en" ? "You’re signed in. Welcome back!" : "Амжилттай нэвтэрлээ. Тавтай морил!");
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      router.replace(returnTo);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : t.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="Nomad Stay home">
          <span className={styles.brandMark} aria-hidden="true">N</span>
          <span>Nomad Stay</span>
        </Link>
        <div className={styles.language} role="group" aria-label={t.language}>
          <button
            type="button"
            aria-pressed={locale === "mn"}
            onClick={() => setLocale("mn")}
          >
            MN
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            aria-pressed={locale === "en"}
            onClick={() => setLocale("en")}
          >
            EN
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.story} aria-label={t.secure}>
          <span className={styles.eyebrow}>MONGOLIA · SLOW DOWN, STAY AWHILE</span>
          <p>{t.tagline}</p>
          <div className={styles.storyRule} />
          <span className={styles.storyNote}>{t.secure}</span>
        </section>

        <section className={styles.card} aria-labelledby="auth-title">
          <div className={styles.cardTop}>
            <span className={styles.cardIcon} aria-hidden="true">✳</span>
            <span className={styles.cardKicker}>NOMAD STAY · MONGOLIA</span>
          </div>

          <h1 id="auth-title" className={styles.title}>
            {view === "signup"
              ? t.createTitle
              : view === "recovery"
                ? t.recoveryTitle
                : t.welcome}
          </h1>
          <p className={styles.intro}>
            {view === "signup"
              ? t.createIntro
              : view === "recovery"
                ? t.recoveryIntro
                : t.intro}
          </p>

          {feedback && (
            <p
              className={success ? styles.success : styles.error}
              role={success ? "status" : "alert"}
            >
              {feedback}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >
            {view === "signup" && (
              <label className={styles.field}>
                <span>{t.name}</span>
                <input
                  type="text"
                  name="display_name"
                  autoComplete="name"
                  placeholder={t.name}
                  required
                />
              </label>
            )}

            <label className={styles.field}>
              <span>{t.email}</span>
              <input
                type={view === "recovery" ? "email" : "text"}
                name="email"
                autoComplete={view === "signup" ? "email" : "username"}
                inputMode={view === "recovery" ? "email" : "text"}
                placeholder={view === "recovery" ? "you@example.com" : "name@email.com"}
                required
              />
            </label>

            {view !== "recovery" && (
              <label className={styles.field}>
                <span>{t.password}</span>
                <span className={styles.passwordWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete={view === "login" ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    minLength={view === "login" ? undefined : 6}
                    required
                  />
                  <button
                    className={styles.passwordToggle}
                    type="button"
                    aria-label={showPassword ? t.hidePassword : t.showPassword}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </span>
              </label>
            )}

            {view === "signup" && (
              <label className={styles.field}>
                <span>{t.chooseRole}</span>
                <select name="role" defaultValue={initialRole}>
                  <option value="tourist">{t.tourist}</option>
                  <option value="buyer">{t.buyer}</option>
                  <option value="host">{t.host}</option>
                </select>
              </label>
            )}

            {view === "signup" && (
              <label className={styles.field}>
                <span>{t.membershipPlan}</span>
                <select name="plan" defaultValue={initialPlan}>
                  <option value="free">{t.freePlan}</option>
                  <option value="premium">{t.premiumPlan}</option>
                  <option value="pro">{t.proPlan}</option>
                </select>
              </label>
            )}

            {view === "login" && (
              <div className={styles.formOptions}>
                <label className={styles.remember}>
                  <input type="checkbox" name="remember" />
                  <span>{t.remember}</span>
                </label>
                <button
                  className={styles.textButton}
                  type="button"
                  onClick={() => setView("recovery")}
                >
                  {t.forgot}
                </button>
              </div>
            )}

            <button type="submit" className={styles.primary} disabled={busy}>
              {busy && <span className={styles.spinner} aria-hidden="true" />}
              {busy ? t.loggingIn : view === "signup" ? t.create : view === "recovery" ? t.sendLink : t.login}
              {!busy && <span aria-hidden="true">→</span>}
            </button>
          </form>

          {view === "login" && <p className={styles.demoInfo}>{t.demo}</p>}

          {view === "login" && (
            <>
              <div className={styles.divider}><span>{t.or}</span></div>
              <div className={styles.socials}>
                <button
                  className={styles.socialButton}
                  type="button"
                  onClick={() => {
                    setSuccess(true);
                    setFeedback("Coming soon / Удахгүй нэмэгдэнэ");
                  }}
                >
                  <span className={styles.googleMark} aria-hidden="true">G</span>
                  {t.google}
                </button>
                <button
                  className={styles.socialButton}
                  type="button"
                  onClick={() => {
                    setSuccess(true);
                    setFeedback("Coming soon / Удахгүй нэмэгдэнэ");
                  }}
                >
                  <span className={styles.facebookMark} aria-hidden="true">f</span>
                  {t.facebook}
                </button>
              </div>
            </>
          )}

          <p className={styles.switchPrompt}>
            {view === "login" ? t.noAccount : t.haveAccount}
            <button
              className={styles.textButton}
              type="button"
              onClick={() => {
                setFeedback("");
                setView(view === "login" ? "signup" : "login");
              }}
            >
              {view === "login" ? t.createAccount : t.signIn}
            </button>
          </p>
          {view === "recovery" && (
            <button
              type="button"
              className={styles.backButton}
              onClick={() => setView("login")}
            >
              ← {t.back}
            </button>
          )}
        </section>
      </div>

      <div className={styles.bottomNote}>
        <span aria-hidden="true">✦</span> {t.secure}
      </div>
    </main>
  );
}
