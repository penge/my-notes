import { NotesObject, GoogleDriveFile } from "shared/storage/schema";
import pullUnshare from "./pull/pull-unshare";
import pullDelete from "./pull/pull-delete";
import pullCreate from "./pull/pull-create";
import pullUpdate from "./pull/pull-update";

interface PullOptions {
  getFile: (fileId: string) => Promise<string | undefined>
}

export default async (notes: NotesObject, files: GoogleDriveFile[], { getFile }: PullOptions): Promise<NotesObject> => {
  // 0. Unlink duplicates that share a file with their original note
  const notesAfterPullUnshare = pullUnshare(notes);

  // 1. Delete notes that were not modified since their file was deleted from Google Drive
  const notesAfterPullDelete = pullDelete(notesAfterPullUnshare, files);

  // 2. Create notes for every new file in Google Drive where note with that name doesn't exist yet (there's no conflict)
  const notesAfterPullCreate = await pullCreate(notesAfterPullDelete, files, getFile);

  // 3. Update notes for every updated file in Google Drive
  const notesAfterPullUpdate = await pullUpdate(notesAfterPullCreate, files, getFile);

  return notesAfterPullUpdate;
};
