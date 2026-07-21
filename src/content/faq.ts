import type { FaqItem } from "@/types/content";

/**
 * Preguntas frecuentes.
 *
 * ORIGEN: investigación de comportamiento de pacientes de medicina estética
 * (ver docs/investigacion/ux-pacientes.md). Están redactadas EN VOZ DE PACIENTE
 * a propósito — "¿voy a quedar con cara rara?" convierte, "¿cuál es el resultado
 * estético esperado?" no. No las "profesionalices" al maquetar.
 *
 * ⚠️ `answer: null` significa que la respuesta requiere criterio clínico o una
 * política de la práctica que sólo la doctora puede dar. NO redactar un borrador
 * plausible: en un sitio médico un dato inventado es un riesgo real.
 * La UI debe ocultar las preguntas sin respuesta hasta que ella las conteste.
 */
export const faq: FaqItem[] = [
  // ── Bloque A · "¿Voy a quedar bien?" — el de mayor impacto, va primero ────
  {
    topic: "general",
    question: {
      es: "¿Se me va a notar que me hice algo?",
      en: "Will people be able to tell I've had something done?",
    },
    // El miedo va en las dos direcciones: verse obvia Y que no se note nada.
    answer: null,
  },
  {
    topic: "general",
    question: {
      es: "Tengo miedo de quedar con boca de pato o con la cara rara. ¿Cómo sé que no me va a pasar?",
      en: "I'm afraid of ending up with duck lips or an odd-looking face. How do I know that won't happen?",
    },
    // Ponerla con estas palabras ES la señal de confianza. La respuesta correcta
    // no es "confía en mí", es explicar el criterio y decir que a veces es no.
    answer: null,
  },
  {
    topic: "safety",
    question: {
      es: "¿Y si no me gusta cómo quedé? ¿Se puede quitar?",
      en: "What if I don't like the result? Can it be removed?",
    },
    // El desbloqueador emocional más potente de la lista.
    answer: null,
  },
  {
    topic: "general",
    question: {
      es: "¿Puedo empezar con poquito y ver cómo me veo antes de hacerme más?",
      en: "Can I start with a small amount and see how I look before doing more?",
    },
    answer: null,
  },
  {
    topic: "general",
    question: {
      es: "¿Me voy a ver congelada? ¿Voy a poder hacer gestos normales?",
      en: "Will I look frozen? Will I still be able to make normal expressions?",
    },
    answer: null,
  },
  {
    topic: "general",
    question: {
      es: "Nunca me he hecho nada. ¿Soy muy joven o ya es tarde para mí?",
      en: "I've never had anything done. Am I too young — or is it too late for me?",
    },
    // Pregunta doble a propósito: los dos extremos deben sentirse vistos.
    answer: null,
  },

  // ── Bloque B · "¿Es seguro y quién me lo hace?" ───────────────────────────
  {
    topic: "safety",
    question: {
      es: "¿Quién me va a inyectar exactamente? ¿Qué estudió y dónde lo puedo verificar?",
      en: "Who exactly will be injecting me? What are their credentials and where can I verify them?",
    },
    // La cédula se puede verificar gratis en cedulaprofesional.sep.gob.mx —
    // poner el link es de las señales de confianza más baratas y fuertes.
    answer: null,
  },
  {
    topic: "safety",
    question: {
      es: "¿Qué producto usan y cómo sé que no es falsificado?",
      en: "What product do you use, and how do I know it isn't counterfeit?",
    },
    // Miedo con base real: COFEPRIS emitió alertas por lotes falsificados de
    // toxina botulínica, y el CDC investigó reacciones por producto falso.
    answer: null,
  },
  {
    topic: "safety",
    question: {
      es: "¿Qué pasa si algo sale mal? ¿Quién me atiende y en cuánto tiempo?",
      en: "What happens if something goes wrong? Who takes care of me, and how quickly?",
    },
    // Nadie la pregunta. Todos la piensan. Contestarla sin que la pregunten
    // es una señal de confianza enorme.
    answer: null,
  },
  {
    topic: "safety",
    question: {
      es: "¿Hay alguna razón por la que a mí no me lo puedan hacer?",
      en: "Is there any reason I might not be a candidate?",
    },
    // Contraindicaciones. 100% contenido médico.
    answer: null,
  },

  // ── Bloque C · "¿Cómo va a ser?" ─────────────────────────────────────────
  {
    topic: "general",
    question: {
      es: "¿Duele? ¿Me ponen algo para el dolor?",
      en: "Does it hurt? Is anything used for the pain?",
    },
    answer: null,
  },
  {
    topic: "aftercare",
    question: {
      es: "¿Cuántos días voy a andar hinchada o morada? Tengo un evento el fin de semana.",
      en: "How many days will I be swollen or bruised? I have an event this weekend.",
    },
    // El evento es el disparador real de la búsqueda; nombrarlo hace que la
    // pregunta se sienta escrita para esa persona.
    answer: null,
  },
  {
    topic: "aftercare",
    question: {
      es: "¿Puedo asolearme, meterme al mar o a un cenote, ir al gym, tomar o subirme a un avión después?",
      en: "Afterwards, can I sunbathe, swim in the sea or a cenote, go to the gym, drink alcohol, dive or fly?",
    },
    // 🔑 LA PREGUNTA DIFERENCIADORA DE ESTA PLAZA. Ninguna clínica de la
    // Riviera Maya la contesta bien, y toda paciente de aquí la tiene.
    // Es autoridad geográfica pura: la "E" de Experience en E-E-A-T.
    answer: null,
  },
  {
    topic: "general",
    question: {
      es: "¿Cuánto me dura? ¿Me lo voy a tener que hacer para siempre? ¿Y si lo dejo, quedo peor que antes?",
      en: "How long does it last? Will I have to keep doing it forever? And if I stop, will I look worse than before?",
    },
    // Tres miedos en una (costo recurrente, dependencia, "efecto rebote").
    // No separarlas: así es como llega la pregunta en la cabeza del paciente.
    answer: null,
  },

  // ── Bloque D · Dinero, presión y logística ───────────────────────────────
  {
    topic: "booking",
    question: {
      es: "¿Cuánto cuesta? ¿La consulta se paga aparte o se descuenta si me hago el tratamiento?",
      en: "How much does it cost? Is the consultation charged separately, or credited if I go ahead?",
    },
    // Esconder el precio no filtra: manda al paciente con el competidor.
    answer: null,
  },
  {
    topic: "booking",
    question: {
      es: "Si voy a consulta, ¿me van a inyectar el mismo día o nada más es plática?",
      en: "If I come in for a consultation, will I be treated the same day or is it just a conversation?",
    },
    // Ansiedad silenciosa en las dos direcciones: quien teme que la inyecten
    // hoy no agenda; quien teme "perder el viaje sólo para platicar", tampoco.
    answer: null,
  },
  {
    topic: "booking",
    question: {
      es: "¿Me van a presionar para que me haga más cosas de las que pedí?",
      en: "Will I be pressured into more treatments than I asked for?",
    },
    // Contraintuitiva y por eso funciona: sólo la escribe quien puede
    // contestar que no.
    answer: null,
  },
  {
    topic: "booking",
    question: {
      es: "¿Me van a querer vender productos de cuidado de la piel?",
      en: "Will you try to sell me skincare products?",
    },
    answer: null,
  },

  // ── Bloque E · Sólo para el paciente extranjero ──────────────────────────
  // NO son traducción de las anteriores: son preguntas que el paciente local
  // no tiene. La versión en inglés del sitio no es una traducción del español.
  {
    topic: "international",
    question: {
      es: "", // No aplica al paciente local.
      en: "Are you a licensed medical doctor? How do I verify that from abroad?",
    },
    // El lector extranjero no puede mapear el sistema mexicano de cédulas a
    // "board-certified". Hay que explicárselo, no sólo afirmarlo.
    answer: null,
  },
  {
    topic: "international",
    question: {
      es: "",
      en: "Will my consultation be in English? Who exactly will I be speaking with?",
    },
    // El miedo no es "no nos vamos a entender", es "no voy a poder explicar
    // el matiz" — y en estética el pedido es sutil.
    answer: null,
  },
  {
    topic: "international",
    question: {
      es: "",
      en: "Are the products you use the same brands and standards I'd get at home?",
    },
    answer: null,
  },
  {
    topic: "international",
    question: {
      es: "",
      en: "I'm only here for a few days. What happens if I have a problem after I fly home?",
    },
    // Objeción estructural del turismo médico: no hay a quién volver, y los
    // seguros de viaje suelen excluir complicaciones de procedimientos
    // electivos planeados en el extranjero.
    answer: null,
  },
  {
    topic: "international",
    question: {
      es: "",
      en: "How do I pay — card, cash, pesos or dollars? Will I get a receipt?",
    },
    // Fricción, no riesgo. Pero causa abandono en el último metro.
    answer: null,
  },
];

/** FAQ visibles en un idioma: oculta las que no aplican y las no contestadas. */
export function answeredFaq(locale: "es" | "en"): FaqItem[] {
  return faq.filter((f) => f.question[locale] !== "" && f.answer !== null);
}
