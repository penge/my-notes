import { Fragment, h, render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { t, tString } from "i18n";

const placeholder = `:root {

}`;

const CustomTheme = (): h.JSX.Element => {
  const [initialCustomTheme, setInitialCustomTheme] = useState<string>();
  const [customTheme, setCustomTheme] = useState<string>();

  const canSave = customTheme !== initialCustomTheme;
  const [saveButtonText, setSaveButtonText] = useState<string>(tString("Save"));

  useEffect(() => {
    chrome.storage.local.get(["customTheme"], (local) => {
      setInitialCustomTheme(local.customTheme || "");
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes.customTheme) {
        setInitialCustomTheme(changes.customTheme.newValue || "");
      }
    });
  }, []);

  useEffect(() => {
    setCustomTheme(initialCustomTheme);
  }, [initialCustomTheme]);

  useEffect(() => {
    setSaveButtonText(tString("Save"));
  }, [customTheme]);

  return (
    <Fragment>
      <p>
        <strong>{tString("Custom theme")}</strong>
        <div id="hint">
          {t("Custom theme hint", {
            light: "<a href=\"../light.css\" target=\"_blank\">light.css</a>",
            dark: "<a href=\"../dark.css\" target=\"_blank\">dark.css</a>",
          })}
        </div>
      </p>

      <textarea
        id="textarea"
        spellCheck={false}
        placeholder={(typeof customTheme === "string" && !customTheme.length) ? placeholder : undefined}
        value={customTheme}
        onInput={(event) => setCustomTheme((event.target as HTMLTextAreaElement).value)}
        autoFocus
      />

      <button
        type="button"
        id="save"
        className={canSave ? "" : "disabled"}
        onClick={canSave ? () => {
          chrome.storage.local.set({ customTheme });
          setSaveButtonText(tString("Saved!"));
        } : undefined}
      >
        {saveButtonText}
      </button>
    </Fragment>
  );
};

render(<CustomTheme />, document.body);
