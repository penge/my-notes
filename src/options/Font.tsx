import { h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";
import clsx from "clsx";
import { RegularFont, GoogleFont } from "shared/storage/schema";
import { FontFamily, fontFamilies, ideizeFont, getGoogleFontHref } from "options/helpers/fonts";
import { t, tString } from "i18n";

interface FontProps {
  font?: RegularFont | GoogleFont
}

const Font = ({ font }: FontProps): h.JSX.Element => {
  const [fontFamily, setFontFamily] = useState<FontFamily | undefined>(undefined);

  const [googleFontName, setGoogleFontName] = useState<string>("");
  const [googleSubmitButtonText, setGoogleSubmitButtonText] = useState<string>(tString("Apply"));

  useEffect(() => {
    if (!font) {
      return;
    }

    setFontFamily(
      fontFamilies.find((family) => family.id === (font as RegularFont).genericFamily) ||
      fontFamilies.find((family) => family.id === "google-fonts"));

    setGoogleFontName((font && (font as GoogleFont).href) ? (font as GoogleFont).name : "");
  }, [font]);

  return (
    <Fragment>
      <h2>{t("Font")}</h2>
      <p>
        <span>{t("Current font:")}{" "}</span>
        <span id="current-font-name">{font?.name}</span>
      </p>

      {/* Title containing font family names (current underlined) */}
      <h3>
        {fontFamilies.map((family, index) =>
          <Fragment>
            <span
              class={clsx("font-category", family.id === fontFamily?.id && "active")}
              onClick={() =>
                setFontFamily(fontFamilies.find((item) => item.id === family.id))
              }>{family.name}</span>
            {index < fontFamilies.length - 1 && <span class="separator">/</span>}
          </Fragment>
        )}
      </h3>

      {/* Radio buttons for the current font family (except Google Fonts) */}
      {fontFamily && fontFamily.fonts && (
        <div class="font-area">
          {fontFamily.fonts?.map((commonFontName) =>
            <div class="selection">
              <input
                type="radio"
                name="font"
                id={ideizeFont(commonFontName)}
                checked={ideizeFont(commonFontName) === font?.id}
                onClick={() => {
                  const regularFont: RegularFont = {
                    id: ideizeFont(commonFontName),
                    name: commonFontName,
                    genericFamily: fontFamily.id,
                    fontFamily: `${commonFontName}, ${fontFamily.name}`,
                  };

                  chrome.storage.local.set({ font: regularFont });
                }}
              />
              <label
                for={ideizeFont(commonFontName)}
                style={`font-family: ${commonFontName}, ${fontFamily.id};`}
              >
                {t("Font example", { font: commonFontName })}
              </label>
            </div>
          )}
        </div>
      )}

      {/* Google Fonts */}
      {fontFamily && !fontFamily.fonts && (
        <div class="font-area" id="google-fonts-area">
          <ol>
            <li>{t("Google Fonts.step1", { website: "https://fonts.google.com" })}</li>
            <li>{t("Google Fonts.step2")}</li>
            <li>{t("Google Fonts.step3")}</li>
          </ol>
          <input
            type="text"
            placeholder={tString("Google Fonts.placeholder")}
            class="input"
            value={googleFontName}
            onInput={(event) => {
              setGoogleFontName((event.target as HTMLInputElement).value);
              setGoogleSubmitButtonText(tString("Apply"));
            }}
          />
          <input
            type="submit"
            class={clsx("bold", "button", (googleFontName === font?.name) && "disabled")}
            value={googleSubmitButtonText}
            onClick={() => {
              const trimmedGoogleFontName = googleFontName.trim();
              if (!trimmedGoogleFontName || (trimmedGoogleFontName === font?.name)) {
                return;
              }

              const googleFont: GoogleFont = {
                id: ideizeFont(trimmedGoogleFontName),
                name: trimmedGoogleFontName,
                fontFamily: trimmedGoogleFontName,
                href: getGoogleFontHref(trimmedGoogleFontName),
              };

              fetch(googleFont.href, { method: "HEAD" }).then(() => {
                chrome.storage.local.set({ font: googleFont });
                setGoogleFontName(trimmedGoogleFontName);
                setGoogleSubmitButtonText(tString("Applied"));
              }).catch(() => {
                setGoogleSubmitButtonText(tString("Font Name Doesn't Exist"));
              });
            }}
          />
        </div>
      )}
    </Fragment>
  );
};

export default Font;
