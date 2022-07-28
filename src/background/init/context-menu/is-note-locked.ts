import { NotesObject } from "shared/storage/schema";

export default (notes: NotesObject, noteName: string): boolean => !!(notes[noteName]?.locked);
