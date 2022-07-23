import { Storage, NotesOrder } from "shared/storage/schema";
import migrate from "../core";
import expectItems from "./expect-items";

it("uses existing values and adds any omitted properties set to their defaults to make a complete Storage", () => {
  const existing: Partial<Storage> = {
    font: {
      id: "roboto-mono",
      name: "Roboto Mono",
      fontFamily: "\"Roboto Mono\"",
      href: "https://fonts.googleapis.com/css?family=Roboto+Mono:400,700&display=swap",
    },
    size: 340,
    theme: "dark",
    customTheme: "my custom theme css",
    notes: {
      Todo: {
        content: "buy milk",
        createdTime: "2020-04-20T09:02:00Z",
        modifiedTime: "2020-04-20T09:02:02Z",
        sync: {
          file: {
            id: "6073",
            name: "Todo",
            createdTime: "2020-04-20T09:02:00Z",
            modifiedTime: "2020-04-20T09:02:02Z",
          },
        },
      },
      Notebook: {
        content: "Notebook content",
        createdTime: "2020-04-20T09:07:00Z",
        modifiedTime: "2020-04-20T09:07:07Z",
        sync: {
          file: {
            id: "2931",
            name: "Notebook",
            createdTime: "2020-04-20T09:07:00Z",
            modifiedTime: "2020-04-20T09:07:07Z",
          },
        },
      },
      Math: {
        content: "some equations",
        createdTime: "2020-04-20T09:09:00Z",
        modifiedTime: "2020-04-20T09:09:09Z",
      },
    },
    active: "Todo",
    focus: true,
    tab: true,
    tabSize: 2,
  };

  const items: Storage = migrate({}, existing);
  expectItems(items);

  expect(items).toEqual(Object.assign({
    /**
     * Omitted properties below are added and set to their defaults
     * to make a complete Storage.
     * See {@link Storage}
     */
    order: [],
    notesOrder: NotesOrder.Alphabetical,
    sidebar: true,
    toolbar: true,
    autoSync: false,
    setBy: "",
    lastEdit: "",
    openNoteOnMouseHover: false,
  } as Partial<Storage>, existing));
});
