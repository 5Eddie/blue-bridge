import LoginExperience from "@/components/LoginExperience";
import { isDemoPlan, type DemoRole } from "@/lib/offline-demo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string | string[];
    mode?: string | string[];
    plan?: string | string[];
    role?: string | string[];
  }>;
}) {
  const { next: nextParam, mode: modeParam, plan: planParam, role: roleParam } = await searchParams;
  const firstValue = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;
  const next = firstValue(nextParam);
  const mode = firstValue(modeParam);
  const requestedPlan = firstValue(planParam);
  const requestedRole = firstValue(roleParam);
  const returnTo =
    next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
      ? next
      : "/listings/demo";
  const initialPlan = isDemoPlan(requestedPlan) ? requestedPlan : "free";
  const initialRole: DemoRole =
    requestedRole === "buyer" || requestedRole === "host" ? requestedRole : "tourist";

  return (
    <LoginExperience
      returnTo={returnTo}
      initialMode={mode === "signup" ? "signup" : "login"}
      initialPlan={initialPlan}
      initialRole={initialRole}
    />
  );
}
