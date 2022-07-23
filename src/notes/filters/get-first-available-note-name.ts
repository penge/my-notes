import { NotesObject } from "shared/storage/schema";

export default (notes: NotesObject): string => Object.keys(notes).sort().shift() || "";
