import { SettingsNav } from "@/components/backend/settings-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">
          Konto und Sicherheit verwalten.
        </p>
      </div>
      <SettingsNav />
      {children}
    </div>
  );
}
