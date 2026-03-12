"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export function AddNationalityHeader() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/general?tab=nationality"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Nationalities</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Create Nationality"
          description="Create a new nationality"
        />
      </section>
    </section>
  );
}
