// ⚠️ DADOS DE CONTATO — fonte única da verdade
// Substituir os campos marcados com TODO pelos dados reais da Dra. Rebecca.
// Tudo no site (Header, Footer, WhatsApp, Contato, Agendamento, schema SEO)
// lê deste arquivo.

export const CONTACT = {
  doctor: {
    name: "Dra. Rebecca Rossener",
    crm: "CRM-SP 176.098", // TODO: confirmar
    rqe: "RQE 111.228", // TODO: confirmar
    specialty: "Cirurgia Plástica",
  },

  // WhatsApp — apenas dígitos (DDI + DDD + número) para o link wa.me
  whatsappNumber: "5511940405399",
  whatsappDisplay: "(11) 94040-5399",

  email: "contato@drarebeccarossener.com.br", // TODO: e-mail real

  address: {
    street: "Av. Fictícia, 123 — Sala 45", // TODO
    neighborhood: "Bairro Exemplo", // TODO
    city: "São Paulo",
    state: "SP",
    zip: "00000-000", // TODO
    country: "BR",
  },

  hours: {
    weekdays: "Segunda a Sexta: 8h às 18h",
    saturday: "Sábado: 8h às 13h",
  },

  social: {
    instagram: "https://www.instagram.com/drarebeccarossener",
    instagramHandle: "@drarebeccarossener",
  },
} as const;

export const ADDRESS_ONE_LINE = `${CONTACT.address.street} — ${CONTACT.address.neighborhood}, ${CONTACT.address.city} — ${CONTACT.address.state}`;
