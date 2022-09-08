import { h } from "preact";
import {
  useRef, useState, useEffect, useMemo,
} from "preact/hooks";
import clsx from "clsx";
import useBodyClass from "notes/hooks/use-body-class";
import { t, tString } from "i18n";
import {
  Command, commands as contentCommands, toggleSidebar, toggleToolbar,
} from "notes/commands";

type CommandPaletteCommand = {
  title: string
  command: Command
  isContentCommand?: boolean
};

const allCommands: CommandPaletteCommand[] = [
  {
    title: tString("Insert current Date"),
    command: contentCommands.InsertCurrentDate,
    isContentCommand: true,
  },
  {
    title: tString("Insert current Time"),
    command: contentCommands.InsertCurrentTime,
    isContentCommand: true,
  },
  {
    title: tString("Insert current Date and Time"),
    command: contentCommands.InsertCurrentDateAndTime,
    isContentCommand: true,
  },
  {
    title: tString("Shortcuts descriptions.Toggle Sidebar"),
    command: toggleSidebar,
  },
  {
    title: tString("Shortcuts descriptions.Toggle Toolbar"),
    command: toggleToolbar,
  },
];

export interface CommandPaletteProps {
  includeContentCommands: boolean
  onCommandToExecute: (command: Command) => void
}

const CommandPalette = ({
  includeContentCommands,
  onCommandToExecute,
}: CommandPaletteProps): h.JSX.Element => {
  useBodyClass("with-command-palette");

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  const [filter, setFilter] = useState("");
  const filteredCommands = useMemo(() => (
    allCommands
      .filter((x) => (includeContentCommands ? true : (!x.isContentCommand)))
      .filter((x) => (filter ? x.title.toLowerCase().includes(filter.trim().toLowerCase()) : true))
  ), [includeContentCommands, filter]);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  useEffect(() => setSelectedIndex(filteredCommands.length === 1 ? 0 : -1), [filteredCommands]);

  return (
    <div
      id="command-palette"
      onKeyDown={(event) => {
        if (event.key === "Enter" && selectedIndex !== -1) {
          const { command } = filteredCommands[selectedIndex];
          onCommandToExecute(command);
          return;
        }

        const direction = { ArrowUp: -1, ArrowDown: 1 }[event.key];
        if (!direction) {
          return;
        }

        event.preventDefault();
        const activeIndexCandidate = ((selectedIndex + direction) % filteredCommands.length);
        setSelectedIndex(
          activeIndexCandidate < 0 && direction === -1
            ? filteredCommands.length - 1
            : activeIndexCandidate,
        );
      }}
    >
      <input
        id="command-palette-input"
        type="text"
        placeholder={tString("Search")}
        ref={inputRef}
        onBlur={() => inputRef.current?.focus()}
        onInput={(event) => {
          setFilter((event.target as HTMLInputElement).value);
        }}
        autoComplete="off"
      />

      {filteredCommands.length > 0 && (
        <div className="command-palette-list">
          {filteredCommands.map((item, index) => (
            <div
              className={clsx("command-palette-list-item", index === selectedIndex && "active")}
              onClick={() => onCommandToExecute(item.command)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {item.title}
            </div>
          ))}
        </div>
      )}

      {filteredCommands.length === 0 && (
        <div className="command-palette-list">
          <div className="command-palette-list-item plain">
            {t("(No matching commands)")}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandPalette;
