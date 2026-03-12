import Image from "next/image";
import emptyImage from "@/public/assets/svg/common/empty.svg";

export function AppointmentListTableEmpty() {
  return (
    <div className="h-24 text-center">
      <div className="flex flex-col items-center justify-center">
        <Image src={emptyImage} alt="Empty" width={320} height={320} />
        <h1 className="text-2xl font-bold">No Results Found</h1>
        <p className="text-gray-500">Please try again later</p>
      </div>
    </div>
  );
}
