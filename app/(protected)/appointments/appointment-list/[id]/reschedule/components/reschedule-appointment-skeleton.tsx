import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RescheduleAppointmentSkeleton() {
  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["appointment-info", "patient-details", "reschedule"]}>
        <AccordionItem value="appointment-info" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array.from({ length: 3 })].map((_, index) => (
                    <div key={`appointment-info-col-${index + 1}`} className="space-y-4">
                      {[...Array.from({ length: 3 })].map((_, i) => (
                        <div key={`appointment-info-field-${index + 1}-${i + 1}`} className="space-y-1.5">
                          <Skeleton className="h-4 w-24" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="patient-details" className="border rounded-lg mt-4 bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 bg-white">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array.from({ length: 3 })].map((_, index) => (
                    <div key={`patient-details-col-${index + 1}`} className="space-y-4">
                      {[...Array.from({ length: 2 })].map((_, i) => (
                        <div key={`patient-details-field-${index + 1}-${i + 1}`} className="space-y-1.5">
                          <Skeleton className="h-4 w-24" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="reschedule" className="border rounded-lg mt-4 bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-48" />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-48" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>

                <div className="mt-6">
                  <Skeleton className="h-5 w-64 mb-3" />

                  <div className="space-y-6">
                    {[...Array.from({ length: 2 })].map((_, index) => (
                      <div key={`time-slot-group-${index + 1}`}>
                        <Skeleton className="h-5 w-48 mb-3" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {[...Array.from({ length: 6 })].map((_, slotIndex) => (
                            <Skeleton key={`time-slot-${index + 1}-${slotIndex + 1}`} className="h-24 w-full rounded-lg" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
