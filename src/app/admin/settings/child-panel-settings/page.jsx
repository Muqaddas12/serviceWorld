import { getChildPanelSettings } from "@/lib/adminServices";
import ChildPanelClient from "./childPanelClient";

export default async function Page() {
  const settings = await getChildPanelSettings();

  return <ChildPanelClient initialSettings={settings} />;
}
