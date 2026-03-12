import { ClipboardPlus, List } from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

const appointmentItems = [
  {
    title: "Book Appointment",
    url: "/appointments/book-appointment", // Base URL without token
    icon: ClipboardPlus,
    permissions: ["BookAppointment.Create", "Appointments.Create"],
  },
  {
    title: "Appointments",
    url: "/appointments/appointment-list",
    icon: List,
    permissions: ["Appointments.Read"],
  },
];

export function AppointmentSidebarGroup() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();

  const visibleItems = appointmentItems.filter(item =>
    item.permissions.length > 1
      ? hasAnyPermission(userDetails, item.permissions)
      : hasPermission(userDetails, item.permissions[0]),
  );

  if (visibleItems.length === 0) {
    return null;
  }

  const handleBookAppointmentClick = (e: React.MouseEvent<HTMLAnchorElement>, baseUrl: string) => {
    e.preventDefault();

    const newUrl = `${baseUrl}?token=${nanoid(3)}`;
    router.push(newUrl);
  };

  return (
    <SidebarGroup className="py-0.5">
      <SidebarGroupLabel className="text-primary text-xs font-semibold tracking-wider uppercase px-4 py-2">
        Appointments
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => {
            const isActive = pathname.includes(item.url);

            return (
              <div key={item.title}>
                <SidebarMenuItem className="px-2">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md py-2 px-3 transition-colors",
                      isActive
                      && "bg-primary text-white hover:bg-primary hover:text-white",
                    )}
                  >
                    {item.title === "Book Appointment"
                      ? (
                          <Link
                            href={item.url}
                            onClick={e => handleBookAppointmentClick(e, item.url)}
                            className="flex items-center gap-3"
                          >
                            <item.icon className="size-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        )
                      : (
                          <Link href={item.url} className="flex items-center gap-3">
                            <item.icon className="size-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        )}
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
