"use client";

import { Heart, Package, Stethoscope } from "lucide-react";
import { useQueryState } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { TreatmentManagementContainer } from "./individual-treatments/components/treatment-management-container";
import { PackageManagementContainer } from "./package-plans/components/package-management-container";
import { WellnessProgramManagementContainer } from "./wellness-program/components/wellness-program-management-container";

export function TreatmentTabs() {
  const { data: userDetails } = useGetUserDetailsQuery();

  const [selectedTab, setSelectedTab] = useQueryState("tab", {
    defaultValue: "treatment-plan",
  });

  const [, setSortColumn] = useQueryState("sort");
  const [, setSortDirection] = useQueryState("order");
  const [, setCurrentPage] = useQueryState("currentPage");
  const [, setSearchFilter] = useQueryState("searchFilter");

  const treatmentTabsList = [
    { id: "treatment-plan", label: "Treatment Plan", icon: Stethoscope, permission: "IndividualTreatment.Read" },
    { id: "package-plans", label: "Package Plans", icon: Package, permission: "PackagePlan.Read" },
    { id: "wellness-program", label: "Wellness Program ", icon: Heart, permission: "WellnessProgram.Read" },
  ];

  const visibleTabs = treatmentTabsList.filter(tab =>
    hasPermission(userDetails, tab.permission),
  );

  if (visibleTabs.length === 0) {
    return (
      <section className="relative bg-white p-4 border rounded-md">
        <div className="flex items-center justify-center py-8 text-gray-500">
          You don't have permission to view any treatment management sections.
        </div>
      </section>
    );
  }

  const isSelectedTabVisible = visibleTabs.some(tab => tab.id === selectedTab);
  const defaultTab = isSelectedTabVisible ? selectedTab : visibleTabs[0].id;

  const handleTabChange = (value: string) => {
    setSortColumn(null);
    setCurrentPage(null);
    setSelectedTab(value);
    setSearchFilter(null);
    setSortDirection(null);
  };

  function renderTabContent(tabId: string) {
    switch (tabId) {
      case "treatment-plan":
        return <TreatmentManagementContainer />;
      case "package-plans":
        return <PackageManagementContainer />;
      case "wellness-program":
        return <WellnessProgramManagementContainer />;
    }
  }

  return (
    <section className="relative bg-white p-4 border rounded-md">
      <Tabs defaultValue="mode" value={defaultTab} onValueChange={handleTabChange} className="relative">
        <TabsList className="h-[38px] w-full justify-start">
          {visibleTabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="group relative hover:text-primary cursor-pointer">
              <div className="flex items-center gap-2">
                <Icon className="size-4" />
                <div className="hidden text-sm xl:block">{label}</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <section className="flex flex-col gap-4 mt-4">
          {visibleTabs.map(({ id }) => (
            <TabsContent key={id} value={id}>
              {renderTabContent(id)}
            </TabsContent>
          ))}
        </section>
      </Tabs>
    </section>
  );
}
