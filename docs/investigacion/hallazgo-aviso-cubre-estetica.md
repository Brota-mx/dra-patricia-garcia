# Hallazgo — ¿el Aviso de Publicidad ya cubre lo estético?

> Memo para llevar a un abogado sanitario. No es asesoría legal, es la pregunta concreta que
> necesita respuesta antes de tocar nomenclatura o slugs del sitio.
> Fuente: `work/*.pdf` — Aviso de Publicidad de la doctora, folio `2623032002A00011` (gitignored,
> contiene RFC/CURP — no se sube al repo, este memo solo cita los campos no sensibles).

## La pregunta en una frase

**El trámite `COFEPRIS-02-002-A` (Aviso de Publicidad, gratuito) que ya presentó y tiene folio la
doctora, ¿es suficiente para publicitar también los servicios estéticos no quirúrgicos, o de todos
modos hace falta el `COFEPRIS-02-001-A` (Permiso, con costo) que asume el `BLUEPRINT.md`?**

## Lo que dice el documento real

El PDF es un **Aviso de Publicidad** (no un Permiso) con estos datos, tal como los llenó quien
tramitó:

| Campo del formato | Valor |
|---|---|
| Homoclave / nombre del trámite | `COFEPRIS-02-002-A` — **Aviso de Publicidad** |
| Modalidad | Actividades Profesionales, Técnicas, Auxiliares y Especialidades |
| Número de ingreso (folio) | `2623032002A00011` |
| Sección 4.1 — Clasificación del producto/servicio | *"Otros consultorios para el cuidado de la salud"* |
| Sección 4.2 — Especificar | **"Medicina estética no quirúrgica"** |
| Sección 4.A — Categoría marcada | *Atención Médica* (no aparece marcada *Procedimientos de Embellecimiento*, que es una opción distinta en la misma lista) |
| Sección 5.B — Público | Población general (masiva), medio: Internet (página web/redes sociales), "Número de productos o tipo de servicio: 3" |

**El punto central:** el mismo Aviso —el trámite gratuito, no el Permiso— trae "Medicina estética no
quirúrgica" como la especificación del servicio, dentro de la clasificación "Atención Médica". No
hay un segundo folio, ni un Permiso `COFEPRIS-02-001-A` en los materiales que mandó la doctora.

## Por qué esto contradice lo que asumía el blueprint

`docs/investigacion/compliance-publicidad.md` (hallazgo #1, sección "Los tres hallazgos que cambian
el proyecto") concluye, a partir del art. 79 fr. I del RLGSMP, que la exención de "servicios
otorgados en forma individual" **no aplica a embellecimiento** (fr. VI) — y por lo tanto asume que
la doctora necesitaría **dos trámites**: el Aviso para lo médico general y un Permiso aparte, con
costo, para lo estético.

Lo que muestra el PDF real es que **quien tramitó el Aviso clasificó "medicina estética no
quirúrgica" dentro de él**, bajo "Atención Médica", no bajo "Procedimientos de Embellecimiento" (que
es una categoría distinta y separada en la misma sección 4.A del formato). Dos lecturas posibles,
ambas razonables sin ser abogado:

1. **La clasificación fue correcta.** "Medicina estética no quirúrgica" practicada por una médica
   cirujana (no un esteticista) puede caer dentro de "atención médica" y no de "embellecimiento" —
   en cuyo caso el Aviso ya cubre al sitio completo y el Permiso aparte que asumía el blueprint
   sobra.
2. **La clasificación fue un error del trámite** (de la doctora o de quien lo llenó), y COFEPRIS no
   lo objetó porque no audita cada Aviso al momento de recibirlo — pero seguiría existiendo la
   obligación del Permiso aparte para la parte de embellecimiento, con el riesgo de que una
   inspección o una denuncia (el RLGSMP permite acción popular, art. 109) lo señale después.

**Esa es la pregunta que solo un abogado sanitario puede cerrar**, no un análisis de texto
normativo. Ninguna corrección de código depende de "cuál lectura es más probable" — depende de
cuál es correcta.

## Qué cambia según la respuesta

- **Si el Aviso ya cubre lo estético:** se puede simplificar la narrativa de compliance del sitio
  (menos fricción para publicar servicios estéticos), y probablemente se destraba también la duda
  de nomenclatura de "toxina botulínica" (sección 🟠 del mismo doc de compliance) si el criterio de
  "servicio médico, no publicidad de medicamento" aplica igual.
- **Si NO lo cubre:** hay que tramitar el Permiso `COFEPRIS-02-001-A` antes de indexar las páginas
  de servicios estéticos — y mientras tanto, evaluar si esas páginas deben quedar `noindex` o
  directamente fuera de producción.
- **En ambos casos:** no tocar los slugs de servicios estéticos (`toxina-botulinica` etc.) hasta
  tener la respuesta, porque un cambio de nomenclatura después de indexado cuesta SEO — mejor
  fijarlo una sola vez, bien.

## Dato aparte, ya resuelto (no bloquea)

El número de licencia sanitaria del establecimiento (`2623035056X00038`, visible en la sección 3
del PDF) es **distinto** del folio del Aviso de Publicidad (`2623032002A00011`). El primero es el
Aviso de Funcionamiento / Responsable Sanitario del consultorio; el segundo es el trámite
publicitario que ya usa el sitio en el footer y JSON-LD. No hay que mezclarlos ni hace falta
publicar el de funcionamiento.

## Siguiente paso

Llevar este memo (o el PDF completo) al abogado sanitario y pedir una respuesta directa a la
pregunta de la sección 1. Hasta entonces, el sitio sigue operando bajo la lectura conservadora que
ya tiene: nombres genéricos de procedimiento, cero marcas comerciales, divulgación de riesgos
visible en cada servicio estético — eso no cambia sin importar cuál lectura gane.
