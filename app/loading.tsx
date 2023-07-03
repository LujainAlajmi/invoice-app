import { Skeleton } from "@/components/ui/skeleton";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ReloadIcon className="w-6 h-6  animate-spin" />
    </div>
  );
}
