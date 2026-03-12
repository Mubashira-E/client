import Image from "next/image";
import { TableCell, TableRow } from "@/components/ui/table";
import errorImage from "@/public/assets/svg/common/error.svg";
import { useAppointmentListStore } from "../../stores/useAppointmentListStores";

export function AppointmentListTableError() {
  const { visibleColumns } = useAppointmentListStore();

  return (
    <TableRow>
      <TableCell colSpan={visibleColumns.length + 1} className="h-24 text-center py-8">
        <div className="flex flex-col items-center justify-center">
          <Image src={errorImage} alt="Error" width={320} height={320} />
          <h1 className="text-xl font-bold">Error loading data</h1>
          <p className="text-gray-500 text-sm">Please try again later</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
