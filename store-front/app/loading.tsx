import LogoLoader from "@/components/ui/logo-loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center">
      <LogoLoader size="xl" />
    </div>
  );
}
