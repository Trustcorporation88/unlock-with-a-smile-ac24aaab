import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, ADDRESS_ONE_LINE } from "@/lib/contact";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <h3 className="font-serif text-2xl">{CONTACT.doctor.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {CONTACT.doctor.specialty} · {CONTACT.doctor.crm} · {CONTACT.doctor.rqe}
          </p>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            Cirurgia plástica estética, reparadora e pediátrica com excelência técnica e
            cuidado genuinamente humano. Resultados naturais, segurança em cada etapa.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={CONTACT.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${CONTACT.social.instagramHandle}`}
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/80 transition hover:border-primary hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-base">Navegação</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/sobre" className="hover:text-primary">Sobre</Link></li>
            <li><Link to="/procedimentos" className="hover:text-primary">Procedimentos</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/galeria" className="hover:text-primary">Galeria</Link></li>
            <li><Link to="/faq" className="hover:text-primary">Perguntas frequentes</Link></li>
            <li><Link to="/contato" className="hover:text-primary">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-base">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{ADDRESS_ONE_LINE}</li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><a href={getWhatsAppLink("/contato")} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{CONTACT.whatsappDisplay}</a></li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><a href={`mailto:${CONTACT.email}`} className="hover:text-primary">{CONTACT.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:px-8">
          <p>© {new Date().getFullYear()} Dra. Rebecca Rossener. Todos os direitos reservados.</p>
          <p>
            Em conformidade com o Código de Ética Médica · Resolução CFM nº 1.974/2011
          </p>
        </div>
      </div>
    </footer>
  );
}
