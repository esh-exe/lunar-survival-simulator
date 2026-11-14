import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/AuthContext";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { SettingsProvider } from "@/lib/settings/SettingsProvider";
import { LanguageGate } from "@/components/brand/LanguageGate";
import { Base44Scripts } from "base44:document";
import appCss from "@/index.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LUNA: Beyond Survival — Junior Astronaut Mission Trainer" },
      {
        name: "description",
        content:
          "Command a lunar research outpost for ten days. Balance power, oxygen, water, food and radiation using real NASA open data. An educational space survival simulation for young explorers.",
      },
      { name: "theme-color", content: "#101A35" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@400;500;700&family=Noto+Naskh+Arabic:wght@400;500;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SettingsProvider>
          <Outlet />
          <LanguageGate />
          <Toaster />
        </SettingsProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

function RootDocument({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <HeadContent />
      </head>
      <body data-react-root="true">
        {children}
        <Base44Scripts />
        <Scripts />
      </body>
    </html>
  );
}
