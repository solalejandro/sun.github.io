/* ============================================================
   cases.js — Catálogo de asistentes legales y generadores de
   documentos. Cada caso define: categoría, icono, textos
   bilingües, campos del formulario y un generador build().
   ============================================================ */
import { val, money, today } from "../utils.js";

/* ---------- Categorías ---------- */
export const CATEGORIES = [
  { id: "consumo",     icon: "🛒", name: { es: "Consumo", en: "Consumer" } },
  { id: "vivienda",    icon: "🏠", name: { es: "Vivienda", en: "Housing" } },
  { id: "transporte",  icon: "🚗", name: { es: "Transporte y viajes", en: "Transport & travel" } },
  { id: "finanzas",    icon: "💳", name: { es: "Finanzas y deudas", en: "Finance & debt" } },
  { id: "privacidad",  icon: "🔒", name: { es: "Privacidad y datos", en: "Privacy & data" } },
  { id: "trabajo",     icon: "💼", name: { es: "Trabajo", en: "Work" } },
  { id: "tramites",    icon: "📑", name: { es: "Trámites y disputas", en: "Disputes & filings" } },
];

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

/* ---------- Helpers de redacción ---------- */
function senderBlock(v, lang) {
  const lines = [
    val(v.fullName, lang === "en" ? "[Your full name]" : "[Tu nombre completo]"),
    val(v.address, lang === "en" ? "[Your address]" : "[Tu dirección]"),
  ];
  if (v.email) lines.push(v.email);
  if (v.phone) lines.push((lang === "en" ? "Tel: " : "Tel.: ") + v.phone);
  return lines.join("\n");
}

function recipientBlock(name, address, lang) {
  return [
    val(name, lang === "en" ? "[Recipient name]" : "[Nombre del destinatario]"),
    val(address, lang === "en" ? "[Recipient address]" : "[Dirección del destinatario]"),
  ].join("\n");
}

function dateLine(lang) {
  return (lang === "en" ? "Date: " : "Fecha: ") + today();
}

function signOff(v, lang) {
  return (lang === "en" ? "Sincerely,\n\n\n" : "Atentamente,\n\n\n") +
    val(v.fullName, lang === "en" ? "[Your full name]" : "[Tu nombre completo]");
}


/* ---------- Catálogo de casos ----------
   field types: text | textarea | date | money | number | email | tel | select
*/
export const CASES = [

  /* ===================== CONSUMO ===================== */
  {
    id: "reembolso-producto",
    category: "consumo",
    icon: "📦",
    title: { es: "Reclamar reembolso por producto defectuoso", en: "Claim a refund for a faulty product" },
    desc: { es: "Carta para exigir la reparación, sustitución o devolución del dinero de un producto defectuoso.", en: "Letter demanding repair, replacement or refund for a defective product." },
    juris: { es: "En la UE tienes derecho a una garantía legal mínima de 2 años (Directiva 1999/44/CE y 2019/771). En EE. UU. aplican garantías implícitas estatales (UCC).", en: "In the EU you have a minimum 2-year legal guarantee. In the US, implied warranties apply under the UCC." },
    tips: {
      es: ["Adjunta copia del ticket o factura.", "Describe el defecto con fechas concretas.", "Conserva la comunicación por escrito."],
      en: ["Attach a copy of the receipt or invoice.", "Describe the defect with specific dates.", "Keep all communication in writing."],
    },
    nextSteps: {
      es: ["Envía la carta por un medio con acuse de recibo (burofax, email con confirmación).", "Da un plazo de 14 días para responder.", "Si no responden, acude a la oficina de consumo o reclama judicialmente."],
      en: ["Send the letter via a method with proof of receipt.", "Give a 14-day deadline to respond.", "If ignored, escalate to a consumer agency or small claims."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", req: true, label: { es: "Tu dirección", en: "Your address" } },
      { name: "email", type: "email", label: { es: "Tu email", en: "Your email" } },
      { name: "phone", type: "tel", label: { es: "Tu teléfono", en: "Your phone" } },
      { name: "company", type: "text", req: true, label: { es: "Empresa / vendedor", en: "Company / seller" } },
      { name: "companyAddress", type: "textarea", label: { es: "Dirección de la empresa", en: "Company address" } },
      { name: "product", type: "text", req: true, label: { es: "Producto", en: "Product" } },
      { name: "orderRef", type: "text", label: { es: "Nº de pedido / factura", en: "Order / invoice no." } },
      { name: "purchaseDate", type: "date", req: true, label: { es: "Fecha de compra", en: "Purchase date" } },
      { name: "price", type: "money", label: { es: "Precio pagado", en: "Price paid" } },
      { name: "problem", type: "textarea", req: true, label: { es: "Describe el defecto", en: "Describe the defect" } },
      { name: "remedy", type: "select", req: true, label: { es: "Qué solución pides", en: "Remedy requested" },
        options: [
          { value: "reembolso", label: { es: "Reembolso completo", en: "Full refund" } },
          { value: "sustitucion", label: { es: "Sustitución", en: "Replacement" } },
          { value: "reparacion", label: { es: "Reparación", en: "Repair" } },
        ] },
    ],
    build(v, lang) {
      const remedyTxt = {
        reembolso: { es: "el reembolso íntegro del importe abonado", en: "a full refund of the amount paid" },
        sustitucion: { es: "la sustitución del producto por uno equivalente en perfecto estado", en: "replacement of the product with an equivalent in perfect condition" },
        reparacion: { es: "la reparación del producto sin coste alguno", en: "repair of the product at no cost" },
      }[v.remedy] || { es: "una solución adecuada", en: "an appropriate remedy" };

      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.company, v.companyAddress, lang)}

Subject: Faulty product claim — ${val(v.product, "[product]")}${v.orderRef ? ` (Ref. ${v.orderRef})` : ""}

Dear Sir or Madam,

On ${val(v.purchaseDate, "[date]")} I purchased the product "${val(v.product, "[product]")}"${v.price ? ` for ${money(v.price)}` : ""} from your establishment. The product has shown the following defect:

${val(v.problem, "[describe the defect]")}

This defect makes the product unfit for its intended purpose. Under the applicable consumer-protection legislation and the legal guarantee of conformity, I am entitled to a remedy at no cost.

I therefore request ${remedyTxt.en} within 14 calendar days of receipt of this letter.

Should I not receive a satisfactory response within that period, I reserve the right to file a complaint with the competent consumer authority and to pursue any legal remedies available, including a claim for damages and costs.

Please confirm receipt of this letter in writing.

${signOff(v, lang)}`;
      }

      return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.company, v.companyAddress, lang)}

Asunto: Reclamación por producto defectuoso — ${val(v.product, "[producto]")}${v.orderRef ? ` (Ref. ${v.orderRef})` : ""}

Estimados señores:

El día ${val(v.purchaseDate, "[fecha]")} adquirí en su establecimiento el producto «${val(v.product, "[producto]")}»${v.price ? ` por un importe de ${money(v.price)}` : ""}. El producto presenta el siguiente defecto:

${val(v.problem, "[describa el defecto]")}

Dicho defecto hace que el producto no sea conforme con el contrato ni apto para el uso al que se destina. Conforme a la normativa de protección de los consumidores y a la garantía legal de conformidad que me asiste, tengo derecho a una solución sin coste alguno.

Por todo ello, SOLICITO ${remedyTxt.es} en un plazo de 14 días naturales desde la recepción de este escrito.

De no recibir una respuesta satisfactoria en dicho plazo, me reservo el derecho de presentar la correspondiente reclamación ante la autoridad de consumo competente y de ejercer cuantas acciones legales me asistan, incluida la reclamación de daños y perjuicios.

Le ruego confirme por escrito la recepción de la presente.

${signOff(v, lang)}`;
    },
  },

  {
    id: "cancelar-suscripcion",
    category: "consumo",
    icon: "🔁",
    title: { es: "Cancelar una suscripción o membresía", en: "Cancel a subscription or membership" },
    desc: { es: "Carta formal para cancelar suscripciones recurrentes (gimnasio, streaming, software) y detener cobros.", en: "Formal letter to cancel recurring subscriptions (gym, streaming, software) and stop charges." },
    juris: { es: "Muchas jurisdicciones obligan a permitir la cancelación por el mismo medio de alta. Conserva prueba de la fecha.", en: "Many jurisdictions require cancellation by the same channel used to sign up. Keep proof of the date." },
    tips: {
      es: ["Indica que revocas cualquier autorización de cargo recurrente.", "Pide confirmación por escrito.", "Vigila tu cuenta para detectar cobros posteriores."],
      en: ["State that you revoke any recurring charge authorization.", "Ask for written confirmation.", "Monitor your account for any later charges."],
    },
    nextSteps: {
      es: ["Envía la carta y guarda el acuse.", "Si te siguen cobrando, solicita el contracargo a tu banco.", "Conserva la confirmación de baja."],
      en: ["Send the letter and keep the receipt.", "If charges continue, request a chargeback from your bank.", "Keep the cancellation confirmation."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "email", type: "email", label: { es: "Tu email", en: "Your email" } },
      { name: "company", type: "text", req: true, label: { es: "Empresa / servicio", en: "Company / service" } },
      { name: "companyAddress", type: "textarea", label: { es: "Dirección de la empresa", en: "Company address" } },
      { name: "accountId", type: "text", req: true, label: { es: "Nº de cuenta / cliente / email asociado", en: "Account / customer no. / linked email" } },
      { name: "startDate", type: "date", label: { es: "Fecha de alta", en: "Start date" } },
      { name: "effectiveDate", type: "date", label: { es: "Fecha deseada de baja", en: "Desired cancellation date" } },
      { name: "reason", type: "textarea", label: { es: "Motivo (opcional)", en: "Reason (optional)" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.company, v.companyAddress, lang)}

Subject: Cancellation of subscription — Account ${val(v.accountId, "[account]")}

Dear Sir or Madam,

I am writing to formally cancel my subscription / membership with ${val(v.company, "[company]")}, associated with account ${val(v.accountId, "[account]")}${v.startDate ? `, started on ${v.startDate}` : ""}.

I request that the cancellation take effect ${v.effectiveDate ? `on ${v.effectiveDate}` : "immediately"} and that you cease all recurring charges. I hereby revoke any prior authorization to charge my payment method.
${v.reason ? `\nReason: ${v.reason}\n` : ""}
Please send me written confirmation of the cancellation and of the date from which no further charges will be made. Any charge applied after the effective date will be disputed.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.company, v.companyAddress, lang)}

Asunto: Baja de suscripción — Cuenta ${val(v.accountId, "[cuenta]")}

Estimados señores:

Por la presente solicito la baja definitiva de mi suscripción / membresía con ${val(v.company, "[empresa]")}, asociada a la cuenta ${val(v.accountId, "[cuenta]")}${v.startDate ? `, dada de alta el ${v.startDate}` : ""}.

Solicito que la baja surta efecto ${v.effectiveDate ? `el ${v.effectiveDate}` : "de forma inmediata"} y que cesen todos los cargos recurrentes. Mediante este escrito REVOCO cualquier autorización previa de cargo sobre mi medio de pago.
${v.reason ? `\nMotivo: ${v.reason}\n` : ""}
Le ruego me remita confirmación por escrito de la baja y de la fecha a partir de la cual no se realizarán más cobros. Cualquier cargo posterior a la fecha de efecto será objeto de reclamación y contracargo.

${signOff(v, lang)}`;
    },
  },

  {
    id: "garantia-producto",
    category: "consumo",
    icon: "🛠️",
    title: { es: "Reclamar la garantía de un producto", en: "Claim a product warranty" },
    desc: { es: "Exige al fabricante o vendedor que cumpla la garantía cuando un producto falla dentro del periodo cubierto.", en: "Demand the manufacturer or seller honor the warranty when a product fails within the covered period." },
    juris: { es: "La garantía comercial nunca puede reducir la garantía legal mínima. Conserva la prueba de compra.", en: "A commercial warranty can never reduce the minimum legal guarantee. Keep proof of purchase." },
    tips: {
      es: ["Cita el número y duración de la garantía.", "Adjunta el certificado de garantía si lo tienes.", "Describe los intentos previos de solución."],
      en: ["Quote the warranty number and duration.", "Attach the warranty certificate if available.", "Describe any previous repair attempts."],
    },
    nextSteps: {
      es: ["Entrega el producto en el punto indicado guardando resguardo.", "Exige plazo razonable de reparación.", "Si reincide el fallo, pide sustitución o reembolso."],
      en: ["Hand in the product at the indicated point and keep the receipt.", "Demand a reasonable repair timeframe.", "If the fault recurs, request replacement or refund."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "email", type: "email", label: { es: "Tu email", en: "Your email" } },
      { name: "company", type: "text", req: true, label: { es: "Fabricante / vendedor", en: "Manufacturer / seller" } },
      { name: "companyAddress", type: "textarea", label: { es: "Dirección", en: "Address" } },
      { name: "product", type: "text", req: true, label: { es: "Producto y modelo", en: "Product and model" } },
      { name: "purchaseDate", type: "date", req: true, label: { es: "Fecha de compra", en: "Purchase date" } },
      { name: "warrantyRef", type: "text", label: { es: "Nº de garantía / serie", en: "Warranty / serial no." } },
      { name: "problem", type: "textarea", req: true, label: { es: "Fallo que presenta", en: "Fault presented" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.company, v.companyAddress, lang)}

Subject: Warranty claim — ${val(v.product, "[product]")}${v.warrantyRef ? ` (${v.warrantyRef})` : ""}

Dear Sir or Madam,

The product "${val(v.product, "[product]")}", purchased on ${val(v.purchaseDate, "[date]")}, is covered by warranty and has developed the following fault:

${val(v.problem, "[describe the fault]")}

As the product is within the warranty period, I request that you honor the warranty by repairing or replacing it at no cost within a reasonable timeframe, and provide a courtesy unit or compensation for the time without service where applicable.

Please confirm in writing the procedure and the expected resolution date.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.company, v.companyAddress, lang)}

Asunto: Reclamación de garantía — ${val(v.product, "[producto]")}${v.warrantyRef ? ` (${v.warrantyRef})` : ""}

Estimados señores:

El producto «${val(v.product, "[producto]")}», adquirido el ${val(v.purchaseDate, "[fecha]")}, se encuentra dentro del periodo de garantía y presenta el siguiente fallo:

${val(v.problem, "[describa el fallo]")}

Por encontrarse el producto en garantía, SOLICITO que se haga efectiva mediante su reparación o sustitución sin coste y en un plazo razonable, así como, en su caso, la entrega de una unidad de cortesía o la compensación por el tiempo sin servicio.

Le ruego me confirme por escrito el procedimiento a seguir y la fecha prevista de resolución.

${signOff(v, lang)}`;
    },
  },

  {
    id: "queja-formal",
    category: "consumo",
    icon: "📣",
    title: { es: "Presentar una queja formal a una empresa", en: "File a formal complaint with a company" },
    desc: { es: "Documento estructurado para dejar constancia de una mala experiencia y exigir una solución concreta.", en: "Structured document to formally record a bad experience and demand a specific remedy." },
    juris: { es: "Las hojas de reclamaciones son obligatorias en muchos comercios. Pide siempre tu copia sellada.", en: "Keep a stamped copy of any complaint form the business provides." },
    tips: {
      es: ["Sé objetivo: hechos, fechas y datos.", "Pide una solución concreta y un plazo.", "Indica el medio por el que quieres respuesta."],
      en: ["Stay factual: events, dates and figures.", "Ask for a specific remedy and a deadline.", "State how you want to be contacted."],
    },
    nextSteps: {
      es: ["Guarda copia y acuse de recibo.", "Si no responden en el plazo, escala a consumo.", "Considera reseñas y mediación como presión adicional."],
      en: ["Keep a copy and proof of receipt.", "If unanswered, escalate to a consumer body.", "Consider reviews and mediation as added pressure."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "email", type: "email", label: { es: "Tu email", en: "Your email" } },
      { name: "company", type: "text", req: true, label: { es: "Empresa", en: "Company" } },
      { name: "companyAddress", type: "textarea", label: { es: "Dirección de la empresa", en: "Company address" } },
      { name: "incidentDate", type: "date", req: true, label: { es: "Fecha del incidente", en: "Date of incident" } },
      { name: "facts", type: "textarea", req: true, label: { es: "Qué ocurrió", en: "What happened" } },
      { name: "request", type: "textarea", req: true, label: { es: "Qué solución pides", en: "Remedy requested" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.company, v.companyAddress, lang)}

Subject: Formal complaint

Dear Sir or Madam,

I am writing to formally lodge a complaint regarding an incident that occurred on ${val(v.incidentDate, "[date]")}.

Facts:
${val(v.facts, "[describe what happened]")}

This situation has caused me a clear detriment and is, in my view, contrary to the standard of service I am entitled to expect.

Requested remedy:
${val(v.request, "[state the remedy you want]")}

I request a written response within 14 days. Please treat this letter as a formal complaint for all relevant purposes.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.company, v.companyAddress, lang)}

Asunto: Queja formal

Estimados señores:

Por la presente formulo QUEJA FORMAL en relación con el incidente ocurrido el ${val(v.incidentDate, "[fecha]")}.

Hechos:
${val(v.facts, "[describa lo ocurrido]")}

Esta situación me ha causado un perjuicio evidente y resulta, a mi juicio, contraria a la calidad del servicio que tengo derecho a esperar.

Solución solicitada:
${val(v.request, "[indique la solución que desea]")}

Solicito respuesta por escrito en el plazo de 14 días. Ruego se tenga por presentada esta queja a todos los efectos.

${signOff(v, lang)}`;
    },
  },


  /* ===================== VIVIENDA ===================== */
  {
    id: "deposito-alquiler",
    category: "vivienda",
    icon: "🔑",
    title: { es: "Reclamar la fianza / depósito del alquiler", en: "Reclaim your rental security deposit" },
    desc: { es: "Exige al arrendador la devolución de la fianza retenida injustamente tras dejar la vivienda.", en: "Demand your landlord return a security deposit unfairly withheld after you moved out." },
    juris: { es: "Los plazos de devolución varían (p. ej. 30 días en muchos lugares). El desgaste normal no justifica retenciones.", en: "Return deadlines vary (e.g. 30 days in many places). Normal wear and tear cannot justify deductions." },
    tips: {
      es: ["Adjunta fotos del estado de salida y el inventario de entrada.", "Reclama intereses si la ley los prevé.", "Da una cuenta para la transferencia."],
      en: ["Attach move-out photos and the move-in inventory.", "Claim interest if the law allows it.", "Provide an account for the transfer."],
    },
    nextSteps: {
      es: ["Envía por medio fehaciente con acuse.", "Si no devuelven en plazo, reclama judicialmente (suele ser proceso rápido).", "Conserva todas las pruebas del estado del inmueble."],
      en: ["Send by a traceable method with receipt.", "If not returned in time, file a small-claims case.", "Keep all evidence of the property's condition."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección actual", en: "Your current address" } },
      { name: "email", type: "email", label: { es: "Tu email", en: "Your email" } },
      { name: "phone", type: "tel", label: { es: "Tu teléfono", en: "Your phone" } },
      { name: "landlord", type: "text", req: true, label: { es: "Nombre del arrendador", en: "Landlord's name" } },
      { name: "landlordAddress", type: "textarea", label: { es: "Dirección del arrendador", en: "Landlord's address" } },
      { name: "rental", type: "textarea", req: true, label: { es: "Dirección de la vivienda alquilada", en: "Rented property address" } },
      { name: "moveOut", type: "date", req: true, label: { es: "Fecha de fin del contrato / salida", en: "Move-out / lease end date" } },
      { name: "deposit", type: "money", req: true, label: { es: "Importe de la fianza", en: "Deposit amount" } },
      { name: "bankAccount", type: "text", label: { es: "Cuenta para la devolución (IBAN)", en: "Account for refund (IBAN)" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.landlord, v.landlordAddress, lang)}

Subject: Return of security deposit — ${val(v.rental, "[property]")}

Dear ${val(v.landlord, "[landlord]")},

I vacated the property at ${val(v.rental, "[property address]")} on ${val(v.moveOut, "[date]")}, returning it in good condition allowing for normal wear and tear.

To date the security deposit of ${money(v.deposit)} has not been returned to me. I hereby request its full return within 14 days of receipt of this letter${v.bankAccount ? `, by transfer to account ${v.bankAccount}` : ""}.

If you intend to make any deduction, you must provide an itemised, evidenced breakdown; otherwise the full amount is due. Should the deposit not be returned within the stated period, I will initiate legal proceedings to recover it together with statutory interest and costs.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.landlord, v.landlordAddress, lang)}

Asunto: Devolución de fianza — ${val(v.rental, "[vivienda]")}

Estimado/a ${val(v.landlord, "[arrendador]")}:

El día ${val(v.moveOut, "[fecha]")} dejé la vivienda sita en ${val(v.rental, "[dirección]")}, entregándola en buen estado salvo el desgaste normal por el uso.

A día de hoy no se me ha devuelto la fianza por importe de ${money(v.deposit)}. Por la presente RECLAMO su devolución íntegra en el plazo de 14 días desde la recepción de este escrito${v.bankAccount ? `, mediante transferencia a la cuenta ${v.bankAccount}` : ""}.

Si pretende practicar alguna deducción, deberá justificarla de forma detallada y documentada; en caso contrario procede la devolución total. De no devolverse la fianza en el plazo indicado, iniciaré las acciones legales oportunas para su reclamación, junto con los intereses legales y las costas.

${signOff(v, lang)}`;
    },
  },

  {
    id: "reparaciones-arrendador",
    category: "vivienda",
    icon: "🚿",
    title: { es: "Exigir reparaciones al arrendador", en: "Demand repairs from your landlord" },
    desc: { es: "Requerimiento formal para que el propietario realice reparaciones necesarias para la habitabilidad.", en: "Formal demand for the landlord to carry out repairs needed for habitability." },
    juris: { es: "El arrendador suele estar obligado a mantener la vivienda en condiciones de uso. Algunos defectos permiten retener renta o resolver el contrato.", en: "Landlords are generally required to keep the home habitable. Some defects may allow rent withholding or lease termination." },
    tips: {
      es: ["Detalla cada desperfecto y su impacto.", "Fija un plazo razonable.", "Avisa de que documentarás el estado."],
      en: ["List each defect and its impact.", "Set a reasonable deadline.", "Note that you will document the condition."],
    },
    nextSteps: {
      es: ["Envía con acuse de recibo.", "Documenta con fotos y fechas.", "Si no actúa, consulta opciones de reparación a su cargo o reclamación."],
      en: ["Send with proof of receipt.", "Document with photos and dates.", "If ignored, explore repair-and-deduct or legal action."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección (la vivienda)", en: "Your address (the property)" } },
      { name: "email", type: "email", label: { es: "Tu email", en: "Your email" } },
      { name: "phone", type: "tel", label: { es: "Tu teléfono", en: "Your phone" } },
      { name: "landlord", type: "text", req: true, label: { es: "Nombre del arrendador", en: "Landlord's name" } },
      { name: "landlordAddress", type: "textarea", label: { es: "Dirección del arrendador", en: "Landlord's address" } },
      { name: "issues", type: "textarea", req: true, label: { es: "Reparaciones necesarias", en: "Repairs needed" } },
      { name: "reportedDate", type: "date", label: { es: "Fecha del primer aviso (si lo hubo)", en: "Date first reported (if any)" } },
      { name: "deadlineDays", type: "number", label: { es: "Plazo que concedes (días)", en: "Deadline you grant (days)" } },
    ],
    build(v, lang) {
      const days = val(v.deadlineDays, "14");
      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.landlord, v.landlordAddress, lang)}

Subject: Request for repairs — ${val(v.address, "[property]")}

Dear ${val(v.landlord, "[landlord]")},

As tenant of the property indicated above, I formally notify you of the following defects requiring repair:

${val(v.issues, "[list the repairs needed]")}
${v.reportedDate ? `\nThese were first reported on ${v.reportedDate} and remain unresolved.\n` : ""}
These conditions affect the proper use and habitability of the dwelling. I request that the necessary repairs be carried out within ${days} days of receipt of this letter.

Failing that, I reserve the right to exercise all legal remedies available to me, which may include arranging the repairs and deducting their cost, requesting a rent reduction, or terminating the lease, in addition to claiming any damages caused.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

${recipientBlock(v.landlord, v.landlordAddress, lang)}

Asunto: Requerimiento de reparaciones — ${val(v.address, "[vivienda]")}

Estimado/a ${val(v.landlord, "[arrendador]")}:

Como arrendatario/a de la vivienda indicada, le comunico formalmente los siguientes desperfectos que precisan reparación:

${val(v.issues, "[detalle las reparaciones]")}
${v.reportedDate ? `\nFueron comunicados por primera vez el ${v.reportedDate} sin que se hayan resuelto.\n` : ""}
Estas deficiencias afectan al uso adecuado y a la habitabilidad de la vivienda. Le REQUIERO para que ejecute las reparaciones necesarias en el plazo de ${days} días desde la recepción de este escrito.

En su defecto, me reservo el derecho de ejercer cuantas acciones legales me asistan, que podrán incluir realizar las reparaciones a su cargo, solicitar una reducción de la renta o instar la resolución del contrato, además de reclamar los daños y perjuicios ocasionados.

${signOff(v, lang)}`;
    },
  },

  /* ===================== TRANSPORTE ===================== */
  {
    id: "multa-trafico",
    category: "transporte",
    icon: "🅿️",
    title: { es: "Recurrir una multa de tráfico o aparcamiento", en: "Appeal a traffic or parking ticket" },
    desc: { es: "Escrito de alegaciones para impugnar una sanción de tráfico o estacionamiento.", en: "Written appeal to challenge a traffic or parking penalty." },
    juris: { es: "Los plazos para alegar son cortos (a menudo 15-20 días). Revisa el reverso de la notificación.", en: "Appeal windows are short (often 15-30 days). Check the back of the notice." },
    tips: {
      es: ["Identifica vicios de forma (señalización, notificación, datos erróneos).", "Adjunta fotos y pruebas.", "Solicita el pronto pago solo si renuncias a recurrir."],
      en: ["Identify procedural defects (signage, notice, wrong data).", "Attach photos and evidence.", "Beware: early payment usually waives your appeal."],
    },
    nextSteps: {
      es: ["Presenta dentro del plazo por registro o sede electrónica.", "Guarda el justificante de presentación.", "Si desestiman, valora el recurso de alzada o contencioso."],
      en: ["File within the deadline through the proper channel.", "Keep proof of filing.", "If rejected, consider the next level of appeal."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "idNumber", type: "text", label: { es: "DNI / documento de identidad", en: "ID number" } },
      { name: "address", type: "textarea", req: true, label: { es: "Tu dirección", en: "Your address" } },
      { name: "authority", type: "text", req: true, label: { es: "Organismo sancionador (ayuntamiento, DGT...)", en: "Issuing authority" } },
      { name: "ticketNumber", type: "text", req: true, label: { es: "Nº de expediente / boletín", en: "Ticket / file number" } },
      { name: "plate", type: "text", label: { es: "Matrícula del vehículo", en: "Vehicle plate" } },
      { name: "ticketDate", type: "date", req: true, label: { es: "Fecha de la denuncia", en: "Date of the ticket" } },
      { name: "amount", type: "money", label: { es: "Importe de la multa", en: "Fine amount" } },
      { name: "grounds", type: "textarea", req: true, label: { es: "Motivos de tu recurso", en: "Grounds for your appeal" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${val(v.fullName, "[Your full name]")}${v.idNumber ? `, ID ${v.idNumber}` : ""}
${val(v.address, "[Your address]")}

${dateLine(lang)}

To: ${val(v.authority, "[issuing authority]")}

Subject: Appeal against penalty — File no. ${val(v.ticketNumber, "[file no.]")}

To whom it may concern,

I, the undersigned, having received notice of the penalty referenced above${v.plate ? `, concerning vehicle with plate ${v.plate}` : ""}, dated ${val(v.ticketDate, "[date]")}${v.amount ? ` for the amount of ${money(v.amount)}` : ""}, hereby submit the following ALLEGATIONS in time and form:

${val(v.grounds, "[set out your grounds]")}

For the foregoing reasons, I respectfully REQUEST that this appeal be admitted, the proceedings reviewed and the penalty annulled, with all consequent legal effects. I request to be notified of the resolution at the address stated above.

I attach the supporting evidence referred to herein.

${val(v.fullName, "[Your full name]")}
(Signature)`;
      }
      return `${val(v.fullName, "[Tu nombre completo]")}${v.idNumber ? `, DNI ${v.idNumber}` : ""}
${val(v.address, "[Tu dirección]")}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.authority, "[organismo]")}

Asunto: Alegaciones / recurso contra sanción — Expediente nº ${val(v.ticketNumber, "[expediente]")}

Por medio del presente escrito, el abajo firmante, habiendo recibido notificación de la denuncia de referencia${v.plate ? `, relativa al vehículo con matrícula ${v.plate}` : ""}, de fecha ${val(v.ticketDate, "[fecha]")}${v.amount ? ` y por importe de ${money(v.amount)}` : ""}, formula en tiempo y forma las siguientes ALEGACIONES:

${val(v.grounds, "[exponga sus motivos]")}

Por lo expuesto, SOLICITO que se tengan por presentadas estas alegaciones, se revise el expediente y se acuerde el archivo y la anulación de la sanción, con los efectos legales que correspondan. Solicito ser notificado de la resolución en el domicilio indicado.

Acompaño la documentación acreditativa a la que hago referencia.

${val(v.fullName, "[Tu nombre completo]")}
(Firma)`;
    },
  },

  {
    id: "compensacion-vuelo",
    category: "transporte",
    icon: "✈️",
    title: { es: "Compensación por vuelo retrasado o cancelado", en: "Compensation for a delayed or cancelled flight" },
    desc: { es: "Reclama a la aerolínea la compensación y gastos por retraso, cancelación o denegación de embarque.", en: "Claim compensation and expenses from the airline for delay, cancellation or denied boarding." },
    juris: { es: "En la UE, el Reglamento (CE) 261/2004 da hasta 600€ según distancia. En otros países revisa la normativa local del transportista.", en: "In the EU, Regulation 261/2004 grants up to €600 by distance. Elsewhere, check the carrier's local rules." },
    tips: {
      es: ["Indica la causa del retraso si la conoces.", "Conserva tarjetas de embarque y gastos.", "Reclama también comida, hotel y transporte si procede."],
      en: ["State the cause of delay if known.", "Keep boarding passes and expense receipts.", "Also claim meals, hotel and transport if applicable."],
    },
    nextSteps: {
      es: ["Envía a atención al cliente de la aerolínea.", "Si no responden en 1 mes, acude al organismo nacional (AESA en España).", "Valora plataformas de reclamación si lo prefieres."],
      en: ["Send to the airline's customer service.", "If unanswered in a month, escalate to the national authority.", "Consider claim platforms if preferred."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "email", type: "email", label: { es: "Tu email", en: "Your email" } },
      { name: "airline", type: "text", req: true, label: { es: "Aerolínea", en: "Airline" } },
      { name: "flightNumber", type: "text", req: true, label: { es: "Nº de vuelo", en: "Flight number" } },
      { name: "flightDate", type: "date", req: true, label: { es: "Fecha del vuelo", en: "Flight date" } },
      { name: "route", type: "text", req: true, label: { es: "Ruta (origen → destino)", en: "Route (from → to)" } },
      { name: "bookingRef", type: "text", label: { es: "Localizador de reserva", en: "Booking reference" } },
      { name: "incident", type: "select", req: true, label: { es: "Tipo de incidencia", en: "Type of incident" },
        options: [
          { value: "retraso", label: { es: "Retraso (3h o más)", en: "Delay (3h+)" } },
          { value: "cancelacion", label: { es: "Cancelación", en: "Cancellation" } },
          { value: "overbooking", label: { es: "Denegación de embarque", en: "Denied boarding" } },
        ] },
      { name: "delayHours", type: "number", label: { es: "Horas de retraso en destino", en: "Hours delayed at arrival" } },
      { name: "expenses", type: "money", label: { es: "Gastos extra asumidos", en: "Extra expenses incurred" } },
    ],
    build(v, lang) {
      const inc = {
        retraso: { es: "un retraso", en: "a delay" },
        cancelacion: { es: "la cancelación", en: "the cancellation" },
        overbooking: { es: "una denegación de embarque", en: "denied boarding" },
      }[v.incident] || { es: "una incidencia", en: "an incident" };

      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

To: ${val(v.airline, "[airline]")} — Customer Relations

Subject: Compensation claim — Flight ${val(v.flightNumber, "[flight]")}, ${val(v.flightDate, "[date]")}${v.bookingRef ? ` (Booking ${v.bookingRef})` : ""}

Dear Sir or Madam,

I was a confirmed passenger on flight ${val(v.flightNumber, "[flight]")} (${val(v.route, "[route]")}) scheduled for ${val(v.flightDate, "[date]")}. The flight was affected by ${inc.en}${v.delayHours ? `, resulting in an arrival delay of ${v.delayHours} hours` : ""}.

Under the applicable air-passenger rights legislation (in the EU, Regulation (EC) No 261/2004), I am entitled to financial compensation according to the distance of the flight, as well as reimbursement of reasonable expenses${v.expenses ? ` (in my case ${money(v.expenses)})` : ""}.

I therefore claim the corresponding standardised compensation and the refund of my expenses, to be paid within 14 days. Please confirm the amount and the payment method.

Unless the airline can prove extraordinary circumstances that could not have been avoided, the compensation is due in full.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.airline, "[aerolínea]")} — Atención al cliente

Asunto: Reclamación de compensación — Vuelo ${val(v.flightNumber, "[vuelo]")}, ${val(v.flightDate, "[fecha]")}${v.bookingRef ? ` (Localizador ${v.bookingRef})` : ""}

Estimados señores:

Era pasajero/a con reserva confirmada en el vuelo ${val(v.flightNumber, "[vuelo]")} (${val(v.route, "[ruta]")}) previsto para el ${val(v.flightDate, "[fecha]")}. El vuelo se vio afectado por ${inc.es}${v.delayHours ? `, con un retraso en la llegada de ${v.delayHours} horas` : ""}.

Conforme a la normativa de derechos de los pasajeros aéreos (en la UE, el Reglamento (CE) nº 261/2004), me corresponde una compensación económica en función de la distancia del vuelo, así como el reembolso de los gastos razonables${v.expenses ? ` (en mi caso ${money(v.expenses)})` : ""}.

Por ello, RECLAMO la compensación estandarizada que proceda y el reembolso de mis gastos, a abonar en el plazo de 14 días. Le ruego me confirme el importe y la forma de pago.

Salvo que la aerolínea acredite circunstancias extraordinarias que no pudieran evitarse, la compensación es plenamente exigible.

${signOff(v, lang)}`;
    },
  },


  /* ===================== FINANZAS ===================== */
  {
    id: "contracargo-banco",
    category: "finanzas",
    icon: "💳",
    title: { es: "Solicitar un contracargo (chargeback)", en: "Request a chargeback" },
    desc: { es: "Disputa un cargo no reconocido, duplicado o por un servicio no prestado ante tu banco o emisor de la tarjeta.", en: "Dispute an unrecognized, duplicate or undelivered charge with your bank or card issuer." },
    juris: { es: "Los plazos de disputa suelen ser de 60-120 días desde el cargo. Las reglas dependen de Visa/Mastercard y tu banco.", en: "Dispute windows are typically 60-120 days. Rules depend on Visa/Mastercard and your bank." },
    tips: {
      es: ["Indica si intentaste resolverlo con el comercio.", "Adjunta el extracto con el cargo señalado.", "Pide el bloqueo de cargos futuros si es fraude."],
      en: ["State whether you tried to resolve it with the merchant.", "Attach the statement with the charge highlighted.", "Ask to block future charges if it is fraud."],
    },
    nextSteps: {
      es: ["Presenta la disputa por escrito y guarda el número de caso.", "Aporta pruebas si el banco las pide.", "Vigila el abono provisional y la resolución."],
      en: ["File the dispute in writing and keep the case number.", "Provide evidence if the bank asks.", "Watch for provisional credit and the final decision."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "email", type: "email", label: { es: "Tu email", en: "Your email" } },
      { name: "bank", type: "text", req: true, label: { es: "Banco / emisor de la tarjeta", en: "Bank / card issuer" } },
      { name: "cardLast4", type: "text", req: true, label: { es: "Últimos 4 dígitos de la tarjeta", en: "Last 4 digits of card" } },
      { name: "merchant", type: "text", req: true, label: { es: "Comercio del cargo", en: "Merchant" } },
      { name: "chargeDate", type: "date", req: true, label: { es: "Fecha del cargo", en: "Charge date" } },
      { name: "amount", type: "money", req: true, label: { es: "Importe del cargo", en: "Charge amount" } },
      { name: "reason", type: "select", req: true, label: { es: "Motivo de la disputa", en: "Reason for dispute" },
        options: [
          { value: "fraude", label: { es: "Cargo no reconocido / fraude", en: "Unrecognized / fraud" } },
          { value: "duplicado", label: { es: "Cargo duplicado", en: "Duplicate charge" } },
          { value: "no-recibido", label: { es: "Producto/servicio no recibido", en: "Goods/services not received" } },
          { value: "no-cancelado", label: { es: "Suscripción ya cancelada", en: "Already-cancelled subscription" } },
        ] },
      { name: "details", type: "textarea", label: { es: "Detalles adicionales", en: "Additional details" } },
    ],
    build(v, lang) {
      const reason = {
        fraude: { es: "no reconozco el cargo y considero que es fraudulento", en: "I do not recognize the charge and believe it to be fraudulent" },
        duplicado: { es: "se trata de un cargo duplicado por una misma operación", en: "this is a duplicate charge for a single transaction" },
        "no-recibido": { es: "no he recibido el producto o servicio abonado", en: "I did not receive the goods or services paid for" },
        "no-cancelado": { es: "corresponde a una suscripción que ya había cancelado", en: "it relates to a subscription I had already cancelled" },
      }[v.reason] || { es: "el cargo es incorrecto", en: "the charge is incorrect" };

      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

To: ${val(v.bank, "[bank]")} — Disputes Department

Subject: Chargeback request — card ending ${val(v.cardLast4, "[####]")}

Dear Sir or Madam,

I wish to formally dispute the following charge on my card ending in ${val(v.cardLast4, "[####]")}:

• Merchant: ${val(v.merchant, "[merchant]")}
• Date: ${val(v.chargeDate, "[date]")}
• Amount: ${money(v.amount)}

The reason for the dispute is that ${reason.en}.
${v.details ? `\nAdditional details: ${v.details}\n` : ""}
I therefore request that you initiate a chargeback, reverse the transaction and credit my account for the disputed amount, in accordance with the applicable card-scheme rules and consumer-protection law. ${v.reason === "fraude" ? "As this may be fraud, I also request that my card be secured against further unauthorized charges." : ""}

Please confirm the case reference and the expected resolution date.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.bank, "[banco]")} — Departamento de incidencias

Asunto: Solicitud de contracargo — tarjeta terminada en ${val(v.cardLast4, "[####]")}

Estimados señores:

Deseo DISPUTAR formalmente el siguiente cargo en mi tarjeta terminada en ${val(v.cardLast4, "[####]")}:

• Comercio: ${val(v.merchant, "[comercio]")}
• Fecha: ${val(v.chargeDate, "[fecha]")}
• Importe: ${money(v.amount)}

El motivo de la disputa es que ${reason.es}.
${v.details ? `\nDetalles adicionales: ${v.details}\n` : ""}
Por lo anterior, SOLICITO que inicien el procedimiento de contracargo, revoquen la operación y abonen en mi cuenta el importe disputado, conforme a las reglas de la red de tarjetas y a la normativa de protección al consumidor. ${v.reason === "fraude" ? "Al poder tratarse de un fraude, solicito además que se proteja mi tarjeta frente a nuevos cargos no autorizados." : ""}

Le ruego me confirme el número de caso y la fecha prevista de resolución.

${signOff(v, lang)}`;
    },
  },

  {
    id: "validacion-deuda",
    category: "finanzas",
    icon: "📨",
    title: { es: "Disputar / pedir validación de una deuda", en: "Dispute / request validation of a debt" },
    desc: { es: "Obliga a una empresa de cobros a demostrar que la deuda es tuya y es exigible antes de pagar.", en: "Force a debt collector to prove the debt is yours and valid before you pay." },
    juris: { es: "En EE. UU. el FDCPA da derecho a validación en 30 días. En la UE puedes exigir prueba del crédito y oponerte a cobros indebidos.", en: "In the US, the FDCPA grants a 30-day validation right. In the EU you may demand proof and object to undue collection." },
    tips: {
      es: ["No reconozcas la deuda en el escrito.", "Exige documento original del crédito.", "Pide que dejen de contactarte salvo por escrito."],
      en: ["Do not admit the debt in the letter.", "Demand the original credit document.", "Ask them to contact you only in writing."],
    },
    nextSteps: {
      es: ["Envía con acuse y conserva copia.", "Si no validan, no pueden seguir cobrando.", "Denuncia prácticas abusivas ante el regulador."],
      en: ["Send with proof and keep a copy.", "If they cannot validate, they must stop collecting.", "Report abusive practices to the regulator."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", req: true, label: { es: "Tu dirección", en: "Your address" } },
      { name: "collector", type: "text", req: true, label: { es: "Empresa de cobros", en: "Collection agency" } },
      { name: "collectorAddress", type: "textarea", label: { es: "Dirección de la empresa", en: "Agency address" } },
      { name: "refNumber", type: "text", req: true, label: { es: "Nº de referencia / expediente", en: "Reference / account no." } },
      { name: "amount", type: "money", label: { es: "Importe reclamado", en: "Amount claimed" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${val(v.fullName, "[Your full name]")}
${val(v.address, "[Your address]")}

${dateLine(lang)}

To: ${val(v.collector, "[collection agency]")}
${val(v.collectorAddress, "[agency address]")}

Subject: Debt validation request — Ref. ${val(v.refNumber, "[ref]")}

Dear Sir or Madam,

I am writing in response to your communication regarding an alleged debt (reference ${val(v.refNumber, "[ref]")}${v.amount ? `, amount ${money(v.amount)}` : ""}). This is not an acknowledgement of the debt.

I dispute this debt and request that you provide written validation, including:
1. The name and address of the original creditor.
2. A copy of the original signed agreement or document giving rise to the debt.
3. A detailed breakdown of the amount claimed, including any interest and fees.
4. Evidence that you are legally entitled to collect this debt.

Until you provide this validation, I require that you cease all collection activity. I further request that you contact me only in writing at the address above.

${signOff(v, lang)}`;
      }
      return `${val(v.fullName, "[Tu nombre completo]")}
${val(v.address, "[Tu dirección]")}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.collector, "[empresa de cobros]")}
${val(v.collectorAddress, "[dirección]")}

Asunto: Solicitud de validación de deuda — Ref. ${val(v.refNumber, "[ref]")}

Estimados señores:

En relación con su comunicación sobre una supuesta deuda (referencia ${val(v.refNumber, "[ref]")}${v.amount ? `, importe ${money(v.amount)}` : ""}), les manifiesto que este escrito NO supone reconocimiento alguno de la deuda.

OPONGO la deuda y les requiero que aporten validación por escrito, incluyendo:
1. Nombre y dirección del acreedor original.
2. Copia del contrato o documento firmado que origina la deuda.
3. Desglose detallado del importe reclamado, con intereses y comisiones.
4. Acreditación de que están legitimados para cobrar esta deuda.

Hasta que aporten dicha validación, les requiero que CESEN toda actividad de cobro. Asimismo, solicito que se comuniquen conmigo únicamente por escrito en la dirección indicada.

${signOff(v, lang)}`;
    },
  },

  {
    id: "disputa-credito",
    category: "finanzas",
    icon: "📊",
    title: { es: "Corregir un error en tu informe de crédito", en: "Fix an error on your credit report" },
    desc: { es: "Solicita la rectificación o eliminación de datos incorrectos en un fichero de solvencia (ASNEF, buró de crédito).", en: "Request correction or deletion of inaccurate data in a credit file." },
    juris: { es: "Tienes derecho a rectificación de datos inexactos (RGPD en la UE; FCRA en EE. UU.). Los ficheros deben investigar en plazo.", en: "You have a right to correct inaccurate data (GDPR in the EU; FCRA in the US). Bureaus must investigate within a deadline." },
    tips: {
      es: ["Identifica exactamente el dato erróneo.", "Adjunta prueba de pago o del error.", "Pide notificación del resultado."],
      en: ["Pinpoint exactly the wrong entry.", "Attach proof of payment or of the error.", "Ask to be notified of the outcome."],
    },
    nextSteps: {
      es: ["Envía a la entidad de crédito y al acreedor.", "Si no corrigen, reclama ante la autoridad de datos.", "Vuelve a comprobar tu informe tras la corrección."],
      en: ["Send to the bureau and the data furnisher.", "If not fixed, complain to the data authority.", "Re-check your report after correction."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "idNumber", type: "text", label: { es: "DNI / identificación", en: "ID number" } },
      { name: "address", type: "textarea", req: true, label: { es: "Tu dirección", en: "Your address" } },
      { name: "bureau", type: "text", req: true, label: { es: "Fichero / agencia de crédito", en: "Credit bureau" } },
      { name: "creditor", type: "text", label: { es: "Acreedor que reporta el dato", en: "Creditor reporting the entry" } },
      { name: "wrongEntry", type: "textarea", req: true, label: { es: "Dato incorrecto a corregir", en: "Inaccurate entry to fix" } },
      { name: "correctInfo", type: "textarea", label: { es: "Información correcta", en: "Correct information" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${val(v.fullName, "[Your full name]")}${v.idNumber ? `, ID ${v.idNumber}` : ""}
${val(v.address, "[Your address]")}

${dateLine(lang)}

To: ${val(v.bureau, "[credit bureau]")}

Subject: Dispute of inaccurate credit information

Dear Sir or Madam,

I have identified the following inaccurate information in my credit file${v.creditor ? `, reported by ${v.creditor}` : ""}:

${val(v.wrongEntry, "[describe the inaccurate entry]")}
${v.correctInfo ? `\nThe correct information is:\n${v.correctInfo}\n` : ""}
Under the applicable data-protection and fair-credit legislation, I request that you investigate this matter and correct or delete the inaccurate data, and that you notify any party to whom the data was disclosed. I attach supporting evidence.

Please confirm in writing the outcome of your investigation within the statutory period.

${signOff(v, lang)}`;
      }
      return `${val(v.fullName, "[Tu nombre completo]")}${v.idNumber ? `, DNI ${v.idNumber}` : ""}
${val(v.address, "[Tu dirección]")}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.bureau, "[fichero de crédito]")}

Asunto: Rectificación de información crediticia inexacta

Estimados señores:

He detectado la siguiente información inexacta en mi fichero de solvencia${v.creditor ? `, comunicada por ${v.creditor}` : ""}:

${val(v.wrongEntry, "[describa el dato inexacto]")}
${v.correctInfo ? `\nLa información correcta es:\n${v.correctInfo}\n` : ""}
Conforme a la normativa de protección de datos y de información crediticia, SOLICITO que investiguen este asunto y rectifiquen o supriman el dato inexacto, así como que lo notifiquen a quienes se hubiera comunicado dicha información. Adjunto la documentación acreditativa.

Le ruego confirme por escrito el resultado de la investigación dentro del plazo legal.

${signOff(v, lang)}`;
    },
  },

  {
    id: "factura-medica",
    category: "finanzas",
    icon: "🏥",
    title: { es: "Disputar o negociar una factura médica", en: "Dispute or negotiate a medical bill" },
    desc: { es: "Cuestiona cargos incorrectos, pide desglose detallado o negocia un descuento o plan de pago.", en: "Challenge incorrect charges, request an itemized bill, or negotiate a discount or payment plan." },
    juris: { es: "Puedes exigir factura detallada y revisar conceptos duplicados. En algunos sistemas existe protección frente a facturas sorpresa.", en: "You can request an itemized bill and review duplicate items. Some systems protect against surprise bills." },
    tips: {
      es: ["Pide la factura desglosada por código.", "Compara con lo cubierto por tu seguro.", "Propón un importe o plan realista."],
      en: ["Request an itemized bill by code.", "Compare with what your insurer covers.", "Propose a realistic amount or plan."],
    },
    nextSteps: {
      es: ["Envía la disputa y pausa el pago del importe discutido.", "Solicita revisión y respuesta por escrito.", "Si procede, pide ayuda financiera del centro."],
      en: ["Send the dispute and hold payment of the disputed part.", "Request a review and written reply.", "If eligible, ask about financial assistance."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "patientId", type: "text", label: { es: "Nº de paciente / historia", en: "Patient / account no." } },
      { name: "provider", type: "text", req: true, label: { es: "Centro / proveedor médico", en: "Provider / clinic" } },
      { name: "invoiceNumber", type: "text", req: true, label: { es: "Nº de factura", en: "Invoice number" } },
      { name: "amount", type: "money", label: { es: "Importe en disputa", en: "Amount in dispute" } },
      { name: "issue", type: "textarea", req: true, label: { es: "Qué quieres disputar o negociar", en: "What you want to dispute or negotiate" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

To: ${val(v.provider, "[provider]")} — Billing Department

Subject: Dispute of medical bill — Invoice ${val(v.invoiceNumber, "[invoice]")}${v.patientId ? `, Patient ${v.patientId}` : ""}

Dear Sir or Madam,

I am writing regarding invoice ${val(v.invoiceNumber, "[invoice]")}${v.amount ? ` in the amount of ${money(v.amount)}` : ""}. After reviewing it, I wish to raise the following:

${val(v.issue, "[describe the issue]")}

I request a fully itemized statement of all charges (by service/procedure code) and a review of the disputed items. Pending this review, I respectfully ask that no late fees be applied and that the account not be referred to collections.

If the balance is confirmed as correct, I am willing to discuss a reasonable discount or an affordable payment plan. Please respond in writing.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.provider, "[centro médico]")} — Departamento de facturación

Asunto: Disputa de factura médica — Factura ${val(v.invoiceNumber, "[factura]")}${v.patientId ? `, Paciente ${v.patientId}` : ""}

Estimados señores:

Me dirijo a ustedes en relación con la factura ${val(v.invoiceNumber, "[factura]")}${v.amount ? ` por importe de ${money(v.amount)}` : ""}. Tras revisarla, deseo plantear lo siguiente:

${val(v.issue, "[describa el problema]")}

SOLICITO una factura detallada de todos los conceptos (por código de servicio/procedimiento) y la revisión de los importes en disputa. Mientras dure dicha revisión, ruego que no se apliquen recargos por demora ni se remita el expediente a cobros.

Si se confirma que el saldo es correcto, estoy dispuesto/a a estudiar un descuento razonable o un plan de pago asumible. Le ruego responda por escrito.

${signOff(v, lang)}`;
    },
  },


  /* ===================== PRIVACIDAD ===================== */
  {
    id: "acceso-datos",
    category: "privacidad",
    icon: "🗂️",
    title: { es: "Solicitar acceso a tus datos personales", en: "Request access to your personal data" },
    desc: { es: "Ejerce tu derecho de acceso para saber qué datos tiene una empresa sobre ti y cómo los usa.", en: "Exercise your right of access to learn what data a company holds about you and how it is used." },
    juris: { es: "RGPD art. 15 (UE) y CCPA (California) obligan a responder, normalmente en 1 mes y de forma gratuita.", en: "GDPR art. 15 (EU) and CCPA (California) require a response, usually within a month and free of charge." },
    tips: {
      es: ["Identifícate para que verifiquen tu identidad.", "Pide también finalidades, plazos y destinatarios.", "Solicita el formato que prefieras."],
      en: ["Identify yourself so they can verify you.", "Also ask for purposes, retention and recipients.", "Request your preferred format."],
    },
    nextSteps: {
      es: ["Envía al delegado de protección de datos o a privacidad.", "Si no responden en plazo, reclama ante la autoridad de datos.", "Conserva la solicitud y la fecha."],
      en: ["Send to the data protection officer or privacy team.", "If no reply in time, complain to the data authority.", "Keep the request and its date."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "idNumber", type: "text", label: { es: "DNI / identificación", en: "ID number" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "email", type: "email", req: true, label: { es: "Tu email", en: "Your email" } },
      { name: "company", type: "text", req: true, label: { es: "Empresa / responsable del tratamiento", en: "Company / data controller" } },
      { name: "companyAddress", type: "textarea", label: { es: "Dirección de la empresa", en: "Company address" } },
      { name: "details", type: "textarea", label: { es: "Datos concretos que te interesan (opcional)", en: "Specific data of interest (optional)" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${senderBlock(v, lang)}${v.idNumber ? `\nID: ${v.idNumber}` : ""}

${dateLine(lang)}

To: ${val(v.company, "[company]")} — Data Protection Officer
${val(v.companyAddress, "")}

Subject: Subject access request (right of access)

Dear Sir or Madam,

Under my right of access to personal data (Article 15 GDPR / applicable data-protection law), I request that you provide me with:

1. Confirmation of whether you process personal data concerning me.
2. A copy of all such personal data.
3. The purposes of the processing.
4. The categories of data and the recipients to whom it has been disclosed.
5. The retention period and the source of the data, where not collected from me.
${v.details ? `\nI am particularly interested in: ${v.details}\n` : ""}
Please provide the information free of charge and within one month, in a commonly used electronic format sent to the email above. I attach proof of identity if required.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}${v.idNumber ? `\nDNI: ${v.idNumber}` : ""}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.company, "[empresa]")} — Delegado de Protección de Datos
${val(v.companyAddress, "")}

Asunto: Ejercicio del derecho de acceso a datos personales

Estimados señores:

Al amparo de mi derecho de acceso a los datos personales (artículo 15 del RGPD y normativa aplicable), SOLICITO que me faciliten:

1. Confirmación de si tratan datos personales que me conciernen.
2. Una copia de todos esos datos personales.
3. Las finalidades del tratamiento.
4. Las categorías de datos y los destinatarios a los que se hayan comunicado.
5. El plazo de conservación y el origen de los datos, cuando no se hayan obtenido de mí.
${v.details ? `\nMe interesan especialmente: ${v.details}\n` : ""}
Les ruego faciliten la información de forma gratuita y en el plazo de un mes, en formato electrónico de uso común al correo indicado. Adjunto acreditación de identidad si fuera necesaria.

${signOff(v, lang)}`;
    },
  },

  {
    id: "supresion-datos",
    category: "privacidad",
    icon: "🧹",
    title: { es: "Solicitar la eliminación de tus datos", en: "Request deletion of your data" },
    desc: { es: "Ejerce el derecho de supresión («derecho al olvido») para que una empresa borre tus datos personales.", en: "Exercise the right to erasure ('right to be forgotten') so a company deletes your personal data." },
    juris: { es: "RGPD art. 17 (UE) y CCPA permiten pedir el borrado, con algunas excepciones legales (obligaciones de conservación).", en: "GDPR art. 17 (EU) and CCPA allow deletion requests, with some legal exceptions (retention duties)." },
    tips: {
      es: ["Indica el motivo (ya no son necesarios, retiras consentimiento...).", "Pide confirmación del borrado.", "Solicita que lo comuniquen a terceros."],
      en: ["State the reason (no longer needed, consent withdrawn...).", "Ask for confirmation of deletion.", "Ask them to notify third parties."],
    },
    nextSteps: {
      es: ["Envía a privacidad / DPO.", "Si se niegan sin base legal, reclama a la autoridad.", "Verifica que dejas de recibir comunicaciones."],
      en: ["Send to privacy / DPO.", "If refused without legal basis, complain to the authority.", "Verify communications stop."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "idNumber", type: "text", label: { es: "DNI / identificación", en: "ID number" } },
      { name: "email", type: "email", req: true, label: { es: "Tu email", en: "Your email" } },
      { name: "company", type: "text", req: true, label: { es: "Empresa / responsable", en: "Company / controller" } },
      { name: "companyAddress", type: "textarea", label: { es: "Dirección de la empresa", en: "Company address" } },
      { name: "reason", type: "textarea", label: { es: "Motivo de la solicitud (opcional)", en: "Reason for the request (optional)" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${val(v.fullName, "[Your full name]")}${v.idNumber ? `, ID ${v.idNumber}` : ""}
${v.email ? `Email: ${v.email}` : ""}

${dateLine(lang)}

To: ${val(v.company, "[company]")} — Data Protection Officer
${val(v.companyAddress, "")}

Subject: Request for erasure of personal data (right to be forgotten)

Dear Sir or Madam,

Under Article 17 GDPR / applicable data-protection law, I request the erasure of all personal data you hold about me${v.reason ? `, for the following reason: ${v.reason}` : ""}.

I also request that you:
1. Confirm the deletion in writing.
2. Communicate this request to any processors or third parties to whom the data was disclosed.
3. Cease any further processing, including marketing, with immediate effect.

If you believe a legal exception prevents deletion of part of the data, please specify which data and the precise legal basis. Please respond within one month.

${signOff(v, lang)}`;
      }
      return `${val(v.fullName, "[Tu nombre completo]")}${v.idNumber ? `, DNI ${v.idNumber}` : ""}
${v.email ? `Email: ${v.email}` : ""}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.company, "[empresa]")} — Delegado de Protección de Datos
${val(v.companyAddress, "")}

Asunto: Solicitud de supresión de datos personales (derecho al olvido)

Estimados señores:

Al amparo del artículo 17 del RGPD y normativa aplicable, SOLICITO la supresión de todos los datos personales que tengan sobre mí${v.reason ? `, por el siguiente motivo: ${v.reason}` : ""}.

Asimismo, solicito que:
1. Confirmen el borrado por escrito.
2. Comuniquen esta solicitud a los encargados o terceros a quienes se hayan cedido los datos.
3. Cesen cualquier tratamiento posterior, incluido el envío de comunicaciones comerciales, con efecto inmediato.

Si consideran que una excepción legal impide suprimir parte de los datos, indiquen qué datos y la base jurídica concreta. Les ruego respondan en el plazo de un mes.

${signOff(v, lang)}`;
    },
  },

  /* ===================== TRABAJO ===================== */
  {
    id: "salarios-impagados",
    category: "trabajo",
    icon: "💶",
    title: { es: "Reclamar salarios o nóminas impagadas", en: "Claim unpaid wages or salary" },
    desc: { es: "Requiere a tu empleador el pago de salarios, horas extra o finiquito pendientes.", en: "Demand your employer pay outstanding wages, overtime or final settlement." },
    juris: { es: "El impago salarial puede generar intereses por mora y, en algunos países, indemnización o extinción del contrato a instancia del trabajador.", en: "Unpaid wages can trigger interest and, in some countries, compensation or employee-initiated termination." },
    tips: {
      es: ["Detalla periodos e importes adeudados.", "Adjunta nóminas y contrato.", "Conserva pruebas de la jornada y horas extra."],
      en: ["Detail the periods and amounts owed.", "Attach payslips and contract.", "Keep records of hours and overtime."],
    },
    nextSteps: {
      es: ["Envía el requerimiento con acuse.", "Si no pagan, acude a inspección de trabajo o vía judicial.", "Valora la papeleta de conciliación previa si aplica."],
      en: ["Send the demand with proof of receipt.", "If unpaid, go to the labor authority or court.", "Consider mandatory conciliation if it applies."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "idNumber", type: "text", label: { es: "DNI / identificación", en: "ID number" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "employer", type: "text", req: true, label: { es: "Empresa / empleador", en: "Employer" } },
      { name: "employerAddress", type: "textarea", label: { es: "Dirección de la empresa", en: "Employer address" } },
      { name: "position", type: "text", label: { es: "Tu puesto", en: "Your position" } },
      { name: "periods", type: "textarea", req: true, label: { es: "Periodos e importes impagados", en: "Unpaid periods and amounts" } },
      { name: "totalAmount", type: "money", label: { es: "Total adeudado", en: "Total owed" } },
      { name: "bankAccount", type: "text", label: { es: "Cuenta para el pago (IBAN)", en: "Account for payment (IBAN)" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${val(v.fullName, "[Your full name]")}${v.idNumber ? `, ID ${v.idNumber}` : ""}
${val(v.address, "[Your address]")}

${dateLine(lang)}

To: ${val(v.employer, "[employer]")}
${val(v.employerAddress, "")}

Subject: Formal demand for payment of outstanding wages

Dear Sir or Madam,

As an employee of your company${v.position ? ` in the position of ${v.position}` : ""}, I hereby formally demand payment of the following outstanding wages:

${val(v.periods, "[detail periods and amounts]")}
${v.totalAmount ? `\nTotal amount owed: ${money(v.totalAmount)}\n` : ""}
I require payment within 7 days of receipt of this letter${v.bankAccount ? `, by transfer to account ${v.bankAccount}` : ""}, together with any applicable interest for late payment.

Should payment not be made within that period, I reserve the right to file a complaint with the labor authority and to bring a claim before the competent court, including any compensation to which I am entitled.

${signOff(v, lang)}`;
      }
      return `${val(v.fullName, "[Tu nombre completo]")}${v.idNumber ? `, DNI ${v.idNumber}` : ""}
${val(v.address, "[Tu dirección]")}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.employer, "[empresa]")}
${val(v.employerAddress, "")}

Asunto: Requerimiento formal de pago de salarios adeudados

Estimados señores:

Como trabajador/a de su empresa${v.position ? ` en el puesto de ${v.position}` : ""}, REQUIERO formalmente el pago de los siguientes salarios pendientes:

${val(v.periods, "[detalle periodos e importes]")}
${v.totalAmount ? `\nTotal adeudado: ${money(v.totalAmount)}\n` : ""}
Solicito el abono en el plazo de 7 días desde la recepción de este escrito${v.bankAccount ? `, mediante transferencia a la cuenta ${v.bankAccount}` : ""}, junto con los intereses por mora que correspondan.

De no producirse el pago en dicho plazo, me reservo el derecho de presentar denuncia ante la Inspección de Trabajo y de ejercer la reclamación judicial ante el juzgado competente, incluida la indemnización que en su caso me corresponda.

${signOff(v, lang)}`;
    },
  },


  /* ===================== TRÁMITES Y DISPUTAS ===================== */
  {
    id: "demanda-previa",
    category: "tramites",
    icon: "⚖️",
    title: { es: "Carta de reclamación previa (demand letter)", en: "Letter before claim (demand letter)" },
    desc: { es: "Último aviso formal antes de demandar: exige el pago o cumplimiento y anuncia acciones legales.", en: "Final formal notice before suing: demand payment or performance and announce legal action." },
    juris: { es: "En muchos sistemas, una reclamación previa por escrito es recomendable o incluso obligatoria antes de acudir a juicio.", en: "In many systems a written letter before claim is advisable or even required before going to court." },
    tips: {
      es: ["Resume los hechos y la cantidad exacta.", "Fija un plazo claro (p. ej. 14 días).", "Anuncia que iniciarás acciones e incluirás costas."],
      en: ["Summarize the facts and the exact amount.", "Set a clear deadline (e.g. 14 days).", "Announce you will sue and seek costs."],
    },
    nextSteps: {
      es: ["Envía por medio fehaciente con acuse.", "Si no responden, presenta la demanda (a menudo en juzgado de pequeñas cuantías).", "Guarda esta carta como prueba del intento de acuerdo."],
      en: ["Send by a traceable method with receipt.", "If ignored, file your claim (often small claims).", "Keep this letter as evidence you tried to settle."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "email", type: "email", label: { es: "Tu email", en: "Your email" } },
      { name: "recipient", type: "text", req: true, label: { es: "Persona / empresa reclamada", en: "Person / company you claim against" } },
      { name: "recipientAddress", type: "textarea", label: { es: "Su dirección", en: "Their address" } },
      { name: "facts", type: "textarea", req: true, label: { es: "Hechos y antecedentes", en: "Facts and background" } },
      { name: "amount", type: "money", label: { es: "Cantidad reclamada", en: "Amount claimed" } },
      { name: "demand", type: "textarea", req: true, label: { es: "Qué exiges exactamente", en: "Exactly what you demand" } },
      { name: "deadlineDays", type: "number", label: { es: "Plazo concedido (días)", en: "Deadline granted (days)" } },
    ],
    build(v, lang) {
      const days = val(v.deadlineDays, "14");
      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

To: ${val(v.recipient, "[recipient]")}
${val(v.recipientAddress, "")}

Subject: Letter before claim — formal demand

WITHOUT PREJUDICE SAVE AS TO COSTS

Dear ${val(v.recipient, "[recipient]")},

This letter constitutes a formal demand before the commencement of legal proceedings.

Background and facts:
${val(v.facts, "[set out the facts]")}

Demand:
${val(v.demand, "[state your demand]")}${v.amount ? `\n\nThe amount claimed is ${money(v.amount)}.` : ""}

I require that you comply with this demand within ${days} days of receipt of this letter. If you fail to do so, I will commence legal proceedings without further notice, and will seek recovery of the amount due together with interest and the costs of the action.

This letter is sent in a genuine attempt to resolve the matter amicably and will be relied upon before the court.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.recipient, "[reclamado]")}
${val(v.recipientAddress, "")}

Asunto: Reclamación previa — requerimiento formal

Estimado/a ${val(v.recipient, "[reclamado]")}:

El presente escrito constituye una RECLAMACIÓN PREVIA formal con carácter previo al ejercicio de acciones judiciales.

Antecedentes y hechos:
${val(v.facts, "[exponga los hechos]")}

Reclamación:
${val(v.demand, "[indique su reclamación]")}${v.amount ? `\n\nLa cantidad reclamada asciende a ${money(v.amount)}.` : ""}

Le REQUIERO para que dé cumplimiento a lo solicitado en el plazo de ${days} días desde la recepción de este escrito. De no hacerlo, iniciaré las acciones judiciales que correspondan sin más aviso, reclamando la cantidad debida junto con los intereses y las costas del procedimiento.

Este escrito se remite con ánimo de resolver el asunto de forma amistosa y será aportado como prueba ante el órgano judicial.

${signOff(v, lang)}`;
    },
  },

  {
    id: "cese-desista",
    category: "tramites",
    icon: "🛑",
    title: { es: "Carta de cese y desista", en: "Cease and desist letter" },
    desc: { es: "Exige a alguien que detenga una conducta ilícita: acoso, difamación, uso indebido de marca o impagos abusivos.", en: "Demand someone stop unlawful conduct: harassment, defamation, IP misuse or abusive collection." },
    juris: { es: "Una carta de cese no es una orden judicial, pero deja constancia formal y suele frenar la conducta. Guarda copia.", en: "A cease-and-desist is not a court order, but it creates a formal record and often stops the conduct. Keep a copy." },
    tips: {
      es: ["Describe la conducta y por qué es ilícita.", "Exige que cese de inmediato.", "Advierte de acciones legales si continúa."],
      en: ["Describe the conduct and why it's unlawful.", "Demand it stop immediately.", "Warn of legal action if it continues."],
    },
    nextSteps: {
      es: ["Envía con acuse y conserva todo.", "Documenta cualquier conducta posterior.", "Si persiste, acude a la vía judicial o policial según el caso."],
      en: ["Send with proof and keep everything.", "Document any further conduct.", "If it persists, pursue legal or police action as appropriate."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "recipient", type: "text", req: true, label: { es: "Persona / empresa destinataria", en: "Recipient person / company" } },
      { name: "recipientAddress", type: "textarea", label: { es: "Su dirección", en: "Their address" } },
      { name: "conduct", type: "textarea", req: true, label: { es: "Conducta que debe cesar", en: "Conduct that must stop" } },
      { name: "deadlineDays", type: "number", label: { es: "Plazo para cesar (días)", en: "Deadline to stop (days)" } },
    ],
    build(v, lang) {
      const days = val(v.deadlineDays, "7");
      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

To: ${val(v.recipient, "[recipient]")}
${val(v.recipientAddress, "")}

Subject: CEASE AND DESIST

Dear ${val(v.recipient, "[recipient]")},

I am writing to formally demand that you immediately CEASE AND DESIST from the following conduct:

${val(v.conduct, "[describe the conduct]")}

This conduct is unlawful and causes me harm. I demand that it stop completely within ${days} days of receipt of this letter and that it not be repeated.

Be advised that if the conduct continues, I will pursue all available legal remedies, which may include a claim for an injunction and for damages, as well as reporting the matter to the competent authorities. This letter will be used as evidence that you were duly notified.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.recipient, "[destinatario]")}
${val(v.recipientAddress, "")}

Asunto: REQUERIMIENTO DE CESE Y ABSTENCIÓN

Estimado/a ${val(v.recipient, "[destinatario]")}:

Por medio del presente le REQUIERO formalmente para que CESE de inmediato en la siguiente conducta:

${val(v.conduct, "[describa la conducta]")}

Dicha conducta es ilícita y me causa un perjuicio. Le exijo que cese por completo en el plazo de ${days} días desde la recepción de este escrito y que se abstenga de repetirla.

Le advierto de que, de continuar, ejerceré cuantas acciones legales me asistan, que podrán incluir la solicitud de medidas de cesación y la reclamación de daños y perjuicios, así como la denuncia ante las autoridades competentes. Este escrito se utilizará como prueba de haberle requerido debidamente.

${signOff(v, lang)}`;
    },
  },

  {
    id: "incumplimiento-contrato",
    category: "tramites",
    icon: "📜",
    title: { es: "Reclamar por incumplimiento de contrato", en: "Claim for breach of contract" },
    desc: { es: "Requiere a la otra parte que cumpla lo pactado o responda por los daños del incumplimiento.", en: "Demand the other party perform the contract or answer for the damages of the breach." },
    juris: { es: "Frente a un incumplimiento puedes exigir cumplimiento, resolución y/o indemnización de daños y perjuicios.", en: "On breach you may demand performance, termination and/or damages." },
    tips: {
      es: ["Cita la cláusula incumplida.", "Concreta el daño sufrido.", "Indica si exiges cumplir o resolver."],
      en: ["Cite the breached clause.", "Quantify the damage.", "State if you want performance or termination."],
    },
    nextSteps: {
      es: ["Envía el requerimiento con acuse.", "Da plazo para subsanar.", "Si no cumple, valora resolución y demanda."],
      en: ["Send the demand with proof.", "Give time to cure.", "If unmet, consider termination and suit."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", label: { es: "Tu dirección", en: "Your address" } },
      { name: "recipient", type: "text", req: true, label: { es: "Otra parte del contrato", en: "Other contracting party" } },
      { name: "recipientAddress", type: "textarea", label: { es: "Su dirección", en: "Their address" } },
      { name: "contractDesc", type: "text", req: true, label: { es: "Contrato (objeto y fecha)", en: "Contract (subject and date)" } },
      { name: "breach", type: "textarea", req: true, label: { es: "En qué consiste el incumplimiento", en: "What the breach consists of" } },
      { name: "remedy", type: "textarea", req: true, label: { es: "Qué exiges (cumplir, resolver, indemnizar)", en: "What you demand (perform, terminate, compensate)" } },
      { name: "deadlineDays", type: "number", label: { es: "Plazo para subsanar (días)", en: "Deadline to cure (days)" } },
    ],
    build(v, lang) {
      const days = val(v.deadlineDays, "15");
      if (lang === "en") {
        return `${senderBlock(v, lang)}

${dateLine(lang)}

To: ${val(v.recipient, "[other party]")}
${val(v.recipientAddress, "")}

Subject: Notice of breach of contract — ${val(v.contractDesc, "[contract]")}

Dear ${val(v.recipient, "[other party]")},

I refer to our contract (${val(v.contractDesc, "[subject and date]")}). You are in breach of its terms in the following respect:

${val(v.breach, "[describe the breach]")}

I hereby require you to remedy this breach within ${days} days of receipt of this letter. Specifically, I demand the following:

${val(v.remedy, "[state your demand]")}

If you fail to comply within the stated period, I will treat the contract as terminated by your breach where applicable and will pursue all legal remedies available, including a claim for damages, interest and costs.

${signOff(v, lang)}`;
      }
      return `${senderBlock(v, lang)}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.recipient, "[otra parte]")}
${val(v.recipientAddress, "")}

Asunto: Requerimiento por incumplimiento de contrato — ${val(v.contractDesc, "[contrato]")}

Estimado/a ${val(v.recipient, "[otra parte]")}:

Me refiero al contrato suscrito entre ambas partes (${val(v.contractDesc, "[objeto y fecha]")}). Usted ha incumplido sus términos en lo siguiente:

${val(v.breach, "[describa el incumplimiento]")}

Por la presente le REQUIERO para que subsane dicho incumplimiento en el plazo de ${days} días desde la recepción de este escrito. En concreto, exijo lo siguiente:

${val(v.remedy, "[indique su exigencia]")}

De no cumplir en el plazo señalado, tendré el contrato por resuelto por su incumplimiento cuando proceda y ejerceré cuantas acciones legales me asistan, incluida la reclamación de daños y perjuicios, intereses y costas.

${signOff(v, lang)}`;
    },
  },

  {
    id: "ruido-vecinos",
    category: "tramites",
    icon: "🔊",
    title: { es: "Queja por ruidos o molestias del vecindario", en: "Complaint about neighbor noise or nuisance" },
    desc: { es: "Requerimiento formal a un vecino o a la comunidad para que cesen ruidos o molestias reiteradas.", en: "Formal notice to a neighbor or association to stop recurring noise or nuisance." },
    juris: { es: "Las actividades molestas pueden infringir ordenanzas locales y los estatutos de la comunidad. Documenta horarios y frecuencia.", en: "Nuisance can breach local ordinances and association rules. Document times and frequency." },
    tips: {
      es: ["Anota días, horas y tipo de molestia.", "Sé firme pero cordial.", "Menciona la normativa o estatutos si los conoces."],
      en: ["Log dates, times and type of nuisance.", "Be firm but cordial.", "Mention rules or statutes if known."],
    },
    nextSteps: {
      es: ["Entrega en mano o con acuse y guarda copia.", "Si persiste, avisa a la comunidad o al ayuntamiento.", "Como último recurso, denuncia o vía judicial."],
      en: ["Deliver by hand or with receipt and keep a copy.", "If it persists, notify the association or city.", "As a last resort, report it or go to court."],
    },
    fields: [
      { name: "fullName", type: "text", req: true, label: { es: "Tu nombre completo", en: "Your full name" } },
      { name: "address", type: "textarea", req: true, label: { es: "Tu dirección", en: "Your address" } },
      { name: "recipient", type: "text", req: true, label: { es: "Vecino / comunidad", en: "Neighbor / association" } },
      { name: "recipientAddress", type: "textarea", label: { es: "Su dirección", en: "Their address" } },
      { name: "nuisance", type: "textarea", req: true, label: { es: "Describe las molestias (días, horas, tipo)", en: "Describe the nuisance (days, times, type)" } },
    ],
    build(v, lang) {
      if (lang === "en") {
        return `${val(v.fullName, "[Your full name]")}
${val(v.address, "[Your address]")}

${dateLine(lang)}

To: ${val(v.recipient, "[neighbor]")}
${val(v.recipientAddress, "")}

Subject: Request to stop noise / nuisance

Dear neighbor,

I am writing regarding a recurring nuisance affecting the peaceful enjoyment of my home:

${val(v.nuisance, "[describe the nuisance]")}

I kindly but firmly request that this conduct cease, as it disturbs normal coexistence and may breach local noise ordinances and the rules of our community.

I would prefer to resolve this amicably. However, if the nuisance continues, I will be compelled to report it to the homeowners' association and the competent authorities, and to pursue any legal action available to protect my rights.

Thank you for your understanding.

${val(v.fullName, "[Your full name]")}`;
      }
      return `${val(v.fullName, "[Tu nombre completo]")}
${val(v.address, "[Tu dirección]")}

${dateLine(lang)}

A LA ATENCIÓN DE: ${val(v.recipient, "[vecino]")}
${val(v.recipientAddress, "")}

Asunto: Requerimiento para el cese de ruidos / molestias

Estimado/a vecino/a:

Me dirijo a usted en relación con unas molestias reiteradas que afectan al disfrute pacífico de mi vivienda:

${val(v.nuisance, "[describa las molestias]")}

Le ruego, de forma cordial pero firme, que cese dicha conducta, ya que altera la normal convivencia y puede infringir las ordenanzas municipales sobre ruido y los estatutos de la comunidad.

Prefiero resolver esto de manera amistosa. No obstante, si las molestias continúan, me veré obligado/a a comunicarlo a la comunidad de propietarios y a las autoridades competentes, así como a ejercer las acciones legales que procedan en defensa de mis derechos.

Gracias por su comprensión.

${val(v.fullName, "[Tu nombre completo]")}`;
    },
  },

];

/* ---------- Acceso por id ---------- */
export function caseById(id) {
  return CASES.find((c) => c.id === id) || null;
}

export function casesByCategory(catId) {
  return CASES.filter((c) => c.category === catId);
}
