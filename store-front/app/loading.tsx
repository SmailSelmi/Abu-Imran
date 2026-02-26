import { motion } from "framer-motion";
import ChickenLoader from "@/components/ui/chicken-loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col items-center justify-center">
      <div className="relative scale-150">
        <ChickenLoader size="xl" />
      </div>
    </div>
  );
}
