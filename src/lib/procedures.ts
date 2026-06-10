export type ProcedureCategory = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  intro: string;
  highlights: string[];
  indications: string[];
  procedures: { name: string; desc: string }[];
  recovery: string;
};

export const categories: ProcedureCategory[] = [
  {
    slug: "cirurgia-pediatrica",
    name: "Cirurgia Plástica Pediátrica",
    shortName: "Cirurgia Pediátrica",
    tagline: "Cuidado cirúrgico delicado para bebês e crianças",
    intro:
      "A cirurgia plástica pediátrica reúne procedimentos reparadores e corretivos para bebês e crianças, sempre conduzidos com técnica minuciosa, equipe pediátrica dedicada e ambiente hospitalar preparado para os pequenos. O acompanhamento das famílias é parte essencial do processo.",
    highlights: [
      "Equipe pediátrica especializada (anestesia, enfermagem, suporte)",
      "Hospitais acreditados com estrutura pediátrica completa",
      "Comunicação clara e acolhedora com a família",
      "Planejamento que respeita o desenvolvimento da criança",
    ],
    indications: [
      "Deformidades congênitas",
      "Sequelas de queimaduras, mordeduras ou traumas",
      "Lesões de pele e tecidos moles",
      "Correções estético-funcionais na infância",
    ],
    procedures: [
      { name: "Otoplastia Infantil", desc: "Correção da orelha em abano a partir dos 6 anos." },
      { name: "Tratamento de Anomalias Vasculares", desc: "Hemangiomas e malformações em bebês e crianças." },
      { name: "Reparação Pós-Trauma", desc: "Reconstrução de lesões e cicatrizes na infância." },
    ],
    recovery: "Maioria dos procedimentos com alta no mesmo dia ou em 24h. Retorno escolar geralmente em 7 a 10 dias.",
  },
  {
    slug: "reparadora",
    name: "Cirurgia Reparadora",
    shortName: "Reparadora",
    tagline: "Reconstrução após trauma, câncer ou sequelas",
    intro:
      "A cirurgia reparadora devolve forma e função a regiões do corpo afetadas por trauma, ressecção oncológica, queimaduras ou cicatrizes complexas. O planejamento combina técnicas microcirúrgicas, retalhos e enxertos para o melhor resultado estético e funcional possível.",
    highlights: [
      "Técnicas avançadas de retalhos e microcirurgia",
      "Planejamento integrado com mastologia, oncologia e dermatologia",
      "Foco em devolver função, simetria e qualidade de vida",
      "Revisão cicatricial com técnicas modernas",
    ],
    indications: [
      "Pós-mastectomia (reconstrução mamária)",
      "Sequelas de queimaduras e traumas",
      "Cicatrizes hipertróficas e queloides",
      "Defeitos pós-ressecção de tumores de pele",
    ],
    procedures: [
      { name: "Reconstrução Mamária", desc: "Reconstrução pós-mastectomia com técnicas modernas e planejamento individualizado." },
      { name: "Revisão de Cicatrizes", desc: "Tratamento de cicatrizes hipertróficas, queloides e sequelas pós-traumáticas." },
      { name: "Cirurgia Pós-Trauma", desc: "Reparação de defeitos faciais e corporais após acidentes ou ressecções." },
    ],
    recovery: "Variável conforme a complexidade. Reconstruções maiores exigem internação de 1 a 3 dias e repouso domiciliar de 2 a 4 semanas.",
  },
  {
    slug: "estetica",
    name: "Cirurgia Estética",
    shortName: "Estética",
    tagline: "Resultados naturais que respeitam sua identidade",
    intro:
      "A cirurgia estética é planejada de forma individualizada, com foco em resultados naturais que valorizam suas características. Combinamos técnica cirúrgica refinada, ambiente hospitalar seguro e acompanhamento próximo no pós-operatório para uma experiência tranquila do início ao fim.",
    highlights: [
      "Planejamento individualizado em consulta sem pressa",
      "Hospitais acreditados e anestesistas experientes",
      "Foco em resultado natural, não em padrão",
      "Acompanhamento próximo em todo o pós-operatório",
    ],
    indications: [
      "Insatisfação estética com avaliação cuidadosa de expectativas",
      "Alterações pós-gestação ou perda de peso",
      "Sinais de envelhecimento facial",
      "Desejo de harmonização do contorno corporal",
    ],
    procedures: [
      { name: "Rinoplastia", desc: "Cirurgia do nariz para harmonização estética e/ou funcional." },
      { name: "Blefaroplastia", desc: "Rejuvenescimento das pálpebras com remoção de excesso de pele e bolsas." },
      { name: "Mamoplastia", desc: "Aumento, redução ou levantamento das mamas com planejamento personalizado." },
      { name: "Abdominoplastia", desc: "Remodelagem do abdômen com correção da musculatura." },
      { name: "Lipoaspiração", desc: "Contorno corporal com remoção localizada de gordura." },
    ],
    recovery: "Variável conforme o procedimento. Retorno às atividades leves entre 7 e 14 dias; resultado final entre 3 e 6 meses.",
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
