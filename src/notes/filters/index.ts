import { NotesObject } from "shared/storage/schema";

export const getFirstAvailableNoteName = (notes: NotesObject): string => Object.keys(notes).sort().shift() || "";
