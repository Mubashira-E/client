export default function ExcelUploadLoading() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-600">Loading Excel Upload</p>
        </div>
      </div>
    </section>
  );
}
