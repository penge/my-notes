import { h } from "preact";

export default (e: h.JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};
