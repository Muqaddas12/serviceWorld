import { getEnabledServices, bulkUpdateServices } from "@/lib/services";
import { getProvidersAction } from "@/lib/providerActions";
import { importServicesAction } from "@/lib/services";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (key !== "AbhinaySMMPanel") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  const services = await getEnabledServices();
  const providers = await getProvidersAction();

  const allServices = await Promise.all(
    providers.map(async (p) => {
      return await importServicesAction({
        url: p.providerUrl,
        api: p.apiKey,
      });
    })
  );

  const providerServices = allServices.flat();

  const updatedServices = services.plain.map((c) => {
    const match = providerServices.find(
      (s) => s.service === c.service
    );

    if (match) {
      return {
        ...c,
        category: match.category ?? c.category,
        rate: match.rate ?? c.rate,
        min: match.min ?? c.min,
        max: match.max ?? c.max,
        status: match.status ?? c.status ?? "enabled",
      };
    }

    return {
      ...c,
      status: "disabled",
    };
  });

  // 🔥 SAVE TO DATABASE
  await bulkUpdateServices(updatedServices);

  return Response.json({
    success: true,
    updatedCount: updatedServices.length,
  });
}
