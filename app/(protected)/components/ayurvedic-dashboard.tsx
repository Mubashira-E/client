"use client";

import { Activity, Bed, Calendar, Heart, Package, Stethoscope, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AyurvedicDashboard() {
  const router = useRouter();

  const stats = [
    {
      title: "Active Treatments",
      value: "24",
      description: "Currently ongoing",
      icon: Activity,
      trend: "+12%",
    },
    {
      title: "Treatment Packages",
      value: "18",
      description: "Available packages",
      icon: Package,
      trend: "+5%",
    },
    {
      title: "Available Rooms",
      value: "8",
      description: "Ready for patients",
      icon: Bed,
      trend: "2 occupied",
    },
    {
      title: "Patients Today",
      value: "32",
      description: "Scheduled appointments",
      icon: Users,
      trend: "+8%",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Ayurvedic Hospital Management</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive management system for treatments, packages, and room allocation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <Card key={stat.title} className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                {stat.trend}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Upcoming treatments and appointments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Panchakarma Session</p>
                <p className="text-sm text-muted-foreground">Room 101 • 9:00 AM</p>
              </div>
              <Badge>In Progress</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Abhyanga Massage</p>
                <p className="text-sm text-muted-foreground">Room 203 • 11:30 AM</p>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Herbal Consultation</p>
                <p className="text-sm text-muted-foreground">Room 105 • 2:00 PM</p>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
              onClick={() => { router.push("/masters/treatments"); }}
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Manage Treatments
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
              onClick={() => { router.push("/masters/treatments/create"); }}
            >
              <Package className="h-4 w-4 mr-2" />
              Create Treatment Package
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
              onClick={() => { router.push("/masters/rooms"); }}
            >
              <Bed className="h-4 w-4 mr-2" />
              Room Management
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
              onClick={() => {
                router.push("/patients/patient-list");
              }}
            >
              <Heart className="h-4 w-4 mr-2" />
              Patient Records
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Overview
          </CardTitle>
          <CardDescription>Integration between treatments, packages, and rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Treatments</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Individual Ayurvedic treatments with detailed metadata, pricing, and duration configurations.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Packages</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Combination of treatments with special pricing, discounts, and booking limits.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bed className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Rooms</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Treatment rooms with amenities, equipment, and duration configurations for optimal scheduling.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
