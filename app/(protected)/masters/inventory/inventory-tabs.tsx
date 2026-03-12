"use client";

import { Boxes, Layers3 } from "lucide-react";
import { useQueryState } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { InventoryManagementContainer } from "./components/inventory-management-container";
import { InventoryCategory } from "./inventory-category/inventory-category";

export function InventoryTabs() {
  const { data: userDetails } = useGetUserDetailsQuery();

  const [selectedTab, setSelectedTab] = useQueryState("tab", {
    defaultValue: "inventory",
  });

  const [, setSortColumn] = useQueryState("sort");
  const [, setSortDirection] = useQueryState("order");
  const [, setCurrentPage] = useQueryState("currentPage");
  const [, setSearchFilter] = useQueryState("searchFilter");

  const inventoryTabsList = [
    { id: "inventory", label: "Inventory Management", icon: Boxes, permission: "InventoryItem.Read" },
    { id: "category", label: "Inventory Category", icon: Layers3, permission: "InventoryCategory.Read" },
  ];

  const visibleTabs = inventoryTabsList.filter(tab =>
    hasPermission(userDetails, tab.permission),
  );

  if (visibleTabs.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-center py-8 text-gray-500">
          You don't have permission to view any inventory management sections.
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
      case "inventory":
        return <InventoryManagementContainer />;
      case "category":
        return <InventoryCategory />;
    }
  }

  return (
    <section>
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

        {visibleTabs.map(({ id }) => (
          <TabsContent key={id} value={id}>
            {renderTabContent(id)}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
