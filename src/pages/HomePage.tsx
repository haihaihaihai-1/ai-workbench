import { EventStream } from "./home/event-stream";
import { FlywheelHealth } from "./home/flywheel-health";
import { PendingTickets } from "./home/pending-tickets";
import { QuickActions } from "./home/quick-actions";
import { RecentConversations } from "./home/recent-conversations";
import { WelcomeBanner } from "./home/welcome-banner";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <WelcomeBanner />
      <QuickActions />
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentConversations />
        <PendingTickets />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <FlywheelHealth />
        <EventStream />
      </div>
    </div>
  );
}
