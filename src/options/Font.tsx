import { h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";
import clsx from "clsx";
import { RegularFont, GoogleFont } from "shared/storage/schema";
import { FontFamily, fontFamilies, ideizeFont, getGoogleFontHref } from "options/helpers/fonts";

interface FontProps {
  font?: RegularFont | GoogleFont
}

const Font = ({ font }: FontProps): h.JSX.Element => {
  const [fontFamily, setFontFamily] = useState<FontFamily | undefined>(undefined);

  const [googleFontName, setGoogleFontName] = useState<string>("");
  const [googleSubmitButtonText, setGoogleSubmitButtonText] = useState<string>("Apply");

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
      <h2>Font</h2>
      <p>Current font: <span id="current-font-name">{font?.name}</span></p>

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
                The quick brown fox jumps over the lazy dog (<span>{commonFontName}</span>)
              </label>
            </div>
          )}
        </div>
      )}

      {/* Google Fonts */}
      {fontFamily && !fontFamily.fonts && (
        <div class="font-area" id="google-fonts-area">
          <ol>
            <li>Open <a href="https://fonts.google.com" target="_blank">https://fonts.google.com</a> to see the available fonts</li>
            <li>Type in the Font Name, e.g.: <b>Roboto Mono</b></li>
            <li>Click <b>Apply</b> to use the font</li>
          </ol>
          <input
            type="text"
            placeholder="Font Name (E.g. Roboto Mono)"
            value={googleFontName}
            onInput={(event) => {
              setGoogleFontName((event.target as HTMLInputElement).value);
              setGoogleSubmitButtonText("Apply");
            }}
          />
          <input
            type="submit"
            id="submit"
            class={clsx("bold", (googleFontName !== font?.name) && "active")}
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
                setGoogleSubmitButtonText("Applied");
              }).catch(() => {
                setGoogleSubmitButtonText("Font Name Doesn't Exist");
              });
            }}
          />
        </div>
      )}
    </Fragment>
  );
};

export default Font;
