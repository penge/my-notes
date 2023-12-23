import { h, Fragment } from "preact";
import { Theme as OneTheme } from "shared/storage/schema";
import { t } from "i18n";

const THEMES = ["light", "dark", "custom"] as OneTheme[];

interface ThemeProps {
  theme?: OneTheme
}

const Theme = ({ theme }: ThemeProps): h.JSX.Element => (
  <Fragment>
    <h2>Theme</h2>
    {THEMES.map((aTheme) => (
      <div className="selection">
        <input
          type="radio"
          id={aTheme}
          name="theme"
          checked={aTheme === theme}
          onClick={() => {
            chrome.storage.local.set({ theme: aTheme });
          }}
        />
        {" "}

        <label
          htmlFor={aTheme}
          id={`${aTheme}-theme-label`}
          className="bold theme-label"
        >
          {t(`Themes.${aTheme}`)}
        </label>

        {aTheme === "custom" && (
          <a href="themes/custom/index.html" target="_blank" className="space-left">{t("Customize")}</a>
        )}
      </div>
    ))}
  </Fragment>
);

export default Theme;
