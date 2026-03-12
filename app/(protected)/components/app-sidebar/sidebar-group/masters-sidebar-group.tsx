import {
  BackpackIcon,
  BarChart,
  Home,
  Stethoscope,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { hasAnyPermission, hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";

const mastersItems = [
  {
    icon: Home,
    id: "rooms",
    title: "Room Management",
    url: "/masters/rooms",
    permissions: ["Room.Read"],
  },
  {
    icon: Stethoscope,
    id: "treatments",
    title: "Treatment Management",
    url: "/masters/treatment-management",
    permissions: ["IndividualTreatment.Read", "PackagePlan.Read", "WellnessProgram.Read"],
  },
  {
    icon: Users,
    id: "clinician-management",
    title: "Clinician Management",
    url: "/masters/clinician-management",
    permissions: ["Clinician.Read", "Department.Read"],
  },
  {
    icon: BackpackIcon,
    id: "general",
    title: "General",
    url: "/masters/general",
    permissions: ["Nationality.Read"],
  },
  {
    url: "/masters/inventory",
    id: "inventory",
    title: "Inventory Management",
    icon: Home,
    permissions: ["InventoryItem.Read", "InventoryCategory.Read"],
  },
  {
    icon: BarChart,
    id: "powerbi-settings",
    title: "Power BI Settings",
    url: "/masters/powerbi-settings",
    permissions: [],
  },
];

export function MastersSidebarGroup() {
  const pathname = usePathname();
  const { data: userDetails } = useGetUserDetailsQuery();

  const visibleItems = mastersItems.filter((item) => {
    if (item.permissions.length === 0) {
      return true;
    }
    return item.permissions.length > 1
      ? hasAnyPermission(userDetails, item.permissions)
      : hasPermission(userDetails, item.permissions[0]);
  });

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="py-0.5">
      <SidebarGroupLabel className="text-primary text-sm font-semibold px-4 py-2 group-data-[collapsible=icon]:pointer-events-none">
        Masters
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => {
            const isActive = pathname.includes(item.url);
            return (
              <div
                key={item.id}
              >
                <SidebarMenuItem className="px-2">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md py-2 px-3 transition-colors",
                      isActive && "!bg-primary !text-white hover:!bg-primary hover:!text-white",
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={cn(
                        "size-5",
                        isActive ? "text-white" : "text-gray-700",
                      )}
                      />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
