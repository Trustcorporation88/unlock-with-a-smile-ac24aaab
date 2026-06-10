import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import { CONTACT, CITIES_ONE_LINE } from "@/lib/contact";

const physicianSchema = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: CONTACT.doctor.name,
  medicalSpecialty: ["PlasticSurgery"],
  url: "https://unlock-with-a-smile.lovable.app",
  telephone: `+${CONTACT.whatsappNumber}`,
  ...(CONTACT.email ? { email: CONTACT.email } : {}),
  sameAs: [CONTACT.social.instagram],
  address: CONTACT.cities.map((city) => ({
    "@type": "PostalAddress",
    addressLocality: city.replace(/ —.*$/, ""),
    addressRegion: CONTACT.state,
    addressCountry: CONTACT.country,
  })),
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: CONTACT.doctor.formation,
  },
  description: `${CONTACT.doctor.specialty} — ${CONTACT.doctor.crm} · ${CONTACT.doctor.rqe}. Formação pela USP, com atuação em cirurgia plástica reparadora, pediátrica e estética. Atendimento em ${CITIES_ONE_LINE}.`,
};


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-primary">404</h1>
        <h2 className="mt-4 font-serif text-2xl">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço que você buscou não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Não foi possível carregar esta página. Tente novamente.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Tentar novamente
          </button>
          <a href="/" className="rounded-full border border-border px-5 py-2.5 text-sm">Início</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dra. Rebecca Rossener — Cirurgia Plástica em São Paulo" },
      { name: "description", content: "Cirurgia plástica em São Paulo e Taubaté. Formação pela Faculdade de Medicina da USP, com residência e especialização no HC-FMUSP. Atendimento ético, individualizado e baseado em evidências." },
      { name: "author", content: "Dra. Rebecca Rossener" },
      { property: "og:title", content: "Dra. Rebecca Rossener — Cirurgia Plástica em São Paulo" },
      { property: "og:description", content: "Cirurgia plástica em São Paulo e Taubaté. Formada pela USP, com residência em Cirurgia Geral e especialização em Cirurgia Plástica no HC-FMUSP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dra. Rebecca Rossener — Cirurgia Plástica em São Paulo" },
      { name: "twitter:description", content: "Cirurgia plástica em São Paulo e Taubaté. Formada pela USP, com residência e especialização no HC-FMUSP." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/61c357eb-af1f-4d44-9314-2deb972b95f4/id-preview-83ecfed9--c2b3d902-75ac-416e-af02-449358b27440.lovable.app-1779408588109.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/61c357eb-af1f-4d44-9314-2deb972b95f4/id-preview-83ecfed9--c2b3d902-75ac-416e-af02-449358b27440.lovable.app-1779408588109.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Onest:wght@300;400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(physicianSchema),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <WhatsAppButton />
        <Toaster richColors position="top-center" />
      </div>
    </QueryClientProvider>
  );
}
