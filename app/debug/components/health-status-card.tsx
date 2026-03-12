import { CheckCircle2, Clock, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type HealthStatusCardProps = {
  title: string;
  status: "Healthy" | "Warning" | "Critical";
  duration: string;
  tags: string[];
  data?: Record<string, any>;
};

export function HealthStatusCard({ title, status, duration, tags, data }: HealthStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "Warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "Warning":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "Critical":
        return <Database className="h-5 w-5 text-red-600" />;
      default:
        return <Database className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-3">
            {getStatusIcon(status)}
            <span className="text-card-foreground">{title}</span>
          </div>
          <Badge className={`px-3 py-1 font-medium border ${getStatusColor(status)}`} variant="outline">
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-mono">{duration}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={`health-status-tag-${tag}`} variant="secondary" className="text-xs px-2 py-1 bg-accent text-accent-foreground">
              {tag}
            </Badge>
          ))}
        </div>

        {data && Object.keys(data).length > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <div className="text-xs font-mono text-muted-foreground">{JSON.stringify(data, null, 2)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
