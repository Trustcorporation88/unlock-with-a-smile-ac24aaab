// ⚠️ DADOS DE CONTATO — fonte única da verdade
// Apenas dados verificados (matéria CALONE® XP + comunicação oficial da Dra.).
// Campos marcados como TODO devem ser preenchidos quando confirmados pela equipe.

export const CONTACT = {
  doctor: {
    name: "Dra. Rebecca Rossener",
    crm: "CRM-SP 176.098",
    rqe: "RQE 111.228",
    specialty: "Cirurgia Plástica",
    formation: "Faculdade de Medicina da USP",
  },

  // WhatsApp — confirmado (assessoria)
  whatsappNumber: "5511940405399",
  whatsappDisplay: "(11) 94040-5399",

  // E-mail oficial — TODO: confirmar com a equipe
  email: "",

  // Localidades de atendimento
  cities: ["São Paulo — SP", "Taubaté — SP"] as const,
  primaryCity: "São Paulo",
  state: "SP",
  country: "BR",

  // Endereço principal — A Sartor Medicina Integrada
  clinic: {
    name: "A Sartor Medicina Integrada",
    address: "Rua Helena, 218 (conjunto 410)",
    building: "Edifício Trade Tower, 4º andar",
    neighborhood: "Vila Olímpia",
    city: "São Paulo",
    state: "SP",
    cep: "04552-050",
    fullAddress: "Rua Helena, 218 (conjunto 410) — Edifício Trade Tower, 4º andar — Vila Olímpia, São Paulo - SP",
  },

  hours: {
    weekdays: "Segunda a Sexta: 8h às 18h",
    saturday: "Sábado: 8h às 13h (sob agendamento)",
  },

  social: {
    instagram: "https://www.instagram.com/drarebeccarossener",
    instagramHandle: "@drarebeccarossener",
  },

  // Imprensa
  press: {
    biografia: {
      title: "Biografia© Documentário — Grupo CALONE®",
      url: "https://calonexp.com/dra-rebecca-rossener-participa-do-biografia-documentario-e-destaca-a-cirurgia-plastica-como-uniao-entre-tecnica-etica-e-cuidado-individualizado/",
    },
  },
} as const;

export const CITIES_ONE_LINE = CONTACT.cities.join(" · ");
