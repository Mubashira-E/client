"use client";

import Image from "next/image";
import Link from "next/link";
import { MastersSidebarGroup } from "@/app/(protected)/components/app-sidebar/sidebar-group/masters-sidebar-group";
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { getLogoUrl, getOrgName } from "@/lib/config";
import { AppointmentSidebarGroup } from "./sidebar-group/appointments-sidebar-group";
import { DashboardSidebarGroup } from "./sidebar-group/dashboard-sidebar-group";
import { ExcelUploadSidebarGroup } from "./sidebar-group/excel-upload-sidebar-group";
import { PatientsSidebarGroup } from "./sidebar-group/patients-group";
import { RolesSidebarGroup } from "./sidebar-group/roles-sidebar-group";

export function AppSidebar() {
  const logoUrl = getLogoUrl() || "/assets/images/logo.svg";
  const orgName = getOrgName();

  return (
    <aside
      className="h-screen"
    >
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="bg-white border-r border-gray-100 shadow-sm"
      >
        <Link href="/" className="flex items-center justify-start p-4">
          <div className="flex items-center">
            <Image src={logoUrl} alt={orgName} width={72} height={32} />
          </div>
        </Link>

        <SidebarContent className="gap-0 py-2">
          <DashboardSidebarGroup />
          <AppointmentSidebarGroup />
          <PatientsSidebarGroup />
          <ExcelUploadSidebarGroup />
          <RolesSidebarGroup />
          <MastersSidebarGroup />
        </SidebarContent>
      </Sidebar>
    </aside>
  );
}
