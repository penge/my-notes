process.env.LOG_LEVEL = "SILENT";

import { GoogleDriveFile } from "shared/storage/schema";
import pull from "../pull";

/*
UNCHANGED - Note should remain unchanged if not DELETED || NEW || UPDATED
DELETED - Delete notes that were synced (having sync?.file.id) but deleted from the remote
NEW - Add new notes created in the remote (file.id not present in any of notes)
UPDATED - Update notes name/content if updated in the remote (file.modifiedTime > note.modifiedTime)

Exception:
"Clipboard" cannot be deleted or renamed, or other note renamed to "Clipboard"
*/
const notes = {
  Article: { // UNCHANGED
    content: "Article content",
    createdTime: "2020-04-20T09:01:00.000Z",
    modifiedTime: "2020-04-20T09:01:01.000Z",
    sync: {
      file: {
        id: "4360",
        name: "Article",
        createdTime: "2020-04-20T09:01:00.000Z",
        modifiedTime: "2020-04-20T09:01:01.000Z",
      }
    }
  },

  Todo: { // UPDATED (new content only)
    content: "buy milk",
    createdTime: "2020-04-20T09:02:00.000Z",
    modifiedTime: "2020-04-20T09:02:02.000Z",
    sync: {
      file: {
        id: "6073",
        name: "Todo",
        createdTime: "2020-04-20T09:02:00.000Z",
        modifiedTime: "2020-04-20T09:02:02.000Z",
      }
    }
  },

  Cooking: { // DELETED
    content: "Cooking content",
    createdTime: "2020-04-20T09:03:00.000Z",
    modifiedTime: "2020-04-20T09:03:03.000Z",
    sync: {
      file: {
        id: "ecb5",
        name: "Cooking",
        createdTime: "2020-04-20T09:03:00.000Z",
        modifiedTime: "2020-04-20T09:03:03.000Z",
      }
    }
  },

  Books: { // UPDATED (new content only)
    content: "The Great Gatsby",
    createdTime: "2020-04-20T09:04:00.000Z",
    modifiedTime: "2020-04-20T09:04:04.000Z",
    sync: {
      file: {
        id: "9d13",
        name: "Books",
        createdTime: "2020-04-20T09:04:00.000Z",
        modifiedTime: "2020-04-20T09:04:04.000Z",
      }
    }
  },

  Radio: { // UNCHANGED
    content: "some radio stations",
    createdTime: "2020-04-20T09:05:00.000Z",
    modifiedTime: "2020-04-20T09:05:05.000Z",
  },

  Shopping: { // UPDATED (new name AND new content; new name - "Amazon")
    content: "things to buy",
    createdTime: "2020-04-20T09:06:00.000Z",
    modifiedTime: "2020-04-20T09:06:06.000Z",
    sync: {
      file: {
        id: "df29",
        name: "Shopping",
        createdTime: "2020-04-20T09:06:00.000Z",
        modifiedTime: "2020-04-20T09:06:06.000Z",
      }
    }
  },

  Clipboard: { // UPDATED (should not be able to rename)
    content: "Clipboard content",
    createdTime: "2020-04-20T09:07:00.000Z",
    modifiedTime: "2020-04-20T09:07:07.000Z",
    sync: {
      file: {
        id: "2931",
        name: "Clipboard",
        createdTime: "2020-04-20T09:07:00.000Z",
        modifiedTime: "2020-04-20T09:07:07.000Z",
      }
    }
  },

  News: { // DELETED
    content: "news for today",
    createdTime: "2020-04-20T09:08:00.000Z",
    modifiedTime: "2020-04-20T09:08:08.000Z",
    sync: {
      file: {
        id: "f745",
        name: "News",
        createdTime: "2020-04-20T09:08:00.000Z",
        modifiedTime: "2020-04-20T09:08:08.000Z",
      }
    }
  },

  Math: { // UPDATED (new content only; name conflict; content should be appended and sync?.file set)
    content: "some equations",
    createdTime: "2020-04-20T09:09:00.000Z",
    modifiedTime: "2020-04-20T09:09:09.000Z",
  },

  Vacation: { // UPDATED (new name AND new content; new name - "Trip")
    content: "places to go",
    createdTime: "2020-04-20T09:10:00.000Z",
    modifiedTime: "2020-04-20T09:10:10.000Z",
    sync: {
      file: {
        id: "9e0e",
        name: "Vacation",
        createdTime: "2020-04-20T09:10:00.000Z",
        modifiedTime: "2020-04-20T09:10:10.000Z",
      }
    }
  }

  // NEW:
  // - Phones
  // - TV
  // - Lamps
};

const files = [
  // UNCHANGED (either not having a file, or file.modifiedTime is unchanged)
  { id: "4360", name: "Article", createdTime: "2020-04-20T09:01:00.000Z", modifiedTime: "2020-04-20T09:01:01.000Z" },
  // "Radio"

  // UPDATED
  { id: "6073", name: "Todo", createdTime: "2020-04-20T09:02:00.000Z", modifiedTime: "2020-04-20T09:02:07.000Z" },
  { id: "9d13", name: "Books", createdTime: "2020-04-20T09:04:00.000Z", modifiedTime: "2020-04-20T09:04:09.000Z" },
  { id: "df29", name: "Amazon", createdTime: "2020-04-20T09:06:00.000Z", modifiedTime: "2020-04-20T09:06:11.000Z" }, // before "Shopping"
  { id: "2931", name: "Clipboard", createdTime: "2020-04-20T09:07:00.000Z", modifiedTime: "2020-04-20T09:07:12.000Z" },
  { id: "777f", name: "Math", createdTime: "2020-04-20T09:25:00.000Z", modifiedTime: "2020-04-20T09:25:25.000Z" }, // name conflict = add content to existing note
  { id: "9e0e", name: "Trip", createdTime: "2020-04-20T09:10:00.000Z", modifiedTime: "2020-04-20T09:10:15.000Z" }, // before "Vacation"

  // DELETED
  // { id: "ecb5", ... } // "Cooking"
  // { id: "f745", ... } // "News"

  // NEW
  { id: "2b18", name: "Phones", createdTime: "2020-04-20T09:11:00.000Z", modifiedTime: "2020-04-20T09:11:11.000Z" },
  { id: "0dc9", name: "TV", createdTime: "2020-04-20T09:12:00.000Z", modifiedTime: "2020-04-20T09:12:12.000Z" },
  { id: "b378", name: "Lamps", createdTime: "2020-04-20T09:13:00.000Z", modifiedTime: "2020-04-20T09:13:13.000Z" },
];

const getFile = (fileId: string): Promise<string> => Promise.resolve(`CONTENT OF ${fileId}`);

it("pulls new and updated notes, and deletes notes if deleted in Google Drive", async () => {
  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 11); // 10 original, -2 deleted, +3 new

  // Article
  expect(updatedNotes.Article.content === "Article content");
  expect(updatedNotes.Article.createdTime === "2020-04-20T09:01:00.000Z");
  expect(updatedNotes.Article.modifiedTime === "2020-04-20T09:01:01.000Z");
  expect(updatedNotes.Article.sync?.file.id === "4360");
  expect(updatedNotes.Article.sync?.file.name === "Article");
  expect(updatedNotes.Article.sync?.file.createdTime === "2020-04-20T09:01:00.000Z");
  expect(updatedNotes.Article.sync?.file.modifiedTime === "2020-04-20T09:01:01.000Z");
  expect(Object.keys(updatedNotes.Article.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Todo
  expect(updatedNotes.Todo.content === "CONTENT OF 6073");
  expect(updatedNotes.Todo.createdTime === "2020-04-20T09:02:00.000Z");
  expect(updatedNotes.Todo.modifiedTime === "2020-04-20T09:02:07.000Z");
  expect(updatedNotes.Todo.sync?.file.id === "6073");
  expect(updatedNotes.Todo.sync?.file.name === "Todo");
  expect(updatedNotes.Todo.sync?.file.createdTime === "2020-04-20T09:02:00.000Z");
  expect(updatedNotes.Todo.sync?.file.modifiedTime === "2020-04-20T09:02:07.000Z");
  expect(Object.keys(updatedNotes.Todo.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // deleted Cooking
  expect("Cooking" in updatedNotes === false);

  // Books
  expect(updatedNotes.Books.content === "CONTENT OF 9d13");
  expect(updatedNotes.Books.createdTime === "2020-04-20T09:04:00.000Z");
  expect(updatedNotes.Books.modifiedTime === "2020-04-20T09:04:09.000Z");
  expect(updatedNotes.Books.sync?.file.id === "9d13");
  expect(updatedNotes.Books.sync?.file.name === "Books");
  expect(updatedNotes.Books.sync?.file.createdTime === "2020-04-20T09:04:00.000Z");
  expect(updatedNotes.Books.sync?.file.modifiedTime === "2020-04-20T09:04:09.000Z");
  expect(Object.keys(updatedNotes.Books.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Radio
  expect(updatedNotes.Radio.content === "some radio stations");
  expect(updatedNotes.Radio.createdTime === "2020-04-20T09:05:00.000Z");
  expect(updatedNotes.Radio.modifiedTime === "2020-04-20T09:05:05.000Z");
  expect("sync" in updatedNotes.Radio === false);

  // Amazon (before "Shopping")
  expect(updatedNotes.Amazon.content === "CONTENT OF df29");
  expect(updatedNotes.Amazon.createdTime === "2020-04-20T09:06:00.000Z");
  expect(updatedNotes.Amazon.modifiedTime === "2020-04-20T09:06:11.000Z");
  expect(updatedNotes.Amazon.sync?.file.id === "df29");
  expect(updatedNotes.Amazon.sync?.file.name === "Amazon");
  expect(updatedNotes.Amazon.sync?.file.createdTime === "2020-04-20T09:06:00.000Z");
  expect(updatedNotes.Amazon.sync?.file.modifiedTime === "2020-04-20T09:06:11.000Z");
  expect(Object.keys(updatedNotes.Amazon.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }
  expect("Shopping" in updatedNotes === false); // renamed to "Amazon"

  // Clipboard
  expect(updatedNotes.Clipboard.content === "CONTENT OF 2931");
  expect(updatedNotes.Clipboard.createdTime === "2020-04-20T09:07:00.000Z");
  expect(updatedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:12.000Z");
  expect(updatedNotes.Clipboard.sync?.file.id === "2931");
  expect(updatedNotes.Clipboard.sync?.file.name === "Clipboard");
  expect(updatedNotes.Clipboard.sync?.file.createdTime === "2020-04-20T09:07:00.000Z");
  expect(updatedNotes.Clipboard.sync?.file.modifiedTime === "2020-04-20T09:07:12.000Z");
  expect(Object.keys(updatedNotes.Clipboard.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // deleted News
  expect("News" in updatedNotes === false);

  // Math
  expect(updatedNotes.Math.content === "some equations<br><br>CONTENT OF 777f");
  expect(updatedNotes.Math.createdTime === "2020-04-20T09:25:00.000Z");
  expect(updatedNotes.Math.modifiedTime === "2020-04-20T09:25:25.000Z");
  expect(updatedNotes.Math.sync?.file.id === "777f");
  expect(updatedNotes.Math.sync?.file.name === "Math");
  expect(updatedNotes.Math.sync?.file.createdTime === "2020-04-20T09:25:00.000Z");
  expect(updatedNotes.Math.sync?.file.modifiedTime === "2020-04-20T09:25:25.000Z");
  expect(Object.keys(updatedNotes.Math.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Trip (before "Vacation")
  expect(updatedNotes.Trip.content === "CONTENT OF 9e0e");
  expect(updatedNotes.Trip.createdTime === "2020-04-20T09:10:00.000Z");
  expect(updatedNotes.Trip.modifiedTime === "2020-04-20T09:10:15.000Z");
  expect(updatedNotes.Trip.sync?.file.id === "9e0e");
  expect(updatedNotes.Trip.sync?.file.name === "Trip");
  expect(updatedNotes.Trip.sync?.file.createdTime === "2020-04-20T09:10:00.000Z");
  expect(updatedNotes.Trip.sync?.file.modifiedTime === "2020-04-20T09:10:15.000Z");
  expect(Object.keys(updatedNotes.Trip.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }
  expect("Vacation" in updatedNotes === false); // renamed to "Trip"

  // Phones
  expect(updatedNotes.Phones.content === "CONTENT OF 2b18");
  expect(updatedNotes.Phones.createdTime === "2020-04-20T09:11:00.000Z");
  expect(updatedNotes.Phones.modifiedTime === "2020-04-20T09:11:11.000Z");
  expect(updatedNotes.Phones.sync?.file.id === "2b18");
  expect(updatedNotes.Phones.sync?.file.name === "Phones");
  expect(updatedNotes.Phones.sync?.file.createdTime === "2020-04-20T09:11:00.000Z");
  expect(updatedNotes.Phones.sync?.file.modifiedTime === "2020-04-20T09:11:11.000Z");
  expect(Object.keys(updatedNotes.Phones.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // TV
  expect(updatedNotes.TV.content === "CONTENT OF 0dc9");
  expect(updatedNotes.TV.createdTime === "2020-04-20T09:12:00.000Z");
  expect(updatedNotes.TV.modifiedTime === "2020-04-20T09:12:12.000Z");
  expect(updatedNotes.TV.sync?.file.id === "0dc9");
  expect(updatedNotes.TV.sync?.file.name === "TV");
  expect(updatedNotes.TV.sync?.file.createdTime === "2020-04-20T09:12:00.000Z");
  expect(updatedNotes.TV.sync?.file.modifiedTime === "2020-04-20T09:12:12.000Z");
  expect(Object.keys(updatedNotes.TV.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Lamps
  expect(updatedNotes.Lamps.content === "CONTENT OF b378");
  expect(updatedNotes.Lamps.createdTime === "2020-04-20T09:13:00.000Z");
  expect(updatedNotes.Lamps.modifiedTime === "2020-04-20T09:13:13.000Z");
  expect(updatedNotes.Lamps.sync?.file.id === "b378");
  expect(updatedNotes.Lamps.sync?.file.name === "Lamps");
  expect(updatedNotes.Lamps.sync?.file.createdTime === "2020-04-20T09:13:00.000Z");
  expect(updatedNotes.Lamps.sync?.file.modifiedTime === "2020-04-20T09:13:13.000Z");
  expect(Object.keys(updatedNotes.Lamps.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }
});

it("unlinks Clipboard if deleted from Google Drive (Clipboard note is not deleted)", async () => {
  const notes = {
    Clipboard: {
      content: "Clipboard content",
      createdTime: "2020-04-20T09:07:00.000Z",
      modifiedTime: "2020-04-20T09:07:07.000Z",
      sync: {
        file: {
          id: "2931",
          name: "Clipboard",
          createdTime: "2020-04-20T09:07:00.000Z",
          modifiedTime: "2020-04-20T09:07:07.000Z",
        }
      }
    },
  };

  const files: GoogleDriveFile[] = [];

  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 1); // { Clipboard }

  // Clipboard
  expect(updatedNotes.Clipboard.content === "Clipboard content");
  expect(updatedNotes.Clipboard.createdTime === "2020-04-20T09:07:00.000Z");
  expect(updatedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:07.000Z");
  expect("sync" in updatedNotes.Clipboard === false); // unlinked
});

it("unlinks Clipboard if renamed in Google Drive", async () => {
  const notes = {
    Clipboard: {
      content: "Clipboard content",
      createdTime: "2020-04-20T09:07:00.000Z",
      modifiedTime: "2020-04-20T09:07:07.000Z",
      sync: {
        file: {
          id: "2931",
          name: "Clipboard",
          createdTime: "2020-04-20T09:07:00.000Z",
          modifiedTime: "2020-04-20T09:07:07.000Z",
        }
      }
    },
  };

  const files = [
    { id: "2931", name: "CopyPaste", createdTime: "2020-04-20T09:07:00.000Z", modifiedTime: "2020-04-20T09:07:12.000Z" }, // "Clipboard" cannot be renamed
  ];

  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 1); // { Clipboard }

  // Clipboard
  expect(updatedNotes.Clipboard.content === "Clipboard content");
  expect(updatedNotes.Clipboard.createdTime === "2020-04-20T09:07:00.000Z");
  expect(updatedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:07.000Z");
  expect("sync" in updatedNotes.Clipboard === false); // unlinked
});

it("unlinks any note if renamed to Clipboard in Google Drive", async () => {
  const notes = {
    Todo: {
      content: "buy milk",
      createdTime: "2020-04-20T09:02:00.000Z",
      modifiedTime: "2020-04-20T09:02:02.000Z",
      sync: {
        file: {
          id: "6073",
          name: "Todo",
          createdTime: "2020-04-20T09:02:00.000Z",
          modifiedTime: "2020-04-20T09:02:02.000Z",
        }
      }
    },
  };

  const files = [
    { id: "6073", name: "Clipboard", createdTime: "2020-04-20T09:02:00.000Z", modifiedTime: "2020-04-20T09:02:07.000Z" },
  ];

  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 1); // { Todo }

  // Todo
  expect(updatedNotes.Todo.content === "buy milk");
  expect(updatedNotes.Todo.createdTime === "2020-04-20T09:02:00.000Z");
  expect(updatedNotes.Todo.modifiedTime === "2020-04-20T09:02:02.000Z");
  expect("sync" in updatedNotes.Todo === false); // unlinked
});

// Relink the notes, and:
// - leave the content unchanged, if the file and note are the same (Todo)
// - append the file content, if the file and note are NOT the same (Clipboard)
it("links notes to files with same name in Google Drive", async () => {
  const notes = {
    Todo: {
      content: "buy milk",
      createdTime: "2020-04-20T09:02:00.000Z",
      modifiedTime: "2020-04-20T09:02:02.000Z",
    },
    Clipboard: {
      content: "my clipboard",
      createdTime: "2020-04-20T09:07:00.000Z",
      modifiedTime: "2020-04-20T09:07:07.000Z",
    },
  };

  const files = [
    // SAME modifiedTime
    { id: "6073", name: "Todo", createdTime: "2020-04-20T09:02:00.000Z", modifiedTime: "2020-04-20T09:02:02.000Z" },

    // UPDATED
    { id: "2931", name: "Clipboard", createdTime: "2020-04-20T09:07:00.000Z", modifiedTime: "2020-04-20T09:07:12.000Z" },
  ];

  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 2); // { Todo, Clipboard }

  // Todo
  expect(updatedNotes.Todo.content === "buy milk"); // unchanged
  expect(updatedNotes.Todo.createdTime === "2020-04-20T09:02:00.000Z");
  expect(updatedNotes.Todo.modifiedTime === "2020-04-20T09:02:02.000Z");
  expect(updatedNotes.Todo.sync?.file.id === "6073");
  expect(updatedNotes.Todo.sync?.file.name === "Todo");
  expect(updatedNotes.Todo.sync?.file.createdTime === "2020-04-20T09:02:00.000Z");
  expect(updatedNotes.Todo.sync?.file.modifiedTime === "2020-04-20T09:02:02.000Z");
  expect(Object.keys(updatedNotes.Todo.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Clipboard
  expect(updatedNotes.Clipboard.content === "my clipboard<br><br>CONTENT OF 2931"); // appended (not replaced)
  expect(updatedNotes.Clipboard.createdTime === "2020-04-20T09:07:00.000Z");
  expect(updatedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:12.000Z");
  expect(updatedNotes.Clipboard.sync?.file.id === "2931");
  expect(updatedNotes.Clipboard.sync?.file.name === "Clipboard");
  expect(updatedNotes.Clipboard.sync?.file.createdTime === "2020-04-20T09:07:00.000Z");
  expect(updatedNotes.Clipboard.sync?.file.modifiedTime === "2020-04-20T09:07:12.000Z");
  expect(Object.keys(updatedNotes.Clipboard.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }
});

it("links notes to the last file in Google Drive if having the same name in Google Drive", async () => {
  const notes = {
    Todo: {
      content: "buy milk",
      createdTime: "2020-04-20T09:02:00.000Z",
      modifiedTime: "2020-04-20T09:02:02.000Z",
    },
    Clipboard: {
      content: "my clipboard",
      createdTime: "2020-04-20T09:07:00.000Z",
      modifiedTime: "2020-04-20T09:07:07.000Z",
    },
  };

  const files = [
    // "Todo" renamed to "Clipboard" (UPDATED)
    { id: "6073", name: "Clipboard", createdTime: "2020-04-20T09:02:00.000Z", modifiedTime: "2020-04-20T09:07:17.000Z" },

    // "Clipboard" (UPDATED)
    { id: "2931", name: "Clipboard", createdTime: "2020-04-20T09:07:00.000Z", modifiedTime: "2020-04-20T09:07:12.000Z" },
  ];

  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 2); // { Todo, Clipboard }

  // Todo
  expect(updatedNotes.Todo.content === "buy milk");
  expect(updatedNotes.Todo.createdTime === "2020-04-20T09:02:00.000Z");
  expect(updatedNotes.Todo.modifiedTime === "2020-04-20T09:02:02.000Z");
  expect("sync" in updatedNotes.Todo === false);

  // Clipboard (last file used)
  expect(updatedNotes.Clipboard.content === "CONTENT OF 2931");
  expect(updatedNotes.Clipboard.createdTime === "2020-04-20T09:07:00.000Z");
  expect(updatedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:12.000Z");
  expect(updatedNotes.Clipboard.sync?.file.id === "2931");
  expect(updatedNotes.Clipboard.sync?.file.name === "Clipboard");
  expect(updatedNotes.Clipboard.sync?.file.createdTime === "2020-04-20T09:07:00.000Z");
  expect(updatedNotes.Clipboard.sync?.file.modifiedTime === "2020-04-20T09:07:12.000Z");
  expect(Object.keys(updatedNotes.Clipboard.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }
});

// Since last sync, renamed the note, renamed the linked file as well
// Expected: update the note name, content, linked file name
it("renames the note if linked but renamed in Google Drive", async () => {
  const notes = {
    Cooking: { // renamed since last sync (before: "Kitchen")
      content: "Cooking content",
      createdTime: "2020-04-20T09:03:00.000Z",
      modifiedTime: "2020-04-20T09:03:08.000Z",
      sync: {
        file: {
          id: "ecb5",
          name: "Kitchen",
          createdTime: "2020-04-20T09:03:00.000Z",
          modifiedTime: "2020-04-20T09:03:03.000Z",
        }
      }
    },
    Clipboard: {
      content: "my clipboard",
      createdTime: "2020-04-20T09:07:00.000Z",
      modifiedTime: "2020-04-20T09:07:07.000Z",
    },
  };

  const files = [
    // UPDATED, renamed as well
    { id: "ecb5", name: "Recipes", createdTime: "2020-04-20T09:03:00.000Z", modifiedTime: "2020-04-20T09:03:13.000Z" },
  ];

  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 2); // { Recipes, Clipboard }

  // Recipes
  expect(updatedNotes.Recipes.content === "CONTENT OF ecb5");
  expect(updatedNotes.Recipes.createdTime === "2020-04-20T09:03:00.000Z");
  expect(updatedNotes.Recipes.modifiedTime === "2020-04-20T09:03:13.000Z");
  expect(updatedNotes.Recipes.sync?.file.id === "ecb5");
  expect(updatedNotes.Recipes.sync?.file.name === "Recipes");
  expect(updatedNotes.Recipes.sync?.file.createdTime === "2020-04-20T09:03:00.000Z");
  expect(updatedNotes.Recipes.sync?.file.modifiedTime === "2020-04-20T09:03:13.000Z");
  expect(Object.keys(updatedNotes.Recipes.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Clipboard
  expect(updatedNotes.Clipboard.content === "my clipboard");
  expect(updatedNotes.Clipboard.createdTime === "2020-04-20T09:07:00.000Z");
  expect(updatedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:07.000Z");
  expect("sync" in updatedNotes.Clipboard === false);
});
