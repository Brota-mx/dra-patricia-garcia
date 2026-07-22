import type { Localized } from "@/types/content";
import { clinic } from "@/content/clinic";
import { practitioner } from "@/content/practitioner";

/**
 * Aviso de Privacidad — contenido legal, no de marketing.
 *
 * Fundamentado en la **nueva LFPDPPP** (DOF 20-mar-2025, últ. reforma
 * 14-nov-2025). La ley de 2010 fue abrogada y el INAI desapareció; la
 * autoridad vigente es la Secretaría Anticorrupción y Buen Gobierno.
 * Cualquier cambio a este texto debe validarse contra esa ley, no contra la
 * anterior. Ver docs/investigacion/compliance-publicidad.md para el
 * razonamiento completo detrás de cada sección.
 *
 * ⚠️ Esto no es asesoría legal. Antes de publicar en producción, un abogado
 * debe revisar este texto — en particular la sección de identidad, cuando el
 * domicilio completo del consultorio esté disponible (hoy es
 * `clinic.address === null`, TODO(cliente)).
 */

type LegalSection = {
  heading: Localized;
  paragraphs: Localized<string[]>;
};

const responsibleName = clinic.name;
const responsibleTitle = practitioner.title;

export const legalNoticeLastUpdated = "2026-07-21";

export const privacyNoticeSections: LegalSection[] = [
  {
    heading: {
      es: "Quién es responsable de tus datos",
      en: "Who is responsible for your data",
    },
    paragraphs: {
      es: [
        `${responsibleName} (${responsibleTitle.es}), con consultorio en ${clinic.city}, ${clinic.state}, México, bajo Aviso de Funcionamiento COFEPRIS núm. ${clinic.cofepris}, es la responsable del tratamiento de tus datos personales cuando visitas este sitio o nos escribes a través de él.`,
        // clinic.address es TODO(cliente): mismo patrón que el resto del
        // sitio — se omite el dato inventado y se remite al canal ya activo.
        "El domicilio completo del consultorio está disponible por WhatsApp. Lo incorporaremos a este aviso en cuanto esté publicado en el resto del sitio.",
      ],
      en: [
        `${responsibleName}, ${responsibleTitle.en}, with a medical office in ${clinic.city}, ${clinic.state}, Mexico, operating under COFEPRIS Notice of Operation no. ${clinic.cofepris}, is responsible for processing your personal data when you visit this site or contact us through it.`,
        "The office's full street address is available on request via WhatsApp. We'll add it to this notice once it's published elsewhere on the site.",
      ],
    },
  },
  {
    heading: {
      es: "Qué datos personales recabamos",
      en: "What personal data we collect",
    },
    paragraphs: {
      es: [
        "A través del formulario de contacto recabamos: tu nombre, tu correo electrónico, tu teléfono (opcional) y el mensaje que decidas escribirnos, además de una categoría general de servicio de tu interés.",
        "No recabamos datos personales sensibles. El formulario nunca pregunta por tu estado de salud, y te pedimos expresamente que no incluyas información médica en el campo de mensaje — eso se revisa en consulta, no por escrito en un sitio web.",
        "No usamos cookies de rastreo ni de publicidad. La analítica del sitio no identifica visitantes de forma individual ni requiere aviso de cookies.",
      ],
      en: [
        "Through the contact form we collect: your name, your email address, your phone number (optional), and any message you choose to send us, along with a general category for the service you're interested in.",
        "We do not collect sensitive personal data. The form never asks about your health, and we explicitly ask you not to include medical information in the message field — that's discussed in person, during your consultation, not in writing on a website.",
        "We don't use tracking or advertising cookies. The site's analytics don't identify individual visitors and don't require a cookie banner.",
      ],
    },
  },
  {
    heading: {
      es: "Para qué usamos tus datos",
      en: "What we use your data for",
    },
    paragraphs: {
      es: [
        "Usamos tus datos para responder tu solicitud de contacto o información y, si lo pides, para coordinar tu cita.",
        "No usamos tus datos para fines secundarios — mercadotecnia, prospección comercial o venta a terceros. Si eso cambiara, te pediríamos tu consentimiento expreso antes, y esta página se actualizaría para reflejarlo.",
      ],
      en: [
        "We use your data to respond to your request for contact or information and, if you ask, to help coordinate your appointment.",
        "We don't use your data for secondary purposes — marketing, sales prospecting, or sharing with third parties for their own use. If that ever changed, we'd ask for your express consent first, and this page would be updated to reflect it.",
      ],
    },
  },
  {
    heading: {
      es: "Con quién compartimos tus datos",
      en: "Who we share your data with",
    },
    paragraphs: {
      es: [
        "Usamos dos proveedores para operar el sitio y enviar tu solicitud por correo: Resend y Vercel. Ambos tratan tus datos exclusivamente por nuestra cuenta y bajo nuestras instrucciones — son encargados del tratamiento, no terceros con fines propios, por lo que esto no constituye una transferencia de datos personales conforme a la ley.",
        "No vendemos, rentamos ni compartimos tus datos con nadie más, salvo que una autoridad competente lo requiera conforme a un procedimiento legal.",
      ],
      en: [
        "We use two providers to run the site and send your request by email: Resend and Vercel. Both process your data solely on our behalf and under our instructions — they act as data processors, not as third parties with their own purposes, so this does not constitute a transfer of personal data under the law.",
        "We don't sell, rent, or share your data with anyone else, except where a competent authority requires it through a legal process.",
      ],
    },
  },
  {
    heading: {
      es: "Cómo ejercer tus derechos",
      en: "How to exercise your rights",
    },
    paragraphs: {
      es: [
        "Puedes pedirnos acceder, corregir o eliminar tus datos personales, o revocar tu consentimiento y oponerte a su uso, escribiéndonos por WhatsApp o a través del formulario de contacto. Atendemos tu solicitud en el plazo que establece la ley aplicable.",
        "Si consideras que no atendimos tu solicitud correctamente, puedes acudir a la Secretaría Anticorrupción y Buen Gobierno, autoridad competente en materia de protección de datos personales en posesión de particulares en México.",
      ],
      en: [
        "You can ask us to access, correct, or delete your personal data, or to withdraw your consent and object to its use, by messaging us on WhatsApp or through the contact form. We respond within the timeframe set by applicable law.",
        "If you believe we didn't handle your request properly, you can contact the Secretaría Anticorrupción y Buen Gobierno (Mexico's Anti-Corruption and Good Governance Secretariat), the competent authority for personal data protection in Mexico.",
      ],
    },
  },
  {
    heading: {
      es: "Cambios a este aviso",
      en: "Changes to this notice",
    },
    paragraphs: {
      es: [
        "Podemos actualizar este aviso conforme cambie el sitio o la normativa aplicable. Cualquier cambio relevante se publica en esta misma página antes de tomar efecto.",
      ],
      en: [
        "We may update this notice as the site or applicable regulations change. Any relevant changes are published on this same page before taking effect.",
      ],
    },
  },
];
