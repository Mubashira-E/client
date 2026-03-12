import { HelpCircle } from "lucide-react";
import Link from "next/link";

export function HelpIconButton() {
  return (
    <div>
      <Link href="/help" className="flex items-center justify-center text-gray-800">
        <HelpCircle size={22} strokeWidth={1.5} />
      </Link>
    </div>
  );
}
