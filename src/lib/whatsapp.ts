// WhatsApp config — ATUALIZE com o número real da Dra. Rebecca
export const WHATSAPP_NUMBER = "55119999999999"; // TODO: substituir pelo número real

export const WHATSAPP_DISPLAY = "(11) 99999-9999"; // TODO: atualizar junto com o número

export function getWhatsAppMessage(pathname: string): string {
  const base = "Olá! Vi o site da Dra. Rebecca Rossener";

  if (pathname === "/") {
    return `${base} e gostaria de agendar uma consulta.`;
  }

  if (pathname === "/procedimentos") {
    return `${base} e gostaria de mais informações sobre os procedimentos.`;
  }

  if (pathname.startsWith("/procedimentos/otoplastia-modelagem")) {
    return `${base} e tenho interesse em MOBE / otoplastia. Gostaria de agendar uma avaliação.`;
  }

  if (pathname.startsWith("/procedimentos/anomalias-vasculares")) {
    return `${base} e gostaria de mais informações sobre tratamento de anomalias vasculares / hemangiomas.`;
  }

  if (pathname.startsWith("/procedimentos/cirurgia-pediatrica")) {
    return `${base} e preciso de uma avaliação de cirurgia pediátrica. Gostaria de agendar uma consulta.`;
  }

  if (pathname.startsWith("/procedimentos/reparadora")) {
    return `${base} e gostaria de agendar uma avaliação para cirurgia reparadora.`;
  }

  if (pathname.startsWith("/procedimentos/estetica")) {
    return `${base} e tenho interesse em procedimentos estéticos. Gostaria de agendar uma consulta.`;
  }

  if (pathname === "/agendamento") {
    return `${base} e gostaria de marcar minha consulta.`;
  }

  if (pathname === "/contato") {
    return `${base} e gostaria de conversar.`;
  }

  if (pathname === "/sobre") {
    return `${base}, conheci a trajetória da Dra. Rebecca e gostaria de agendar uma consulta.`;
  }

  if (pathname === "/faq") {
    return `${base}, li as perguntas frequentes e gostaria de agendar uma consulta.`;
  }

  if (pathname === "/blog") {
    return `${base}, li o blog e gostaria de agendar uma consulta.`;
  }

  if (pathname === "/galeria") {
    return `${base}, vi a galeria e gostaria de agendar uma consulta.`;
  }

  return `${base} e gostaria de agendar uma consulta.`;
}

export function getWhatsAppLink(pathname: string): string {
  const message = getWhatsAppMessage(pathname);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
