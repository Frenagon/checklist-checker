import { BadgeCheck, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export default function ProfileSheetContent() {
  return (
    <SheetContent
      side="right"
      className="data-[side=right]:w-full data-[side=right]:border-none data-[side=right]:md:border-l"
    >
      <SheetHeader>
        <SheetTitle>Profile</SheetTitle>
        <SheetDescription>
          A shadcn/ui profile panel for testing a more task-oriented header
          flow.
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-6 px-6 pb-6">
        <div className="flex items-center gap-3 rounded-3xl border bg-background p-4">
          <Avatar size="lg">
            <AvatarFallback>
              <UserRound />
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate font-medium">Account</span>
            <span className="truncate text-sm text-muted-foreground">
              Ready for authenticated user details from Convex.
            </span>
          </div>
          <Badge variant="outline">
            <BadgeCheck />
            Active
          </Badge>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-medium">Profile preview</h2>
            <p className="text-sm text-muted-foreground">
              This variant keeps account details in a side panel so people can
              inspect profile information without leaving their current page.
            </p>
          </div>

          <div className="rounded-3xl border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">
              Use this area for display name, email, workspace role, or review
              preferences once the real user model is connected.
            </p>
          </div>
        </div>
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
