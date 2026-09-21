import { Button } from "@/components/ui/button";
import { ThemeMenu } from "@/components/theme-menu";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center gap-3 bg-background">
      <Button>Click me</Button>
      <ThemeMenu />
    </main>
  );
}
