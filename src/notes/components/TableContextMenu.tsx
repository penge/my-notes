import { h } from "preact";
import SVG from "notes/components/SVG";
import svgs from "svg";
import ContextMenu from "./ContextMenu";

export interface TableContextMenuProps {
  x: number
  y: number
  onAlignLeft: () => void
  onAlignCenter: () => void
  onAlignRight: () => void
}

const TableContextMenu = ({
  x, y,
  onAlignLeft, onAlignCenter, onAlignRight,
}: TableContextMenuProps): h.JSX.Element => (
  <ContextMenu x={x} y={y}>
    <div className="action group">
      <div className="inline action" onClick={onAlignLeft}>
        <SVG text={svgs.AlignLeftSvgText} />
      </div>

      <div className="inline action" onClick={onAlignCenter}>
        <SVG text={svgs.AlignCenterSvgText} />
      </div>

      <div className="inline action" onClick={onAlignRight}>
        <SVG text={svgs.AlignRightSvgText} />
      </div>
    </div>
  </ContextMenu>
);

export default TableContextMenu;
