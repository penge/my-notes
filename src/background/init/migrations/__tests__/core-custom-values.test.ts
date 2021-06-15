import { Storage } from "shared/storage/schema";
import migrate from "../core";
import { expectItems } from "./core-default-values.test";

it("sets custom values", () => {
  const local = {
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
          }
        }
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
          }
        }
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

  const items: Storage = migrate({}, local);
  expectItems(Object.assign({}, items as unknown));

  // Compare objects
  expect(items).toEqual(Object.assign({
    // Automatically added properties to make a complete object (interface Storage)
    sidebar: true,
    toolbar: true,
    autoSync: false,
    setBy: "",
    lastEdit: "",
  }, local));
});
