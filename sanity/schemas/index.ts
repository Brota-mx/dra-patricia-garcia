import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { localeSlug } from "./objects/localeSlug";
import { localeBlockContent } from "./objects/localeBlockContent";
import { post } from "./post";
import { author } from "./author";
import { category } from "./category";

export const schemaTypes = [
  // Objetos reutilizables primero — los documentos dependen de ellos.
  localeString,
  localeText,
  localeSlug,
  localeBlockContent,
  // Documentos
  post,
  author,
  category,
];
