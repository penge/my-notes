import { h } from "preact";
import { useRef, useState, useMemo, useEffect, useCallback } from "preact/hooks";
import clsx from "clsx";
import {
  normalizeFilter,
  isCommandFilter,
} from "notes/filters";

export interface CommandPaletteProps {
  noteNames: string[]
  commands: string[]
  onActivateNote: (noteName: string) => void
  onExecuteCommand: (commandName: string) => void
}

const filterPredicate = (filter: string) => (item: string) => filter ? item.toLowerCase().includes(filter) : item;
const getDirection = (key: string): number | undefined => ({ ArrowUp: -1, ArrowDown: 1 })[key];

const CommandPalette = ({ noteNames, commands, onActivateNote, onExecuteCommand }: CommandPaletteProps): h.JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const filteredItems = useMemo(() =>
    isCommandFilter(filter)
      ? commands.filter(filterPredicate(filter.replace(/^>\s*/, "")))
      : noteNames.filter(filterPredicate(filter))
  , [noteNames, commands, filter]);

  const handleItem = useCallback((name: string) =>
    isCommandFilter(filter)
      ? onExecuteCommand(name)
      : onActivateNote(name)
  , [filter, onActivateNote, onExecuteCommand]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect(() => setActiveIndex(filteredItems.length === 1 ? 0 : -1), [filter, filteredItems]);

  useEffect(() => {
    document.body.classList.add("with-command-palette");
    return () => document.body.classList.remove("with-command-palette");
  }, []);

  return (
    <div
      id="command-palette"
      onKeyDown={(event) => {
        if (event.key === "Enter" && activeIndex !== -1) {
          const item = filteredItems[activeIndex];
          handleItem(item);
          return;
        }

        const direction = getDirection(event.key);
        if (!direction) {
          return;
        }

        event.preventDefault();
        const activeIndexCandidate = ((activeIndex + direction) % filteredItems.length);
        setActiveIndex(
          activeIndexCandidate < 0 && direction === -1
            ? filteredItems.length - 1
            : activeIndexCandidate
        );
      }}
    >
      <input
        id="command-palette-input"
        type="text"
        placeholder="Search"
        ref={inputRef}
        onBlur={() => inputRef.current?.focus()}
        onInput={(event) => setFilter(normalizeFilter((event.target as HTMLInputElement).value))}
        autocomplete="off"
      />

      {filteredItems.length > 0 && (
        <div className="command-palette-list">
          {filteredItems.map((name, index) =>
            <div
              className={clsx("command-palette-list-item", index === activeIndex && "active")}
              onClick={() => handleItem(name)}
            >{name}</div>
          )}
        </div>
      )}

      {filteredItems.length === 0 && filter && (
        <div className="command-palette-list">
          <div className="command-palette-list-item plain">
            {isCommandFilter(filter) && "(No matching commands)"}
            {!isCommandFilter(filter) && "(No matching notes)"}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandPalette;
