import type { Localized, PendingFromClinician } from "@/types/content";

/**
 * Datos profesionales de la doctora.
 *
 * Esta es la información que sostiene la página "Sobre mí" — la más importante
 * del sitio para SEO en salud. Google trata la salud como YMYL y exige señales
 * de autoridad verificables; un sitio de estética sin médico identificable se
 * clasifica como contenido de baja calidad.
 *
 * Además hay obligación legal: el art. 83 LGS y el art. 19 RLGSMP exigen
 * expresar en la publicidad la institución que expidió el título y el número de
 * cédula profesional.
 *
 * ⚠️ Precisión que NO se puede relajar: "medicina estética" **no es una
 * especialidad reconocida por CONACEM** en México. Si la doctora es Médico
 * Cirujano con diplomados, el sitio debe decir exactamente eso. Escribir
 * "especialista en medicina estética" sin cédula de especialidad es exposición
 * legal, y es justo el tipo de sobreafirmación que degrada el E-E-A-T cuando
 * alguien la contrasta.
 */
export const practitioner = {
  name: "Dra. Patricia García",

  /** Título profesional exacto. No inflar. */
  title: {
    es: "Médica Cirujana",
    en: "Physician (Médica Cirujana)",
  } satisfies Localized,

  /** Verificado en su perfil público. */
  school: "Instituto Politécnico Nacional",

  /**
   * 🔑 TODO(cliente) — cédula profesional. Obligatoria por art. 19 RLGSMP.
   * Es verificable gratis por cualquiera en el Registro Nacional de
   * Profesionistas de la SEP: publicarla **e invitar a verificarla** es de las
   * señales de confianza más baratas y fuertes del sitio, y casi ningún
   * competidor local lo hace.
   */
  license: null as PendingFromClinician<string>,

  /** URL pública donde cualquiera puede verificar la cédula. */
  licenseRegistryUrl: "https://www.cedulaprofesional.sep.gob.mx/",

  /**
   * TODO(cliente) — formación adicional: diplomados y cursos en medicina
   * estética, con institución y año. El art. 19 obliga a nombrar la institución
   * que expidió cada credencial que se publicite.
   */
  training: null as PendingFromClinician<
    Array<{ name: Localized; institution: string; year: string }>
  >,

  /** TODO(cliente) — retrato profesional real. Nada de stock. */
  portrait: null as PendingFromClinician<{ src: string; alt: Localized }>,

  /** TODO(cliente) — año de inicio de práctica en Playa del Carmen. */
  practicingSince: null as PendingFromClinician<string>,

  instagram: "https://www.instagram.com/doctorapatga/",
} as const;
