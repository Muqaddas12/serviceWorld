// app/user/layout.js
import { getWebsiteSettings } from "@/lib/adminServices";
import { getUserDetails } from "@/lib/userActions";
import Page from "./components/layout/page";

export default async function UserLayout({ children }) {
  // 🧩 Server-side fetches
  const result = await getWebsiteSettings();
  const res = await getUserDetails();

  const settings = result?.success ? JSON.parse(result.plainsettings) : {};
  const user = res?.success ? res : null;
console.log(settings)
  return (
    <Page
      user={user}
      darkMode={true}
      websiteName={settings}
    >
      {children}
    </Page>
  );
}
