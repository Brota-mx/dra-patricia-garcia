# Cumplimiento publicitario — resumen accionable

> ⚠️ **Orientación de cumplimiento, no asesoría legal.** Fundamentado en textos normativos
> vigentes verificados directamente. Los puntos marcados 🟠 dependen de criterio interpretativo y
> **deben validarse con un abogado sanitario mexicano antes de publicar.**
>
> Investigación completa: 2026-07-21.

## Los tres hallazgos que cambian el proyecto

### 1. El sitio necesita DOS trámites, no uno

| Sección del sitio | Trámite | Costo |
|---|---|---|
| Home, Sobre mí, Contacto, Blog, `/servicios/medicina-general` | **Aviso** de publicidad (`COFEPRIS-02-002-A`) | Gratuito |
| Servicios estéticos (labios, toxina, skinbooster) | **Permiso** de publicidad (`COFEPRIS-02-001-A`) | Con costo |

La exención de "servicios otorgados en forma individual" existe **sólo** para servicios de salud
(art. 79 fr. I RLGSMP). La fracción VI, embellecimiento, **no tiene esa exención**: que la doctora
sea persona física individual **no la exime** del permiso para la parte estética.

⚠️ **El aviso se presenta DENTRO DE LOS 5 DÍAS PREVIOS** al inicio de la difusión (art. 87), no
después. Y el permiso exige someter el **proyecto publicitario completo** — capturas del sitio, en
ambos idiomas.

🔴 **Art. 83:** una vez otorgado el permiso, cualquier modificación que varíe las características
base (servicio nuevo, claims nuevos, rediseño) **obliga a un trámite nuevo antes de publicar**.
Consecuencia de arquitectura: el contenido comercial debe ser estable; el blog es la válvula.

### 2. Prohibido atribuir cualidades terapéuticas a procedimientos estéticos

**Art. 63, último párrafo RLGSMP** — *"En ningún caso se podrán atribuir a este tipo de servicios o
productos cualidades preventivas, rehabilitatorias o terapéuticas."*

Esto invalida el 60% del copy típico del sector. **La sustitución maestra:** no actuamos sobre la
condición, sino sobre **la apariencia de** la condición.

| ❌ | ✅ |
|---|---|
| "reduce las arrugas" | "suaviza la apariencia de las líneas de expresión" |
| "rejuvenecimiento facial" | "armonización facial" |
| "previene el envejecimiento" | *(eliminar — "prevenir" es cualidad preventiva, prohibida)* |
| "regenera / repara / restaura la piel" | "aporta hidratación", "mejora la apariencia de textura" |
| "trata la flacidez" | "mejora temporalmente la apariencia de la zona" |
| "antiedad" / "anti-aging" | "estética facial" |
| "detox" / "elimina toxinas" | *(eliminar — sin sustento científico, art. 18 fr. II)* |

Ya aplicado en `src/content/services.ts`.

### 3. Riesgos y contraindicaciones son OBLIGATORIOS y VISIBLES

**Art. 65 fr. II y III RLGSMP** — la publicidad de embellecimiento sólo se autoriza si se
*"manifiesten los riesgos"* y se señalen *"de manera clara las contraindicaciones y efectos
secundarios"*.

**Esto es arquitectura de información, no un disclaimer.** No puede ir en un modal, ni en un
acordeón colapsado por defecto, ni en gris de 10px.

Implementado en el tipo, no sólo en la guía de estilo: `MandatoryDisclosure` en
`src/types/content.ts` es un campo requerido de `Service`, y `isPublishable()` impide publicar un
procedimiento estético cuya divulgación siga en `null`. El contenido es 100% clínico → lo redacta
la doctora.

---

## 🟠 Bloqueante antes de fijar la nomenclatura

**¿Se puede nombrar "toxina botulínica" en publicidad dirigida a población general?**

La LGS art. 310 in fine y el RLGSMP art. 40 fr. II establecen que a población general sólo se puede
publicitar medicamentos de **libre venta** y remedios herbolarios. La toxina botulínica es de
prescripción.

Hay un argumento razonable de que anunciar **el servicio** ("aplicación de toxina botulínica") no
es anunciar **el medicamento**, y es lo que hace todo el sector. Pero el texto es restrictivo.

**Decisión provisional tomada:** se usa el nombre genérico del procedimiento
(`toxina botulínica` / `botulinum toxin`) y **nunca** una marca comercial (Botox®, Dysport,
Juvederm…). Si el abogado confirma el criterio restrictivo, hay que renombrar a
"neuromodulador para líneas de expresión" y **cambiar los slugs** — por eso conviene resolverlo
antes de que las URLs se indexen.

---

## Conflictos entre la recomendación de SEO y la de compliance

Dos recomendaciones del análisis de posicionamiento **chocan** con la normativa. Gana compliance.

| Recomendación SEO | Problema legal | Resolución |
|---|---|---|
| Usar **"med spa"** en la versión en inglés (es el término que busca el consumidor de EE.UU.) | La denominación debe corresponder a la del aviso de funcionamiento: **consultorio**. "Med spa" describe otra figura | Se usa "medical office / consultorio". Se pierde algo de SEO en inglés; no es negociable |
| Publicar **precios** como diferenciador competitivo | Permitido, pero el art. 5 RLGSMP sólo exime la publicidad **exclusivamente** de precio; al mencionar el servicio aplica todo el reglamento. Y prohibido "2x1" o paquetes sobre actos médicos | Precio en MXN (LFPC art. 34), qué incluye y qué no, sin urgencia ni promociones |
| Fotos de **antes/después** como el activo más persuasivo | Sujetas a permiso, deben someterse en el proyecto publicitario, y la NOM-004 num. 5.5 exige **desidentificación** aunque el paciente autorice | **No incluir en v1.** Las flags ya están apagadas; se mantienen así |

---

## Datos obligatorios en el sitio

**Art. 83 LGS + art. 19 RLGSMP** — la publicidad debe expresar la institución que expidió el
título y el número de cédula profesional. **El sitio es publicidad.** Va en el footer de todas las
páginas, no escondido en una subpágina.

```
Dra. [Nombre completo]
Médica Cirujana — Cédula Profesional [núm.]
Título expedido por [institución]
Consultorio con Aviso de Funcionamiento COFEPRIS núm. [2623032002A00011]
Responsable sanitario: Dra. [Nombre]
[Domicilio completo], Playa del Carmen, Quintana Roo
```

🟠 **Verificar qué es exactamente el número `2623032002A00011`.** Por su formato parece ser el
**Aviso de Funcionamiento / Responsable Sanitario**, que es prerrequisito para tramitar publicidad
— pero **no es** una autorización publicitaria y no sustituye el aviso/permiso.

⚠️ **Precisión sobre credenciales:** "medicina estética" no es especialidad reconocida por CONACEM.
Si la doctora es Médico Cirujano con diplomados, el sitio debe decir exactamente eso. Escribir
"especialista en medicina estética" sin cédula de especialidad es exposición legal.

### Disclaimer médico

No existe leyenda obligatoria tasada para servicios (la de *"Consulte a su médico"* es para
medicamentos). Pero es fuertemente recomendable, y es la principal mitigación frente al art. 17
(que prohíbe "ofrecer tratamientos" por medios informativos — zona gris para el blog).

> *La información de este sitio tiene fines exclusivamente informativos y no constituye
> diagnóstico, prescripción ni tratamiento médico. No sustituye la consulta médica presencial.
> Todo procedimiento requiere valoración individual previa. Los resultados varían de una persona a
> otra.*

---

## Datos personales — correcciones al blueprint

### ⚠️ La LFPDPPP de 2010 fue ABROGADA

Rige la **nueva LFPDPPP (DOF 20-mar-2025, últ. reforma 14-nov-2025)**. **El INAI desapareció**; la
autoridad es la **Secretaría Anticorrupción y Buen Gobierno**. Cualquier plantilla de aviso de
privacidad que mencione al INAI o la ley de 2010 está desactualizada.

### ✅ La decisión de no captar datos clínicos es correcta

Confirmada. Los datos de salud son sensibles (art. 3 fr. VI), exigen consentimiento expreso **por
escrito con firma** (art. 8), y las sanciones **se pueden duplicar** (art. 59 fr. IV). Al no
captarlos, el formulario opera con datos ordinarios y consentimiento tácito válido.

**Pero hay dos fugas que el diseño debe cerrar:**

1. **El campo "servicio de interés"** — si las opciones son clínicas ("tratamiento de acné"),
   revela estado de salud y vuelves al régimen sensible. → Opciones **genéricas**: "Consulta de
   medicina general" / "Medicina estética" / "Otro".
2. **El campo de mensaje libre** — el paciente escribirá su padecimiento aunque no se lo pidas.
   → Microcopy **visible** sobre el campo: *"Por tu privacidad, no incluyas información sobre tu
   salud o padecimientos. Lo revisamos en consulta."* + límite de caracteres + política de
   supresión.

### 🔴 CORRECCIÓN: Resend NO es una transferencia internacional

El BLUEPRINT.md §8.1 decía que había que declarar la transferencia porque Resend procesa fuera de
México. **Es incorrecto.**

El art. 3 fr. XX define transferencia como comunicación a persona *"distinta de la titular, del
responsable o de **la persona encargada**"*. Resend y Vercel son **encargados** (tratan datos por
cuenta de la responsable, bajo sus instrucciones, sin finalidad propia) → **quedan excluidos** del
concepto de transferencia.

Lo que sí hay que hacer: aceptar y archivar el **DPA** de Resend y de Vercel (art. 13), medidas de
seguridad (art. 18), y procedimiento de notificación de vulneraciones (art. 19). Declararlo en el
aviso de todos modos, por transparencia. Y aunque una autoridad lo calificara como transferencia,
el art. 36 fr. VII la permite sin consentimiento cuando es necesaria para la relación jurídica.

---

## Checklist de auto-revisión — correr sobre cada frase del sitio

```
1. ¿Promete un resultado?                     → reformula a expectativa razonable
2. ¿Niega o minimiza un riesgo?               → art. 65 fr. II/III: hay que MANIFESTARLO
3. ¿Usa superlativo o comparativo?            → elimina
4. ¿Usa un verbo terapéutico?                 → cambia a "apariencia de"
5. ¿Nombra marca de medicamento/dispositivo?  → describe el servicio, no el producto
6. ¿Podrías entregar el documento que la
   comprueba si te lo pide un inspector?      → si no, no va (art. 11)
7. ¿Presiona con urgencia?                    → elimina
8. ¿Sugiere que cambiará su vida o su valor
   como persona?                              → art. 9 fr. IV: elimina
9. ¿Existe idéntica en ES y EN?               → paridad obligatoria entre idiomas
```

## Exposición

Multas de 6,000 a 16,000 UMA por infracciones publicitarias; hasta 320,000 UMA en datos
personales, **duplicables** en sensibles. Orden de suspensión de publicidad ejecutable en 24 h.
Y **acción popular** (art. 109 RLGSMP): cualquier persona —un competidor molesto— puede denunciar
sin que COFEPRIS haya inspeccionado nada.
