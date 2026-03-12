"use client";

import { Building, Layers3 } from "lucide-react";
import { useQueryState } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { RoomManagementContainer } from "./components/room-management-container";
import { RoomType } from "./room-type/room-type";

export function RoomTabs() {
  const { data: userDetails } = useGetUserDetailsQuery();

  const [selectedTab, setSelectedTab] = useQueryState("tab", {
    defaultValue: "room",
  });

  const [, setSortColumn] = useQueryState("sort");
  const [, setSortDirection] = useQueryState("order");
  const [, setCurrentPage] = useQueryState("currentPage");
  const [, setSearchFilter] = useQueryState("searchFilter");

  const roomTabsList = [
    { id: "room", label: "Room Management", icon: Building, permission: "Room.Read" },
    { id: "room-type", label: "Room Type", icon: Layers3, permission: "RoomType.Read" },
  ];

  const visibleTabs = roomTabsList.filter(tab =>
    hasPermission(userDetails, tab.permission),
  );

  if (visibleTabs.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-center py-8 text-gray-500">
          You don't have permission to view any room management sections.
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
      case "room":
        return <RoomManagementContainer />;
      case "room-type":
        return <RoomType />;
    }
  }

  return (
    <section>
      <Tabs defaultValue="mode" value={defaultTab} onValueChange={handleTabChange} className="relative">
        <div className="overflow-x-auto">
          <TabsList className="h-[38px] w-full justify-start inline-flex">
            {visibleTabs.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="group relative hover:text-primary cursor-pointer">
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <div className="text-sm whitespace-nowrap">{label}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {visibleTabs.map(({ id }) => (
          <TabsContent key={id} value={id}>
            {renderTabContent(id)}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
