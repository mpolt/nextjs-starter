import { ButtonLink } from "@/components/ui/button-link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Seite nicht gefunden
        </h1>
        <p className="text-muted-foreground">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
      </div>
      <ButtonLink href="/">{site.name}</ButtonLink>
    </div>
  );
}
