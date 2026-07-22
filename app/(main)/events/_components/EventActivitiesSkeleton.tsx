import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';

type ActivityRowSkeletonProps = {
  titleWidthClassName: string;
};

function ActivityRowSkeleton({
  titleWidthClassName,
}: ActivityRowSkeletonProps) {
  return (
    <Item variant="outline">
      <Skeleton className="size-12 rounded-xl" />
      <ItemContent>
        <Skeleton className={`h-5 rounded-full ${titleWidthClassName}`} />
      </ItemContent>
      <ItemActions>
        <Skeleton className="size-8 rounded-full" />
      </ItemActions>
    </Item>
  );
}

export default function EventActivitiesSkeleton() {
  return (
    <ItemGroup>
      <ActivityRowSkeleton titleWidthClassName="w-40 sm:w-48" />
      <ActivityRowSkeleton titleWidthClassName="w-36 sm:w-44" />
      <ActivityRowSkeleton titleWidthClassName="w-44 sm:w-52" />
    </ItemGroup>
  );
}
