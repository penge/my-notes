import { h, Fragment } from "preact";
import { t } from "i18n";
import { minSize, maxSize } from "shared/storage/validations";

interface SizeProps {
  size?: number
}

const Size = ({ size }: SizeProps): h.JSX.Element => (
  <Fragment>
    <h2>
      {t("Size")}
      {" "}
      <span id="current-size">{size}</span>
    </h2>
    <input
      type="range"
      min={minSize}
      max={maxSize}
      step="10"
      className="slider"
      value={size}
      onInput={(event) => {
        const newSize = parseInt((event.target as HTMLInputElement).value, 10);
        chrome.storage.local.set({ size: newSize });
      }}
    />
  </Fragment>
);

export default Size;
