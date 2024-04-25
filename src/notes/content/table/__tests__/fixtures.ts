import { JSDOM } from "jsdom";

// A B C
// D E F
// G H I
export const tableHtml = `<table>
  <tbody><tr>
    <td>A</td>
    <td>B</td>
    <td>C</td>
  </tr>
  <tr>
    <td>D</td>
    <td>E</td>
    <td>F</td>
  </tr>
  <tr>
    <td>G</td>
    <td>H</td>
    <td>I</td>
  </tr></tbody>
</table>`;

const tableRowResizingDiv = (
  '<div class="table-resizing-div table-row-resizing-div"></div>'
);

const tableColumnResizingDiv = (
  '<div class="table-resizing-div table-column-resizing-div"></div>'
);

const tableRowColumnResizingDivs = `${tableRowResizingDiv}${tableColumnResizingDiv}`;

export const tableHtmlHoverE = `<table>
  <tbody><tr>
    <td>A</td>
    <td>B</td>
    <td>C</td>
  </tr>
  <tr>
    <td>D</td>
    <td>E${tableRowColumnResizingDivs}</td>
    <td>F</td>
  </tr>
  <tr>
    <td>G</td>
    <td>H</td>
    <td>I</td>
  </tr></tbody>
</table>`;

export const tableHtmlHoverI = `<table>
  <tbody><tr>
    <td>A</td>
    <td>B</td>
    <td>C</td>
  </tr>
  <tr>
    <td>D</td>
    <td>E</td>
    <td>F</td>
  </tr>
  <tr>
    <td>G</td>
    <td>H</td>
    <td>I${tableRowColumnResizingDivs}</td>
  </tr></tbody>
</table>`;

export const prepareDom = (tableHtmlToInsert: string): { dom: JSDOM, table: HTMLTableElement } => {
  const dom = new JSDOM();
  dom.window.document.body.insertAdjacentHTML("afterbegin", tableHtmlToInsert);
  const table = dom.window.document.body.children[0] as HTMLTableElement;
  return { dom, table };
};
