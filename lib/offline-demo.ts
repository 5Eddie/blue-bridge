export type DemoRole = "tourist" | "buyer" | "host";
export type DemoPlan = "free" | "premium" | "pro";

export function isDemoPlan(value: unknown): value is DemoPlan {
  return value === "free" || value === "premium" || value === "pro";
}

export type DemoUser = {
  id: string;
  name: string;
  identity: string;
  password: string;
  role: DemoRole;
  plan: DemoPlan;
};

export const DEMO_AUTH_EVENT = "malchin-demo-auth-updated";

export type DemoReview = {
  id: string;
  name: string;
  country: string;
  flag: string;
  date: string;
  timestamp: number;
  rating: number;
  comment: string;
  photos: string[];
  categories?: Record<string, number>;
  verified: boolean;
  reply?: string;
};

const demoUser: DemoUser = {
  id: "demo-tourist",
  name: "Demo Tourist",
  identity: "demo@nomadstay.mn",
  password: encodePassword("Demo1234"),
  role: "tourist",
  plan: "free",
};

export const sampleReviews: DemoReview[] = [
  {
    id: "review-1",
    name: "Emma Wilson",
    country: "United Kingdom",
    flag: "🇬🇧",
    date: "October 12, 2026",
    timestamp: new Date("2026-10-12").getTime(),
    rating: 5,
    comment:
      "A beautiful, grounding few days. We learned to make airag, rode out across the valley, and were welcomed like old friends. I still think about the quiet mornings here.",
    photos: ["/images/mongolia-bg.png"],
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
    comment:
      "The family was incredibly kind and the homemade food was wonderful. The ger was comfortable, clean, and much warmer than we expected.",
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
    comment:
      "A memorable and very genuine experience. The location is remote, so bring a book and enjoy the stars. Breakfast was a highlight.",
    photos: ["/images/mongolia-bg.png"],
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
    comment:
      "Our host showed us how the horses are cared for and made us feel at home from the first cup of tea. Exactly the kind of travel we hoped for.",
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
    comment:
      "We came for one night and wished we had booked three. Lovely hosts, peaceful surroundings, and delicious fresh dairy.",
    photos: [],
    verified: true,
  },
];

export function encodePassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : (JSON.parse(stored) as T);
  } catch {
    throw new Error("Browser storage is unavailable or contains invalid data.");
  }
}

function writeStored(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new Error("Unable to save in this browser. Check storage space and privacy settings.");
  }
}

export function initializeDemoStorage() {
  const storedUsers = readStored<DemoUser[] | null>("users", null);
  const users = Array.isArray(storedUsers) ? storedUsers : [];
  let usersChanged = false;
  for (const user of users) {
    if (!isDemoPlan(user.plan)) {
      user.plan = "free";
      usersChanged = true;
    }
  }
  const hasDemoUser = users.some(
    (user) => user.identity.toLowerCase() === demoUser.identity,
  );
  if (!hasDemoUser) {
    users.push(demoUser);
  }
  if (!Array.isArray(storedUsers) || !hasDemoUser || usersChanged) {
    writeStored("users", users);
  }

  const storedReviews = readStored<DemoReview[] | null>("reviews", null);
  const reviews = Array.isArray(storedReviews) ? storedReviews : sampleReviews;
  if (storedReviews === null || !Array.isArray(storedReviews)) {
    writeStored("reviews", reviews);
  }

  const storedCurrentUser = readStored<Omit<DemoUser, "password"> | null>("currentUser", null);
  const currentUser = storedCurrentUser
    ? { ...storedCurrentUser, plan: isDemoPlan(storedCurrentUser.plan) ? storedCurrentUser.plan : "free" }
    : null;
  if (storedCurrentUser && !isDemoPlan(storedCurrentUser.plan)) {
    writeStored("currentUser", currentUser);
  }
  return { users, reviews, currentUser };
}

function withoutPassword(user: DemoUser): Omit<DemoUser, "password"> {
  return {
    id: user.id,
    name: user.name,
    identity: user.identity,
    role: user.role,
    plan: user.plan,
  };
}

export function findDemoUser(identity: string, password: string) {
  const users = readStored<DemoUser[]>("users", []);
  const match = users.find(
    (user) =>
      user.identity.toLowerCase() === identity.trim().toLowerCase() &&
      user.password === encodePassword(password),
  );
  return match ? withoutPassword({ ...match, plan: isDemoPlan(match.plan) ? match.plan : "free" }) : null;
}

export function createDemoUser(
  user: Omit<DemoUser, "id" | "password">,
  password: string,
) {
  const users = readStored<DemoUser[]>("users", []);
  if (users.some((stored) => stored.identity.toLowerCase() === user.identity.toLowerCase())) {
    throw new Error("An account with that email or phone already exists.");
  }
  const savedUser: DemoUser = {
    ...user,
    id: `user-${Date.now()}`,
    password: encodePassword(password),
  };
  users.push(savedUser);
  writeStored("users", users);
  return withoutPassword(savedUser);
}

export function saveCurrentUser(user: Omit<DemoUser, "password">) {
  writeStored("currentUser", user);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
  }
}

export function updateDemoUserPlan(plan: DemoPlan) {
  if (!isDemoPlan(plan)) throw new Error("Please choose a valid membership plan.");

  const currentUser = readStored<Omit<DemoUser, "password"> | null>("currentUser", null);
  if (!currentUser) throw new Error("Please sign in to change your membership plan.");

  const users = readStored<DemoUser[]>("users", []);
  const userIndex = users.findIndex(
    (user) => user.id === currentUser.id || user.identity === currentUser.identity,
  );
  if (userIndex < 0) throw new Error("Your account could not be found. Please sign in again.");

  users[userIndex] = { ...users[userIndex], plan };
  const updatedUser = { ...currentUser, plan };
  writeStored("users", users);
  writeStored("currentUser", updatedUser);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
  }
  return updatedUser;
}

export function clearCurrentUser() {
  try {
    localStorage.removeItem("currentUser");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
    }
  } catch {
    throw new Error("Unable to sign out in this browser.");
  }
}

export function readDemoReviews() {
  return readStored<DemoReview[]>("reviews", sampleReviews);
}

export function saveDemoReviews(reviews: DemoReview[]) {
  writeStored("reviews", reviews);
}

export function readCurrentDemoUser() {
  const user = readStored<Omit<DemoUser, "password"> | null>("currentUser", null);
  return user ? { ...user, plan: isDemoPlan(user.plan) ? user.plan : "free" } : null;
}
