import { Shield, Users } from "lucide-react";
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
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";

const roleItems = [
  {
    title: "Users",
    url: "/users",
    icon: Users,
    permission: "Users.Read",
  },
  {
    title: "Roles",
    url: "/roles",
    icon: Shield,
    permission: "Roles.Read",
  },
];

export function RolesSidebarGroup() {
  const pathname = usePathname();
  const { data: userDetails } = useGetUserDetailsQuery();

  const visibleItems = roleItems.filter(item =>
    hasPermission(userDetails, item.permission),
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="py-0.5">
      <SidebarGroupLabel className="text-primary text-sm font-semibold px-4 py-2 group-data-[collapsible=icon]:pointer-events-none">
        Administration
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item, index) => {
            const isActive = pathname.startsWith(item.url);
            return (
              <div key={item.title}>
                <SidebarMenuItem className={cn("px-2", index === 0 && "pt-1")}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "text-gray-700 hover:text-primary hover:bg-primary-50 rounded-md py-2 px-3 transition-colors",
                      isActive && "!bg-primary !text-white hover:!bg-primary hover:!text-white",
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          isActive ? "text-white" : "text-gray-500",
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
