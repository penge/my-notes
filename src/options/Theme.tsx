import { h, Fragment } from "preact";
import { Theme } from "shared/storage/schema";
import { capitalize } from "shared/string/capitalize-string";

const THEMES = ["light", "dark", "custom"] as Theme[];

interface ThemeProps {
  theme?: Theme
}

const Theme = ({ theme }: ThemeProps): h.JSX.Element => (
  <Fragment>
    <h2>Theme</h2>
    {THEMES.map((aTheme) =>
      <div class="selection">
        <input
          type="radio"
          id={aTheme}
          name="theme"
          checked={aTheme === theme}
          onClick={() => {
            chrome.storage.local.set({ theme: aTheme });
          }}
        />&nbsp;

        <label
          for={aTheme}
          id={`${aTheme}-theme-label`}
          class="bold theme-label"
        >
          {capitalize(aTheme)}
        </label>

        {aTheme === "custom" && (
          <a href="themes/custom/index.html" target="_blank" class="space-left">Customize</a>
        )}
      </div>
    )}
  </Fragment>
);

export default Theme;
