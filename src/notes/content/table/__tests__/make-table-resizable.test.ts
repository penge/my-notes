import { JSDOM } from "jsdom";
import makeTableResizable from "../make-table-resizable";
import {
  tableHtml,
  tableHtmlHoverE,
  tableHtmlHoverI,
  prepareDom,
} from "./fixtures";

describe("makeTableResizable()", () => {
  let dom: JSDOM;
  let table: HTMLTableElement;
  let onResize: jest.Mock;

  const prepareTable = (html: string) => {
    const prepared = prepareDom(html);
    dom = prepared.dom;
    table = prepared.table;
    onResize = jest.fn();

    makeTableResizable({
      document: dom.window.document,
      table,
      onResize: () => {},
    });
  };

  it("keeps table markup unchanged", () => {
    prepareTable(tableHtml);
    expect(table.outerHTML).toBe(tableHtml);
  });

  it("does NOT call onResize on init", () => {
    prepareTable(tableHtml);
    expect(onResize).not.toHaveBeenCalled();
  });

  const enterAndLeave = (
    cell: HTMLTableCellElement,
    expectedTableHtmlOnEnter: string,
    expectedTableHtmlOnLeave: string,
  ) => {
    cell.dispatchEvent(new dom.window.Event("mouseenter"));
    expect(table.outerHTML).toBe(expectedTableHtmlOnEnter);

    cell.dispatchEvent(new dom.window.Event("mouseleave"));
    expect(table.outerHTML).toBe(expectedTableHtmlOnLeave);
  };

  it("adds resizing divs on mouseenter, removes them on mouseleave", () => {
    prepareTable(tableHtml);
    enterAndLeave(table.rows[1].cells[1], tableHtmlHoverE, tableHtml);
    enterAndLeave(table.rows[2].cells[2], tableHtmlHoverI, tableHtml);
  });

  it("removes any leftover resizing divs", () => {
    prepareTable(tableHtmlHoverE);
    enterAndLeave(table.rows[2].cells[2], tableHtmlHoverI, tableHtml);
  });
});
