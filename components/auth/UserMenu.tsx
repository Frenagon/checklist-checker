import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import {
  ChevronDown,
  LogOut,
  Monitor,
  Moon,
  Sun,
  UserCircle2,
  UserRound,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ProfileSheetContent from '@/components/auth/ProfileSheetContent';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet } from '@/components/ui/sheet';

export default function UserMenu() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { theme, setTheme } = useTheme();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
      router.push('/signin');
      router.refresh();
    } catch {
      toast.error('Unable to sign out right now.');
      setIsSigningOut(false);
    }
  };

  return (
    <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-2.5"
              disabled={isSigningOut}
            >
              <Avatar size="sm">
                <AvatarFallback>
                  <UserRound />
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">Account</span>
              <ChevronDown data-icon="inline-end" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Signed-in actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
                <UserCircle2 />
                <span>Profile</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme ?? 'system'}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="light">
                      <Sun />
                      <span>Light</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Moon />
                      <span>Dark</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <Monitor />
                      <span>System</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onSelect={handleSignOut}
                disabled={isSigningOut}
              >
                <LogOut />
                <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProfileSheetContent />
    </Sheet>
  );
}
