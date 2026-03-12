export default function SessionsList({ total, completed }: { total: number; completed: number }) {
  const sessions = Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    date: new Date(Date.now() + (i - completed + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    isCompleted: i < completed,
  }));

  return (
    <div className="bg-card border border-border p-6 sm:p-8 rounded-lg">
      <h3 className="text-xl font-bold text-foreground mb-6">Session Schedule</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sessions.map(session => (
          <div
            key={session.id}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 ${
              session.isCompleted ? "bg-primary border-primary" : "border-border hover:border-primary/50"
            }`}
          >
            <div className="text-center">
              <p
                className={`text-sm font-bold mb-2 ${
                  session.isCompleted ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                Session
                {" "}
                {session.id}
              </p>
              <p className={`text-xs ${session.isCompleted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {session.date}
              </p>
              {session.isCompleted && (
                <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded bg-primary-foreground text-primary text-xs font-medium">
                  ✓ Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Status</p>
            <p className="text-lg font-bold text-primary">
              {((completed / total) * 100).toFixed(0)}
              %
              {" "}
              Complete
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Next Session</p>
            <p className="text-lg font-bold text-accent">
              {completed < total ? sessions[completed]?.date || "Scheduled" : "All Complete"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
