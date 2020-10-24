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
      Math: {
        content: "some equations",
        createdTime: "2020-04-20T09:09:00.000Z",
        modifiedTime: "2020-04-20T09:09:09.000Z",
      },
    },
    active: "Todo",
    focus: true,
    newtab: true,
    tab: true,
  };

  const items = migrate({}, local);
  expectItems(Object.assign({}, items as unknown));

  // Compare objects
  expect(items).toEqual(Object.assign({
    sidebar: true,
    toolbar: true,
  }, local));
});
