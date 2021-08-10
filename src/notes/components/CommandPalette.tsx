import { h } from "preact";
import { useRef, useState, useMemo, useCallback, useEffect } from "preact/hooks";
import { NotesObject } from "shared/storage/schema";
import clsx from "clsx";

export interface CommandPaletteProps {
  notes: NotesObject
  commands: string[]
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
 * We can filter:
 * A) CommandsByName => filter commands by name, when input starts with ">" (whitespace before and after ">" is allowed, whitespace at the end is allowed)
 * B) NotesByContent => filter notes by the content, when input starts with "?" (whitespace before and after "?" is allowed, whitespace at the end is allowed)
 * C) NotesByName => filter notes by their name, when input does NOT start with [">", "?"] (whitespace before is allowed, whitespace at the end is allowed)
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

export const prepareItems = (notes: NotesObject, commands: string[], filter: Filter | undefined): string[] => {
  if (!filter) {
    return Object.keys(notes); // by default, list notes
  }

  const input = filter.input.trim();
  const prepareFilterPredicate = (input: string) => (item: string) => input ? item.toLowerCase().includes(input) : item;

  // A) CommandsByName
  if (filter.type === FilterType.CommandsByName) {
    return commands.filter(prepareFilterPredicate(input)); // commands that include the input in their name
  }

  // B) NotesByContent
  if (filter.type === FilterType.NotesByContent) {
    return input ? Object.keys(notes).filter((noteName) => prepareFilterPredicate(input)(notes[noteName].content)) : Object.keys(notes); // notes that include the input in their content
  }

  // C) NotesByName
  return Object.keys(notes).filter(prepareFilterPredicate(input)); // notes that include the input in their name
};

const CommandPalette = ({ notes, commands, onActivateNote, onExecuteCommand }: CommandPaletteProps): h.JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<Filter | undefined>(undefined);

  // Items to show in Command Palette
  const items: string[] = useMemo(() => prepareItems(notes, commands, filter), [notes, commands, filter]);

  // Selected item; can be changed with Up / Down arrow keys
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);

  // What to do on Enter
  const handleItem = useCallback((name: string) => {
    if (filter?.type === FilterType.CommandsByName) {
      onExecuteCommand(name);
      return;
    }

    onActivateNote(name);
    return;
  }, [filter, onActivateNote, onExecuteCommand]);

  useEffect(() => {
    document.body.classList.add("with-command-palette");
    return () => document.body.classList.remove("with-command-palette");
  }, []);

  useEffect(() => inputRef.current?.focus(), [inputRef]); // auto-focus the input when Command Palette is open

  useEffect(() => setSelectedItemIndex(items.length === 1 ? 0 : -1), [filter, items]); // reset selected item when props change; auto-select it when there's just one

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
        onInput={(event) => {
          const newFilter = prepareFilter((event.target as HTMLInputElement).value);
          setFilter(newFilter);
        }}
        autocomplete="off"
      />

      {items.length > 0 && (
        <div className="command-palette-list">
          {items.map((name, index) =>
            <div
              className={clsx("command-palette-list-item", index === selectedItemIndex && "active")}
              onClick={() => handleItem(name)}
            >{name}</div>
          )}
        </div>
      )}

      {items.length === 0 && filter && (
        <div className="command-palette-list">
          <div className="command-palette-list-item plain">
            {filter.type === FilterType.CommandsByName && "(No matching commands)"}
            {filter.type === FilterType.NotesByContent && "(No matching notes)"}
            {filter.type === FilterType.NotesByName && "(No matching notes)"}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandPalette;
