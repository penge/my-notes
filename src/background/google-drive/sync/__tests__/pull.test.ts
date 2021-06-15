process.env.LOG_LEVEL = "SILENT";

import pull from "../pull";

/*
UNCHANGED - Note should remain unchanged if not DELETED || NEW || UPDATED
DELETED - Delete notes that were synced (having sync?.file.id) but deleted from the remote
NEW - Add new notes created in the remote (file.id not present in any of notes)
UPDATED - Update notes name/content if updated in the remote (file.modifiedTime > note.modifiedTime)
*/
const notes = {
  Article: { // UNCHANGED
    content: "Article content",
    createdTime: "2020-04-20T09:01:00Z",
    modifiedTime: "2020-04-20T09:01:01Z",
    sync: {
      file: {
        id: "4360",
        name: "Article",
        createdTime: "2020-04-20T09:01:00Z",
        modifiedTime: "2020-04-20T09:01:01Z",
      }
    }
  },

  Todo: { // UPDATED (new content only)
    content: "buy milk",
    createdTime: "2020-04-20T09:02:00Z",
    modifiedTime: "2020-04-20T09:02:02Z",
    sync: {
      file: {
        id: "6073",
        name: "Todo",
        createdTime: "2020-04-20T09:02:00Z",
        modifiedTime: "2020-04-20T09:02:02Z",
      }
    }
  },

  Cooking: { // DELETED
    content: "Cooking content",
    createdTime: "2020-04-20T09:03:00Z",
    modifiedTime: "2020-04-20T09:03:03Z",
    sync: {
      file: {
        id: "ecb5",
        name: "Cooking",
        createdTime: "2020-04-20T09:03:00Z",
        modifiedTime: "2020-04-20T09:03:03Z",
      }
    }
  },

  Books: { // UPDATED (new content only)
    content: "The Great Gatsby",
    createdTime: "2020-04-20T09:04:00Z",
    modifiedTime: "2020-04-20T09:04:04Z",
    sync: {
      file: {
        id: "9d13",
        name: "Books",
        createdTime: "2020-04-20T09:04:00Z",
        modifiedTime: "2020-04-20T09:04:04Z",
      }
    }
  },

  Radio: { // UNCHANGED
    content: "some radio stations",
    createdTime: "2020-04-20T09:05:00Z",
    modifiedTime: "2020-04-20T09:05:05Z",
  },

  Shopping: { // UPDATED (new name AND new content; new name - "Amazon")
    content: "things to buy",
    createdTime: "2020-04-20T09:06:00Z",
    modifiedTime: "2020-04-20T09:06:06Z",
    sync: {
      file: {
        id: "df29",
        name: "Shopping",
        createdTime: "2020-04-20T09:06:00Z",
        modifiedTime: "2020-04-20T09:06:06Z",
      }
    }
  },

  Clipboard: { // DELETED
    content: "Clipboard content",
    createdTime: "2020-04-20T09:07:00Z",
    modifiedTime: "2020-04-20T09:07:07Z",
    sync: {
      file: {
        id: "2931",
        name: "Clipboard",
        createdTime: "2020-04-20T09:07:00Z",
        modifiedTime: "2020-04-20T09:07:07Z",
      }
    }
  },

  News: { // DELETED
    content: "news for today",
    createdTime: "2020-04-20T09:08:00Z",
    modifiedTime: "2020-04-20T09:08:08Z",
    sync: {
      file: {
        id: "f745",
        name: "News",
        createdTime: "2020-04-20T09:08:00Z",
        modifiedTime: "2020-04-20T09:08:08Z",
      }
    }
  },

  Math: { // UPDATED (new content only; name conflict; content should be appended and sync?.file set)
    content: "some equations",
    createdTime: "2020-04-20T09:09:00Z",
    modifiedTime: "2020-04-20T09:09:09Z",
  },

  Vacation: { // UPDATED (new name AND new content; new name - "Trip")
    content: "places to go",
    createdTime: "2020-04-20T09:10:00Z",
    modifiedTime: "2020-04-20T09:10:10Z",
    sync: {
      file: {
        id: "9e0e",
        name: "Vacation",
        createdTime: "2020-04-20T09:10:00Z",
        modifiedTime: "2020-04-20T09:10:10Z",
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
  { id: "4360", name: "Article", createdTime: "2020-04-20T09:01:00Z", modifiedTime: "2020-04-20T09:01:01Z" },
  // "Radio"

  // UPDATED
  { id: "6073", name: "Todo", createdTime: "2020-04-20T09:02:00Z", modifiedTime: "2020-04-20T09:02:07Z" },
  { id: "9d13", name: "Books", createdTime: "2020-04-20T09:04:00Z", modifiedTime: "2020-04-20T09:04:09Z" },
  { id: "df29", name: "Amazon", createdTime: "2020-04-20T09:06:00Z", modifiedTime: "2020-04-20T09:06:11Z" }, // before "Shopping"
  { id: "777f", name: "Math", createdTime: "2020-04-20T09:25:00Z", modifiedTime: "2020-04-20T09:25:25Z" }, // name conflict = add content to existing note
  { id: "9e0e", name: "Trip", createdTime: "2020-04-20T09:10:00Z", modifiedTime: "2020-04-20T09:10:15Z" }, // before "Vacation"

  // DELETED
  // { id: "ecb5", ... } // "Cooking"
  // { id: "f745", ... } // "News"
  // { id: "2931", ... } // "Clipboard"

  // NEW
  { id: "2b18", name: "Phones", createdTime: "2020-04-20T09:11:00Z", modifiedTime: "2020-04-20T09:11:11Z" },
  { id: "0dc9", name: "TV", createdTime: "2020-04-20T09:12:00Z", modifiedTime: "2020-04-20T09:12:12Z" },
  { id: "b378", name: "Lamps", createdTime: "2020-04-20T09:13:00Z", modifiedTime: "2020-04-20T09:13:13Z" },
];

const getFile = (fileId: string): Promise<string> => Promise.resolve(`CONTENT OF ${fileId}`);

it("pulls new and updated notes, and deletes notes if deleted in Google Drive", async () => {
  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 11); // 10 original, -2 deleted, +3 new

  // Article
  expect(updatedNotes.Article.content === "Article content");
  expect(updatedNotes.Article.createdTime === "2020-04-20T09:01:00Z");
  expect(updatedNotes.Article.modifiedTime === "2020-04-20T09:01:01Z");
  expect(updatedNotes.Article.sync?.file.id === "4360");
  expect(updatedNotes.Article.sync?.file.name === "Article");
  expect(updatedNotes.Article.sync?.file.createdTime === "2020-04-20T09:01:00Z");
  expect(updatedNotes.Article.sync?.file.modifiedTime === "2020-04-20T09:01:01Z");
  expect(Object.keys(updatedNotes.Article.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Todo
  expect(updatedNotes.Todo.content === "CONTENT OF 6073");
  expect(updatedNotes.Todo.createdTime === "2020-04-20T09:02:00Z");
  expect(updatedNotes.Todo.modifiedTime === "2020-04-20T09:02:07Z");
  expect(updatedNotes.Todo.sync?.file.id === "6073");
  expect(updatedNotes.Todo.sync?.file.name === "Todo");
  expect(updatedNotes.Todo.sync?.file.createdTime === "2020-04-20T09:02:00Z");
  expect(updatedNotes.Todo.sync?.file.modifiedTime === "2020-04-20T09:02:07Z");
  expect(Object.keys(updatedNotes.Todo.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // deleted Cooking
  expect("Cooking" in updatedNotes === false);

  // Books
  expect(updatedNotes.Books.content === "CONTENT OF 9d13");
  expect(updatedNotes.Books.createdTime === "2020-04-20T09:04:00Z");
  expect(updatedNotes.Books.modifiedTime === "2020-04-20T09:04:09Z");
  expect(updatedNotes.Books.sync?.file.id === "9d13");
  expect(updatedNotes.Books.sync?.file.name === "Books");
  expect(updatedNotes.Books.sync?.file.createdTime === "2020-04-20T09:04:00Z");
  expect(updatedNotes.Books.sync?.file.modifiedTime === "2020-04-20T09:04:09Z");
  expect(Object.keys(updatedNotes.Books.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Radio
  expect(updatedNotes.Radio.content === "some radio stations");
  expect(updatedNotes.Radio.createdTime === "2020-04-20T09:05:00Z");
  expect(updatedNotes.Radio.modifiedTime === "2020-04-20T09:05:05Z");
  expect("sync" in updatedNotes.Radio === false);

  // Amazon (before "Shopping")
  expect(updatedNotes.Amazon.content === "CONTENT OF df29");
  expect(updatedNotes.Amazon.createdTime === "2020-04-20T09:06:00Z");
  expect(updatedNotes.Amazon.modifiedTime === "2020-04-20T09:06:11Z");
  expect(updatedNotes.Amazon.sync?.file.id === "df29");
  expect(updatedNotes.Amazon.sync?.file.name === "Amazon");
  expect(updatedNotes.Amazon.sync?.file.createdTime === "2020-04-20T09:06:00Z");
  expect(updatedNotes.Amazon.sync?.file.modifiedTime === "2020-04-20T09:06:11Z");
  expect(Object.keys(updatedNotes.Amazon.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }
  expect("Shopping" in updatedNotes === false); // renamed to "Amazon"

  // deleted Clipboard
  expect("Clipboard" in updatedNotes === false);

  // deleted News
  expect("News" in updatedNotes === false);

  // Math
  expect(updatedNotes.Math.content === "some equations<br><br>CONTENT OF 777f");
  expect(updatedNotes.Math.createdTime === "2020-04-20T09:25:00Z");
  expect(updatedNotes.Math.modifiedTime === "2020-04-20T09:25:25Z");
  expect(updatedNotes.Math.sync?.file.id === "777f");
  expect(updatedNotes.Math.sync?.file.name === "Math");
  expect(updatedNotes.Math.sync?.file.createdTime === "2020-04-20T09:25:00Z");
  expect(updatedNotes.Math.sync?.file.modifiedTime === "2020-04-20T09:25:25Z");
  expect(Object.keys(updatedNotes.Math.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Trip (before "Vacation")
  expect(updatedNotes.Trip.content === "CONTENT OF 9e0e");
  expect(updatedNotes.Trip.createdTime === "2020-04-20T09:10:00Z");
  expect(updatedNotes.Trip.modifiedTime === "2020-04-20T09:10:15Z");
  expect(updatedNotes.Trip.sync?.file.id === "9e0e");
  expect(updatedNotes.Trip.sync?.file.name === "Trip");
  expect(updatedNotes.Trip.sync?.file.createdTime === "2020-04-20T09:10:00Z");
  expect(updatedNotes.Trip.sync?.file.modifiedTime === "2020-04-20T09:10:15Z");
  expect(Object.keys(updatedNotes.Trip.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }
  expect("Vacation" in updatedNotes === false); // renamed to "Trip"

  // Phones
  expect(updatedNotes.Phones.content === "CONTENT OF 2b18");
  expect(updatedNotes.Phones.createdTime === "2020-04-20T09:11:00Z");
  expect(updatedNotes.Phones.modifiedTime === "2020-04-20T09:11:11Z");
  expect(updatedNotes.Phones.sync?.file.id === "2b18");
  expect(updatedNotes.Phones.sync?.file.name === "Phones");
  expect(updatedNotes.Phones.sync?.file.createdTime === "2020-04-20T09:11:00Z");
  expect(updatedNotes.Phones.sync?.file.modifiedTime === "2020-04-20T09:11:11Z");
  expect(Object.keys(updatedNotes.Phones.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // TV
  expect(updatedNotes.TV.content === "CONTENT OF 0dc9");
  expect(updatedNotes.TV.createdTime === "2020-04-20T09:12:00Z");
  expect(updatedNotes.TV.modifiedTime === "2020-04-20T09:12:12Z");
  expect(updatedNotes.TV.sync?.file.id === "0dc9");
  expect(updatedNotes.TV.sync?.file.name === "TV");
  expect(updatedNotes.TV.sync?.file.createdTime === "2020-04-20T09:12:00Z");
  expect(updatedNotes.TV.sync?.file.modifiedTime === "2020-04-20T09:12:12Z");
  expect(Object.keys(updatedNotes.TV.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Lamps
  expect(updatedNotes.Lamps.content === "CONTENT OF b378");
  expect(updatedNotes.Lamps.createdTime === "2020-04-20T09:13:00Z");
  expect(updatedNotes.Lamps.modifiedTime === "2020-04-20T09:13:13Z");
  expect(updatedNotes.Lamps.sync?.file.id === "b378");
  expect(updatedNotes.Lamps.sync?.file.name === "Lamps");
  expect(updatedNotes.Lamps.sync?.file.createdTime === "2020-04-20T09:13:00Z");
  expect(updatedNotes.Lamps.sync?.file.modifiedTime === "2020-04-20T09:13:13Z");
  expect(Object.keys(updatedNotes.Lamps.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }
});

// Relink the notes, and:
// - leave the content unchanged, if the file and note are the same (Todo)
// - append the file content, if the file and note are NOT the same (Clipboard)
it("links notes to files with same name in Google Drive", async () => {
  const notes = {
    Todo: {
      content: "buy milk",
      createdTime: "2020-04-20T09:02:00Z",
      modifiedTime: "2020-04-20T09:02:02Z",
    },
    Clipboard: {
      content: "my clipboard",
      createdTime: "2020-04-20T09:07:00Z",
      modifiedTime: "2020-04-20T09:07:07Z",
    },
  };

  const files = [
    // SAME modifiedTime
    { id: "6073", name: "Todo", createdTime: "2020-04-20T09:02:00Z", modifiedTime: "2020-04-20T09:02:02Z" },

    // UPDATED
    { id: "2931", name: "Clipboard", createdTime: "2020-04-20T09:07:00Z", modifiedTime: "2020-04-20T09:07:12Z" },
  ];

  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 2); // { Todo, Clipboard }

  // Todo
  expect(updatedNotes.Todo.content === "buy milk"); // unchanged
  expect(updatedNotes.Todo.createdTime === "2020-04-20T09:02:00Z");
  expect(updatedNotes.Todo.modifiedTime === "2020-04-20T09:02:02Z");
  expect(updatedNotes.Todo.sync?.file.id === "6073");
  expect(updatedNotes.Todo.sync?.file.name === "Todo");
  expect(updatedNotes.Todo.sync?.file.createdTime === "2020-04-20T09:02:00Z");
  expect(updatedNotes.Todo.sync?.file.modifiedTime === "2020-04-20T09:02:02Z");
  expect(Object.keys(updatedNotes.Todo.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Clipboard
  expect(updatedNotes.Clipboard.content === "my clipboard<br><br>CONTENT OF 2931"); // appended (not replaced)
  expect(updatedNotes.Clipboard.createdTime === "2020-04-20T09:07:00Z");
  expect(updatedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:12Z");
  expect(updatedNotes.Clipboard.sync?.file.id === "2931");
  expect(updatedNotes.Clipboard.sync?.file.name === "Clipboard");
  expect(updatedNotes.Clipboard.sync?.file.createdTime === "2020-04-20T09:07:00Z");
  expect(updatedNotes.Clipboard.sync?.file.modifiedTime === "2020-04-20T09:07:12Z");
  expect(Object.keys(updatedNotes.Clipboard.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }
});

it("links notes to the last file in Google Drive if having the same name in Google Drive", async () => {
  const notes = {
    Todo: {
      content: "buy milk",
      createdTime: "2020-04-20T09:02:00Z",
      modifiedTime: "2020-04-20T09:02:02Z",
    },
    Clipboard: {
      content: "my clipboard",
      createdTime: "2020-04-20T09:07:00Z",
      modifiedTime: "2020-04-20T09:07:07Z",
    },
  };

  const files = [
    // "Todo" renamed to "Clipboard" (UPDATED)
    { id: "6073", name: "Clipboard", createdTime: "2020-04-20T09:02:00Z", modifiedTime: "2020-04-20T09:07:17Z" },

    // "Clipboard" (UPDATED)
    { id: "2931", name: "Clipboard", createdTime: "2020-04-20T09:07:00Z", modifiedTime: "2020-04-20T09:07:12Z" },
  ];

  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 2); // { Todo, Clipboard }

  // Todo
  expect(updatedNotes.Todo.content === "buy milk");
  expect(updatedNotes.Todo.createdTime === "2020-04-20T09:02:00Z");
  expect(updatedNotes.Todo.modifiedTime === "2020-04-20T09:02:02Z");
  expect("sync" in updatedNotes.Todo === false);

  // Clipboard (last file with the same name used)
  expect(updatedNotes.Clipboard.content === "CONTENT OF 2931");
  expect(updatedNotes.Clipboard.createdTime === "2020-04-20T09:07:00Z");
  expect(updatedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:12Z");
  expect(updatedNotes.Clipboard.sync?.file.id === "2931");
  expect(updatedNotes.Clipboard.sync?.file.name === "Clipboard");
  expect(updatedNotes.Clipboard.sync?.file.createdTime === "2020-04-20T09:07:00Z");
  expect(updatedNotes.Clipboard.sync?.file.modifiedTime === "2020-04-20T09:07:12Z");
  expect(Object.keys(updatedNotes.Clipboard.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }
});

// Since last sync, renamed the note, renamed the linked file as well
// Expected: update the note name, content, linked file name
it("renames the note if linked but renamed in Google Drive", async () => {
  const notes = {
    Cooking: { // renamed since last sync (before: "Kitchen")
      content: "Cooking content",
      createdTime: "2020-04-20T09:03:00Z",
      modifiedTime: "2020-04-20T09:03:08Z",
      sync: {
        file: {
          id: "ecb5",
          name: "Kitchen",
          createdTime: "2020-04-20T09:03:00Z",
          modifiedTime: "2020-04-20T09:03:03Z",
        }
      }
    },
    Clipboard: {
      content: "my clipboard",
      createdTime: "2020-04-20T09:07:00Z",
      modifiedTime: "2020-04-20T09:07:07Z",
    },
  };

  const files = [
    // UPDATED, renamed as well
    { id: "ecb5", name: "Recipes", createdTime: "2020-04-20T09:03:00Z", modifiedTime: "2020-04-20T09:03:13Z" },
  ];

  const updatedNotes = await pull(notes, files, { getFile });

  expect(Object.keys(updatedNotes).length === 2); // { Recipes, Clipboard }

  // Recipes
  expect(updatedNotes.Recipes.content === "CONTENT OF ecb5");
  expect(updatedNotes.Recipes.createdTime === "2020-04-20T09:03:00Z");
  expect(updatedNotes.Recipes.modifiedTime === "2020-04-20T09:03:13Z");
  expect(updatedNotes.Recipes.sync?.file.id === "ecb5");
  expect(updatedNotes.Recipes.sync?.file.name === "Recipes");
  expect(updatedNotes.Recipes.sync?.file.createdTime === "2020-04-20T09:03:00Z");
  expect(updatedNotes.Recipes.sync?.file.modifiedTime === "2020-04-20T09:03:13Z");
  expect(Object.keys(updatedNotes.Recipes.sync?.file || {}).length === 4); // { id, name, createdTime, modifiedTime }

  // Clipboard
  expect(updatedNotes.Clipboard.content === "my clipboard");
  expect(updatedNotes.Clipboard.createdTime === "2020-04-20T09:07:00Z");
  expect(updatedNotes.Clipboard.modifiedTime === "2020-04-20T09:07:07Z");
  expect("sync" in updatedNotes.Clipboard === false);
});
