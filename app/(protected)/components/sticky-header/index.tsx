import { SidebarTrigger } from "@/components/ui/sidebar";
import { FullScreenToggle } from "./full-screen-toggle";
import { UserButton } from "./user-button";

function HeaderActions() {
  return (
    <section className="mr-4 flex h-full items-center justify-between gap-2">
      <FullScreenToggle />
    </section>
  );
}

export function StickyHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white h-12 border-b">
      <section className="flex items-center justify-between h-full">
        <SidebarTrigger className="ml-2" />
        <div className="flex items-center gap-2">
          <HeaderActions />
          <UserButton />
        </div>
      </section>
    </header>
  );
}
