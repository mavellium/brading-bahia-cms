import { analytics } from "@/lib/analytics";

export async function GET() {
  const [response] = await analytics.runReport({
    property: `properties/${process.env.GA_PROPERTY_ID}`,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "engagedSessions" },
    ],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  const data =
    response.rows?.map((row) => {
      const rawDate = row.dimensionValues?.[0]?.value ?? "";

      const [
        activeUsers,
        sessions,
        pageViews,
        engagedSessions,
      ] = row.metricValues?.map(m => Number(m.value)) ?? [];

      return {
        date: `${rawDate.slice(6, 8)}/${rawDate.slice(4, 6)}`,
        activeUsers,
        sessions,
        pageViews,
        engagedSessions,
      };
    }) ?? [];

  return Response.json(data);
}
