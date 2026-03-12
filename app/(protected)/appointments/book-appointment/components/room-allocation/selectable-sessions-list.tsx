type Session = {
  id: number;
  date: string;
  isCompleted: boolean;
};

type SelectableSessionsListProps = {
  total: number;
  completed: number;
  onSessionSelect: (sessionId: number) => void;
  selectedSessionId: number | null;
};

export function SelectableSessionsList({ total, completed, onSessionSelect, selectedSessionId }: SelectableSessionsListProps) {
  const sessions: Session[] = Array.from({ length: total }, (_, i) => ({
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
          <button
            key={session.id}
            type="button"
            disabled={session.isCompleted}
            onClick={() => onSessionSelect(session.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 relative ${
              session.isCompleted
                ? "bg-primary text-white border-primary cursor-not-allowed opacity-100"
                : selectedSessionId === session.id
                  ? "bg-white text-primary border-primary cursor-pointer shadow-md transform scale-[1.02]"
                  : "border-border hover:border-primary/50 cursor-pointer bg-white hover:shadow-sm"
            }`}
          >
            <div className="text-center">
              <p
                className={`text-sm font-bold mb-1 ${
                  session.isCompleted ? "text-white" : selectedSessionId === session.id ? "text-primary" : "text-foreground"
                }`}
              >
                Session
                {" "}
                {session.id}
              </p>
              {session.isCompleted && (
                <p className="text-xs text-white/80">
                  {session.date}
                </p>
              )}
            </div>
            {session.isCompleted && (
              <span className="mt-2 px-2 py-0.5 rounded bg-white text-primary text-[10px] font-bold">
                Completed
              </span>
            )}
            {!session.isCompleted && selectedSessionId === session.id && (
              <span className="mt-2 px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold">
                Selected
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
