/* ============================================================
   knowledge.js — Base de conocimiento del asistente legal
   (motor de coincidencia por palabras clave) y biblioteca de
   derechos. Todo bilingüe ES/EN.
   ============================================================ */

/* Cada entrada: keywords (normalizadas, sin acentos), respuesta
   bilingüe y, opcionalmente, el id de un caso recomendado. */
export const KB = [
  {
    keywords: ["multa", "trafico", "aparcamiento", "parking", "ticket", "estacionamiento", "dgt", "sancion"],
    caseId: "multa-trafico",
    answer: {
      es: "Puedes **recurrir una multa** si hay defectos en la señalización, en la notificación o en los datos, o si tienes pruebas a tu favor. Ojo: el plazo para alegar suele ser de 15-20 días y pagar con descuento normalmente implica renunciar a recurrir.",
      en: "You can **appeal a ticket** if there are defects in signage, the notice or the data, or if you have evidence in your favor. Note: the appeal window is usually 15-30 days, and paying the discounted fine usually waives your right to appeal.",
    },
  },
  {
    keywords: ["reembolso", "devolucion", "defectuoso", "roto", "refund", "faulty", "broken", "producto", "garantia legal"],
    caseId: "reembolso-producto",
    answer: {
      es: "Si un producto es **defectuoso** o no es conforme, tienes derecho a su reparación, sustitución o reembolso. En la UE la garantía legal mínima es de 2 años. Guarda el ticket y reclama por escrito.",
      en: "If a product is **faulty** or non-conforming, you're entitled to repair, replacement or refund. In the EU the minimum legal guarantee is 2 years. Keep the receipt and claim in writing.",
    },
  },
  {
    keywords: ["suscripcion", "cancelar", "membresia", "gimnasio", "streaming", "subscription", "cancel", "membership", "gym"],
    caseId: "cancelar-suscripcion",
    answer: {
      es: "Para **cancelar una suscripción** debes notificarlo por escrito y revocar la autorización de cobro recurrente. Pide confirmación. Si te siguen cobrando, puedes pedir un contracargo al banco.",
      en: "To **cancel a subscription**, notify in writing and revoke the recurring-charge authorization. Ask for confirmation. If charges continue, you can request a chargeback from your bank.",
    },
  },
  {
    keywords: ["fianza", "deposito", "alquiler", "casero", "arrendador", "deposit", "landlord", "rent", "security deposit"],
    caseId: "deposito-alquiler",
    answer: {
      es: "El **depósito o fianza** debe devolverse al terminar el contrato, descontando solo daños reales (no el desgaste normal). Si no lo devuelven en plazo, puedes reclamarlo judicialmente con intereses.",
      en: "Your **security deposit** must be returned at the end of the lease, deducting only real damage (not normal wear). If not returned on time, you can claim it in court with interest.",
    },
  },
  {
    keywords: ["reparacion", "humedad", "averia", "habitabilidad", "repairs", "mold", "heating", "boiler", "vivienda"],
    caseId: "reparaciones-arrendador",
    answer: {
      es: "El **arrendador debe mantener la vivienda habitable** y hacer las reparaciones necesarias. Requiérelo por escrito dando un plazo; si no actúa, puedes reparar a su cargo, pedir rebaja de renta o resolver el contrato.",
      en: "The **landlord must keep the home habitable** and carry out necessary repairs. Demand it in writing with a deadline; if ignored, you may repair-and-deduct, seek a rent reduction or terminate.",
    },
  },
  {
    keywords: ["vuelo", "avion", "retraso", "cancelado", "aerolinea", "flight", "delay", "cancelled", "airline", "261"],
    caseId: "compensacion-vuelo",
    answer: {
      es: "Por un **vuelo retrasado (3h+), cancelado o con overbooking** puedes reclamar compensación. En la UE el Reglamento 261/2004 da hasta 600€ según la distancia, salvo circunstancias extraordinarias. Reclama a la aerolínea primero.",
      en: "For a **delayed (3h+), cancelled or overbooked flight** you can claim compensation. In the EU, Regulation 261/2004 grants up to €600 by distance, barring extraordinary circumstances. Claim from the airline first.",
    },
  },
  {
    keywords: ["cargo", "tarjeta", "banco", "contracargo", "chargeback", "fraude", "card", "bank", "fraud", "duplicado"],
    caseId: "contracargo-banco",
    answer: {
      es: "Ante un **cargo no reconocido, duplicado o por algo no recibido**, puedes disputarlo y pedir un contracargo a tu banco, normalmente dentro de 60-120 días. Si es fraude, pide además bloquear la tarjeta.",
      en: "For an **unrecognized, duplicate or undelivered charge**, you can dispute it and request a chargeback from your bank, usually within 60-120 days. If it's fraud, also ask to block the card.",
    },
  },
  {
    keywords: ["deuda", "cobros", "recobro", "validacion", "debt", "collector", "collection", "fdcpa", "moroso", "asnef"],
    caseId: "validacion-deuda",
    answer: {
      es: "No pagues una deuda dudosa sin más: puedes exigir su **validación** (contrato original, desglose, legitimación). Hasta que la prueben, pueden tener que cesar el cobro. No reconozcas la deuda por escrito.",
      en: "Don't just pay a dubious debt: you can demand **validation** (original agreement, breakdown, standing). Until proven, they may have to stop collecting. Don't admit the debt in writing.",
    },
  },
  {
    keywords: ["credito", "informe", "scoring", "credit report", "score", "ficheros", "solvencia", "bureau"],
    caseId: "disputa-credito",
    answer: {
      es: "Si hay un **error en tu informe de crédito** (deuda pagada, dato ajeno), tienes derecho a rectificarlo. El fichero debe investigar y corregir. Adjunta pruebas del pago o del error.",
      en: "If there's an **error on your credit report** (paid debt, wrong entry), you have the right to fix it. The bureau must investigate and correct. Attach proof of payment or of the error.",
    },
  },
  {
    keywords: ["factura medica", "hospital", "medical bill", "clinica", "sanitaria", "copago"],
    caseId: "factura-medica",
    answer: {
      es: "Ante una **factura médica** puedes pedir el desglose detallado, revisar duplicados y negociar un descuento o plan de pago. Mientras se revisa, pide que no apliquen recargos ni te envíen a cobros.",
      en: "For a **medical bill** you can request an itemized statement, check for duplicates and negotiate a discount or payment plan. While under review, ask them not to add fees or send you to collections.",
    },
  },
  {
    keywords: ["datos", "acceso", "gdpr", "rgpd", "privacidad", "data", "access", "ccpa", "informacion personal"],
    caseId: "acceso-datos",
    answer: {
      es: "Tienes **derecho de acceso** a saber qué datos tuyos tiene una empresa, para qué los usa y a quién se los cede (art. 15 RGPD). Deben responder gratis, normalmente en 1 mes.",
      en: "You have a **right of access** to know what data a company holds, why and with whom it's shared (art. 15 GDPR). They must respond free of charge, usually within a month.",
    },
  },
  {
    keywords: ["borrar", "eliminar", "supresion", "olvido", "delete", "erasure", "forgotten", "baja datos"],
    caseId: "supresion-datos",
    answer: {
      es: "El **derecho de supresión (al olvido)** te permite pedir que borren tus datos personales (art. 17 RGPD), con algunas excepciones legales. Pide confirmación del borrado y el cese de comunicaciones.",
      en: "The **right to erasure (to be forgotten)** lets you request deletion of your personal data (art. 17 GDPR), with some legal exceptions. Ask for confirmation and that communications stop.",
    },
  },
  {
    keywords: ["salario", "nomina", "sueldo", "impagado", "horas extra", "wages", "salary", "unpaid", "finiquito", "trabajo"],
    caseId: "salarios-impagados",
    answer: {
      es: "Si tu empresa **no paga el salario, horas extra o finiquito**, requiérelo por escrito con un plazo corto. Genera intereses por mora y puedes acudir a inspección de trabajo o al juzgado.",
      en: "If your employer **doesn't pay wages, overtime or final settlement**, demand it in writing with a short deadline. It accrues interest and you can go to the labor authority or court.",
    },
  },
  {
    keywords: ["demanda", "demandar", "juicio", "small claims", "sue", "demand letter", "reclamacion previa", "pequenas cuantias"],
    caseId: "demanda-previa",
    answer: {
      es: "Antes de demandar conviene (a veces es obligatorio) enviar una **reclamación previa**: resume los hechos, exige el pago o cumplimiento y da un plazo. Sirve de prueba de que intentaste un acuerdo.",
      en: "Before suing it's advisable (sometimes required) to send a **letter before claim**: summarize the facts, demand payment or performance and set a deadline. It evidences you tried to settle.",
    },
  },
  {
    keywords: ["acoso", "difamacion", "cese", "desista", "cease", "desist", "amenaza", "harassment", "defamation"],
    caseId: "cese-desista",
    answer: {
      es: "Una **carta de cese y desista** exige formalmente a alguien que detenga una conducta ilícita (acoso, difamación, uso indebido). No es una orden judicial, pero deja constancia y suele frenar la conducta.",
      en: "A **cease-and-desist letter** formally demands someone stop unlawful conduct (harassment, defamation, misuse). It's not a court order, but it creates a record and often stops the behavior.",
    },
  },
  {
    keywords: ["contrato", "incumplimiento", "breach", "contract", "acuerdo", "clausula"],
    caseId: "incumplimiento-contrato",
    answer: {
      es: "Ante un **incumplimiento de contrato** puedes exigir el cumplimiento, la resolución y/o una indemnización. Cita la cláusula incumplida, concreta el daño y da un plazo para subsanar.",
      en: "On a **breach of contract** you can demand performance, termination and/or damages. Cite the breached clause, quantify the harm and set a deadline to cure.",
    },
  },
  {
    keywords: ["ruido", "vecino", "molestias", "noise", "neighbor", "nuisance", "comunidad"],
    caseId: "ruido-vecinos",
    answer: {
      es: "Frente a **ruidos o molestias del vecindario**, documenta días y horas y envía un requerimiento formal. Si persiste, avisa a la comunidad o al ayuntamiento y, en último caso, denuncia.",
      en: "For **neighbor noise or nuisance**, log dates and times and send a formal notice. If it persists, notify the association or city and, as a last resort, report it.",
    },
  },
  {
    keywords: ["garantia", "warranty", "fabricante", "averia producto"],
    caseId: "garantia-producto",
    answer: {
      es: "La **garantía** obliga al fabricante o vendedor a reparar o sustituir un producto que falla dentro del periodo cubierto, sin coste. La garantía comercial nunca reduce la garantía legal mínima.",
      en: "A **warranty** requires the maker or seller to repair or replace a product that fails within the covered period, at no cost. A commercial warranty never reduces the minimum legal guarantee.",
    },
  },
  {
    keywords: ["queja", "reclamacion", "complaint", "hoja de reclamaciones", "atencion al cliente"],
    caseId: "queja-formal",
    answer: {
      es: "Una **queja formal** deja constancia de una mala experiencia y exige una solución concreta. Sé objetivo (hechos, fechas), pide un plazo de respuesta y guarda el acuse de recibo.",
      en: "A **formal complaint** records a bad experience and demands a specific remedy. Be factual (events, dates), request a response deadline and keep proof of receipt.",
    },
  },
];

/* Respuesta por defecto cuando no hay coincidencia. */
export const FALLBACK = {
  es: "No estoy seguro de haber entendido tu caso. Cuéntame con otras palabras (por ejemplo: «me cobraron de más», «no me devuelven la fianza», «mi vuelo se canceló») o explora todos los **casos disponibles** para encontrar el documento que necesitas.",
  en: "I'm not sure I understood your case. Try other words (e.g. 'I was overcharged', 'they won't return my deposit', 'my flight was cancelled') or browse all **available cases** to find the document you need.",
};

/* Preguntas sugeridas para el asistente. */
export const SUGGESTIONS = {
  es: ["Me cobraron de más en la tarjeta", "No me devuelven la fianza", "Mi vuelo se canceló", "Quiero cancelar una suscripción", "Tengo un producto defectuoso"],
  en: ["I was overcharged on my card", "They won't return my deposit", "My flight was cancelled", "I want to cancel a subscription", "I have a faulty product"],
};

/* ---------- Biblioteca de derechos ---------- */
export const RIGHTS = [
  {
    icon: "🛒",
    title: { es: "Derechos del consumidor", en: "Consumer rights" },
    items: [
      { q: { es: "¿Cuánto dura la garantía de un producto?", en: "How long does a product warranty last?" },
        a: { es: "En la UE, la garantía legal mínima es de 2 años desde la entrega (3 años en algunos países). Cubre defectos de conformidad, no el mal uso. La garantía comercial es adicional y voluntaria.", en: "In the EU, the minimum legal guarantee is 2 years from delivery (3 in some countries). It covers conformity defects, not misuse. Commercial warranties are extra and voluntary." } },
      { q: { es: "¿Puedo devolver una compra online?", en: "Can I return an online purchase?" },
        a: { es: "En la UE tienes 14 días de desistimiento en compras a distancia, sin necesidad de justificar el motivo, con algunas excepciones (productos personalizados, perecederos, software desprecintado).", en: "In the EU you have a 14-day withdrawal right for distance purchases, without giving a reason, with some exceptions (custom, perishable, unsealed software)." } },
      { q: { es: "¿Qué hago si una empresa no responde a mi reclamación?", en: "What if a company ignores my complaint?" },
        a: { es: "Deja constancia por escrito, fija un plazo y, si no responden, escala a la autoridad de consumo, a una entidad de mediación o a la vía judicial (pequeñas cuantías).", en: "Keep it in writing, set a deadline and, if ignored, escalate to a consumer authority, mediation body or small-claims court." } },
    ],
  },
  {
    icon: "🏠",
    title: { es: "Derechos del inquilino", en: "Tenant rights" },
    items: [
      { q: { es: "¿Pueden quedarse con mi fianza?", en: "Can they keep my deposit?" },
        a: { es: "Solo pueden descontar daños reales más allá del desgaste normal y, en su caso, rentas o suministros impagados. Deben justificarlo; si no, procede la devolución íntegra.", en: "They can only deduct real damage beyond normal wear and any unpaid rent/utilities. They must justify it; otherwise the full deposit is due." } },
      { q: { es: "¿Quién paga las reparaciones?", en: "Who pays for repairs?" },
        a: { es: "Las reparaciones necesarias para conservar la vivienda habitable corresponden al arrendador; las pequeñas por uso ordinario, al inquilino. Los daños por mal uso los paga quien los causa.", en: "Repairs needed to keep the home habitable are the landlord's; minor wear-and-tear upkeep is the tenant's. Damage from misuse is paid by whoever caused it." } },
      { q: { es: "¿Pueden subir el alquiler cuando quieran?", en: "Can rent be raised at will?" },
        a: { es: "No. Las subidas se rigen por el contrato y la ley aplicable (a menudo ligadas a un índice y solo en la renovación). Revisa tu contrato y la normativa local.", en: "No. Increases follow the contract and applicable law (often tied to an index and only on renewal). Check your contract and local rules." } },
    ],
  },
  {
    icon: "💳",
    title: { es: "Finanzas y deudas", en: "Finance & debt" },
    items: [
      { q: { es: "¿Una empresa de cobros puede acosarme?", en: "Can a debt collector harass me?" },
        a: { es: "No. No pueden amenazar, llamar a horas intempestivas ni comunicar la deuda a terceros. Puedes exigir trato por escrito y la validación de la deuda antes de pagar.", en: "No. They can't threaten, call at unreasonable hours or disclose the debt to third parties. You can demand written contact and validation before paying." } },
      { q: { es: "¿Qué es un contracargo?", en: "What is a chargeback?" },
        a: { es: "Es la reversión de un cargo de tarjeta que solicitas a tu banco cuando es fraudulento, duplicado o por algo no recibido. Suele haber un plazo de 60-120 días desde el cargo.", en: "It's a reversal of a card charge you request from your bank for fraud, duplicates or undelivered goods. There's usually a 60-120 day window." } },
    ],
  },
  {
    icon: "🔒",
    title: { es: "Privacidad y datos", en: "Privacy & data" },
    items: [
      { q: { es: "¿Qué derechos tengo sobre mis datos?", en: "What rights do I have over my data?" },
        a: { es: "Acceso, rectificación, supresión, oposición, limitación y portabilidad (RGPD). Las empresas deben atenderlos gratis y normalmente en 1 mes. Puedes reclamar ante la autoridad de datos.", en: "Access, rectification, erasure, objection, restriction and portability (GDPR). Companies must handle them free of charge, usually within a month. You can complain to the data authority." } },
      { q: { es: "¿Pueden enviarme publicidad sin permiso?", en: "Can they send me ads without consent?" },
        a: { es: "El marketing suele requerir tu consentimiento o una relación previa, y siempre debe ofrecer una baja fácil. Puedes oponerte en cualquier momento.", en: "Marketing usually needs your consent or a prior relationship, and must always offer an easy opt-out. You can object at any time." } },
    ],
  },
  {
    icon: "💼",
    title: { es: "Derechos laborales", en: "Worker rights" },
    items: [
      { q: { es: "¿Qué hago si no me pagan?", en: "What if I'm not paid?" },
        a: { es: "Requiere el pago por escrito con un plazo. El impago genera intereses y puede dar lugar a denuncia ante la inspección de trabajo o a reclamación judicial, e incluso a la extinción indemnizada del contrato.", en: "Demand payment in writing with a deadline. Non-payment accrues interest and can lead to a labor complaint or court claim, even compensated termination." } },
      { q: { es: "¿Tienen que pagarme las horas extra?", en: "Must overtime be paid?" },
        a: { es: "Sí, las horas extra deben compensarse económicamente o con descanso según la ley y el convenio. Lleva un registro de tu jornada como prueba.", en: "Yes, overtime must be paid or compensated with rest per law and collective agreement. Keep a record of your hours as evidence." } },
    ],
  },
  {
    icon: "✈️",
    title: { es: "Viajes y transporte", en: "Travel & transport" },
    items: [
      { q: { es: "¿Cuándo me deben compensar por un vuelo?", en: "When am I owed flight compensation?" },
        a: { es: "En la UE: retraso de 3h o más en destino, cancelación sin aviso suficiente o denegación de embarque por overbooking, salvo circunstancias extraordinarias. La cuantía depende de la distancia (250-600€).", en: "In the EU: 3h+ arrival delay, cancellation without enough notice, or denied boarding due to overbooking, barring extraordinary circumstances. Amount depends on distance (€250-600)." } },
      { q: { es: "¿Y si pierden mi equipaje?", en: "What if my luggage is lost?" },
        a: { es: "Tienes derecho a indemnización conforme al Convenio de Montreal. Reclama de inmediato con el parte de irregularidad (PIR) y guarda los recibos de gastos de primera necesidad.", en: "You're entitled to compensation under the Montreal Convention. Claim immediately with the property irregularity report (PIR) and keep receipts for essentials." } },
    ],
  },
];
