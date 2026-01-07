'use server';

import ServicesList from "./ServicesList";
import { getEnabledServices} from "@/lib/services";

export default async function ServicesPage() {
  let services = [];

  const res = await getEnabledServices();
  if (res.status && Array.isArray(res.plain)) {
    services = res.plain;
  }

  // ✅ No loading/error state — show list directly
  return (
    <>
      <main className="min-h-screen px-4 py-6">
        {services.length === 0 ? (
          <p className="text-center text-gray-500">No services available.</p>
        ) : (
          <ServicesList services={services} />
        )}
      </main>
    </>
  );
}
