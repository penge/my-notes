import { h } from "preact";
import {
  useRef, useState, useMemo, useCallback, useEffect,
} from "preact/hooks";
import clsx from "clsx";
import useBodyClass from "notes/hooks/use-body-class";
import { SidebarNote } from "notes/adapters";
import { t, tString } from "i18n";

export interface CommandPaletteProps {
  notes: SidebarNote[]
  commands: { name: string, translation: h.JSX.Element }[]
  onActivateNote: (noteName: string) => void
  onExecuteCommand: (commandName: string) => void
}

export enum FilterType {
  CommandsByName,
  NotesByContent,
  NotesByName,
}

export interface Filter {
  type: FilterType
  input: string
}

/**
 * Returns filter to be used based on the input.
 *
 * We can filter:
 * A) CommandsByName
 * => filter commands by name, when input starts with ">" (whitespace before and after ">" is allowed, whitespace at the end is allowed)
 *
 * B) NotesByContent
 * => filter notes by the content, when input starts with "?" (whitespace before and after "?" is allowed, whitespace at the end is allowed)
 *
 * C) NotesByName
 * => filter notes by their name, when input does NOT start with [">", "?"] (whitespace before is allowed, whitespace at the end is allowed)
 */
export const prepareFilter = (rawInput: string): Filter => {
  const input = rawInput.trim().toLowerCase().replace(/^([>?])\s*(.*)/, "$1$2"); // trim whitespace, remove whitespace after [">", "?"]

  // A) CommandsByName
  if (input.startsWith(">")) {
    return {
      type: FilterType.CommandsByName,
      input: input.slice(1),
    };
  }

  // B) NotesByContent
  if (input.startsWith("?")) {
    return {
      type: FilterType.NotesByContent,
      input: input.slice(1),
    };
  }

  // C) NotesByName
  return {
    type: FilterType.NotesByName,
    input,
  };
};

export const prepareItems = (notes: SidebarNote[], commands: string[], filter: Filter | undefined): string[] => {
  const noteNames = notes.map((note) => note.name);

  if (!filter) {
    return noteNames;
  }

  const input = filter.input.trim();
  const prepareFilterPredicate = (givenInput: string) => (item: string) => (givenInput ? item.toLowerCase().includes(givenInput) : item);

  // A) CommandsByName
  if (filter.type === FilterType.CommandsByName) {
    return commands.filter(prepareFilterPredicate(input));
  }

  // B) NotesByContent
  if (filter.type === FilterType.NotesByContent) {
    const filterPredicate = prepareFilterPredicate(input);
    return input
      ? noteNames.filter((noteName) => {
        const foundNote = notes.find((note) => note.name === noteName);
        return foundNote && filterPredicate(foundNote.content);
      })
      : noteNames;
  }

  // C) NotesByName
  return noteNames.filter(prepareFilterPredicate(input));
};

const CommandPalette = ({
  notes, commands, onActivateNote, onExecuteCommand,
}: CommandPaletteProps): h.JSX.Element => {
  useBodyClass("with-command-palette");

  const inputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<Filter | undefined>(undefined);

  // Items to show in Command Palette
  const items: string[] = useMemo(() => prepareItems(notes, commands.map((command) => command.name), filter), [notes, commands, filter]);

  // Selected item; can be changed with Up / Down arrow keys
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);

  // What to do on Enter
  const handleItem = useCallback((name: string) => {
    if (filter?.type === FilterType.CommandsByName) {
      onExecuteCommand(name);
      return;
    }

    onActivateNote(name);
  }, [filter, onActivateNote, onExecuteCommand]);

  // auto-focus the input when Command Palette is open
  useEffect(() => inputRef.current?.focus(), [inputRef]);

  // reset selected item when props change; auto-select it when there's just one
  useEffect(() => setSelectedItemIndex(items.length === 1 ? 0 : -1), [filter, items]);

  return (
    <div
      id="command-palette"
      onKeyDown={(event) => {
        if (event.key === "Enter" && selectedItemIndex !== -1) {
          const item = items[selectedItemIndex];
          handleItem(item);
          return;
        }

        const direction = { ArrowUp: -1, ArrowDown: 1 }[event.key];
        if (!direction) {
          return;
        }

        event.preventDefault();
        const activeIndexCandidate = ((selectedItemIndex + direction) % items.length);
        setSelectedItemIndex(
          activeIndexCandidate < 0 && direction === -1
            ? items.length - 1
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
          const newFilter = prepareFilter((event.target as HTMLInputElement).value);
          setFilter(newFilter);
        }}
        autoComplete="off"
      />

      {items.length > 0 && (
        <div className="command-palette-list">
          {items.map((name, index) => (
            <div
              className={clsx("command-palette-list-item", index === selectedItemIndex && "active")}
              onClick={() => handleItem(name)}
              onMouseEnter={() => setSelectedItemIndex(index)}
            >
              {(filter?.type === FilterType.CommandsByName)
                ? commands.find((command) => command.name === name)?.translation
                : name}
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && filter && (
        <div className="command-palette-list">
          <div className="command-palette-list-item plain">
            {filter.type === FilterType.CommandsByName && t("(No matching commands)")}
            {filter.type === FilterType.NotesByContent && t("(No matching notes)")}
            {filter.type === FilterType.NotesByName && t("(No matching notes)")}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandPalette;
