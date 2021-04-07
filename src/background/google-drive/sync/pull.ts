import { NotesObject, GoogleDriveFile } from "shared/storage/schema";
import { pullCreate } from "./pull/pull-create";
import { pullDelete } from "./pull/pull-delete";
import { pullUpdate } from "./pull/pull-update";

interface PullOptions {
  getFile: (fileId: string) => Promise<string | undefined>
}

export default async (notes: NotesObject, files: GoogleDriveFile[], { getFile }: PullOptions): Promise<NotesObject> => {
  // 1. Delete notes that were not modified since their file was deleted from Google Drive
  const notesAfterPullDelete = pullDelete(notes, files);

  // 2. Create notes for every new file in Google Drive where note with that name doesn't exist yet (there's no conflict)
  const notesAfterPullCreate = await pullCreate(notesAfterPullDelete, files, getFile);

  // 3. Update notes for every updated file in Google Drive
  const notesAfterPullUpdate = await pullUpdate(notesAfterPullCreate, files, getFile);

  return notesAfterPullUpdate;
};
