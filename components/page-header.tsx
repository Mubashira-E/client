"use client";

type PageHeaderProps = {
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function PageHeader(props: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium text-foreground">
            {props.title}
          </h1>
          <p className="text-sm text-muted-foreground -mt-1">
            {props.description}
          </p>
        </div>
        {props.actions}
      </div>
    </section>
  );
}
