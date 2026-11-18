import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import mn from "../messages/mn.json";
import en from "../messages/en.json";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value === "en" ? "en" : "mn";

  return {
    locale,
    messages: locale === "en" ? en : mn,
  };
});
