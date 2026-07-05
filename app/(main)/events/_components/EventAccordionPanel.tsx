'use client';

type EventAccordionPanelProps = {
  overview: string;
  location: string;
  schedule: string[];
};

export default function EventAccordionPanel({
  overview,
  location,
  schedule,
}: EventAccordionPanelProps) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium">Overview</h2>
        <p className="text-muted-foreground">{overview}</p>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium">Location</h2>
        <p className="text-muted-foreground">{location}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-medium">Schedule</h2>
        <ul className="flex flex-col gap-2 text-muted-foreground">
          {schedule.map((scheduleEntry) => (
            <li key={scheduleEntry}>{scheduleEntry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
