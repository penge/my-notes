import { NotesObject, Message, MessageType } from "shared/storage/schema";

const attach = (): void => {
  chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.type !== MessageType.DROP) {
      return;
    }

    const { targetNoteName, data } = message.payload as { targetNoteName: string, data: string };
    if (!targetNoteName || !data) {
      return;
    }

    chrome.storage.local.get("notes", local => {
      if (!(targetNoteName in local.notes)) {
        return;
      }

      const oldContent = (local.notes as NotesObject)[targetNoteName].content;

      const newContent = `${oldContent}<br><br>${data}`;

      chrome.storage.local.set({
        notes: {
          ...local.notes,
          [targetNoteName]: {
            ...local.notes[targetNoteName],
            content: newContent,
          },
        }
      });
    });
  });
};

export default {
  attach,
};
