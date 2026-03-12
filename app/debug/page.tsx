import type { Metadata } from "next";
import { headers } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthStatusCard } from "./components/health-status-card";

export const metadata: Metadata = {
  title: "E-Medical Record / Debug",
  description: "E-Medical Record / Debug",
};

function maskEnvValue(key: string, value: string | undefined) {
  if (!value)
    return "<empty>";
  const lower = key.toLowerCase();
  const isSensitive
    = lower.includes("secret")
      || lower.includes("key")
      || lower.includes("token")
      || lower.includes("password");
  return isSensitive ? "••••••••••••••••" : value;
}

async function fetchHealthCheckData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error("Health check URL not configured. Please set NEXT_PUBLIC_HEALTH_CHECK_URL or NEXT_PUBLIC_API_URL environment variable.");
    return [
      {
        title: "SQL – EMR",
        status: "Critical" as const,
        duration: "00:00:00.0000000",
        tags: ["error", "config"],
        data: { error: "Health check URL not configured", status: "Error" },
      },
      {
        title: "SQL – EMR Audit",
        status: "Critical" as const,
        duration: "00:00:00.0000000",
        tags: ["error", "config"],
        data: { error: "Health check URL not configured", status: "Error" },
      },
    ];
  }

  const urls = [
    `${baseUrl}/health/emr-ready`,
    `${baseUrl}/health/audit-ready`,
  ];

  try {
    const responses = await Promise.allSettled(
      urls.map(url => fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000),
      })),
    );

    const healthChecks = responses.map((result, index) => {
      if (result.status === "fulfilled" && result.value.ok) {
        const data = result.value.json();
        return data.then((healthData: any) => {
          const entryKey = Object.keys(healthData.entries)[0];
          const entry = healthData.entries[entryKey];

          return {
            title: entryKey,
            status: entry.status as "Healthy" | "Warning" | "Critical",
            duration: entry.duration,
            tags: entry.tags,
            data: healthData,
          };
        });
      }
      else {
        return {
          title: index === 0 ? "SQL – EMR" : "SQL – EMR Audit",
          status: "Critical" as const,
          duration: "00:00:00.0000000",
          tags: index === 0 ? ["error", "db", "emr"] : ["error", "db", "audit"],
          data: {
            error: "Failed to fetch health data",
            status: "Error",
          },
        };
      }
    });

    return await Promise.all(healthChecks);
  }
  catch (error) {
    console.error("Error fetching health check data:", error);
    return [
      {
        title: "SQL – EMR",
        status: "Critical" as const,
        duration: "00:00:00.0000000",
        tags: ["error", "db", "emr"],
        data: { error: "Network error", status: "Error" },
      },
      {
        title: "SQL – EMR Audit",
        status: "Critical" as const,
        duration: "00:00:00.0000000",
        tags: ["error", "db", "audit"],
        data: { error: "Network error", status: "Error" },
      },
    ];
  }
}

export default async function DebugPage() {
  const headersList = await headers();

  // Get environment variables (server-side only for security)
  const envVars = Object.entries(process.env).sort(([a], [b]) => a.localeCompare(b));

  const publicEnvVars = envVars.filter(([key]) => key.startsWith("NEXT_PUBLIC_"));
  const privateEnvVars = envVars.filter(([key]) => !key.startsWith("NEXT_PUBLIC_"));

  const healthChecks = await fetchHealthCheckData();

  const requestHeaders = Array.from(headersList.entries()).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Debug Information</h1>
        <p className="text-muted-foreground">System diagnostics and environment configuration</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-card-foreground">System Health Status</h2>
          <p className="text-muted-foreground">Real-time monitoring of critical database connections</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {healthChecks.map(check => (
            <HealthStatusCard
              key={`debug-health-check-${check.title}`}
              title={check.title}
              status={check.status}
              duration={check.duration}
              tags={check.tags}
              data={check.data}
            />
          ))}
        </div>
      </div>
      {/* Public Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🔑</span>
            Public Environment Variables
          </CardTitle>
          <CardDescription>Client-side variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {publicEnvVars.map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium">{key}</span>
                  <Badge variant="secondary" className="text-xs">
                    PRIVATE
                  </Badge>
                </div>
                <div className="bg-muted p-2 rounded text-xs font-mono break-all max-h-20 overflow-y-auto">{maskEnvValue(key, value)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Private Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            Private Environment Variables
            <Badge variant="destructive" className="text-xs">
              SENSITIVE
            </Badge>
          </CardTitle>
          <CardDescription>Server-side only variables (potentially sensitive)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {privateEnvVars.map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium">{key}</span>
                  <Badge variant="secondary" className="text-xs">
                    PRIVATE
                  </Badge>
                </div>
                <div className="bg-muted p-2 rounded text-xs font-mono break-all max-h-20 overflow-y-auto">{maskEnvValue(key, value)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request Headers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">📡</span>
            Request Headers
          </CardTitle>
          <CardDescription>HTTP headers from the current request</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {requestHeaders.map(([key, value]) => (
              <div key={key} className="space-y-1">
                <span className="font-mono text-sm font-medium">{key}</span>
                <div className="bg-muted p-2 rounded text-xs font-mono break-all">{value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
