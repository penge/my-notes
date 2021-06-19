import { h, Fragment } from "preact";

interface SizeProps {
  size?: number
}

const Size = ({ size }: SizeProps): h.JSX.Element => (
  <Fragment>
    <h2>Size <span id="current-size">{size}</span></h2>
    <input type="range" min="100" max="600" step="10" class="slider" value={size}
      onInput={(event) => {
        const newSize = parseInt((event.target as HTMLInputElement).value);
        chrome.storage.local.set({ size: newSize });
      }}
    />
  </Fragment>
);

export default Size;
