import { h } from "preact";

export const preventEnter = (e: h.JSX.TargetedKeyboardEvent<HTMLInputElement>) => { e.key === "Enter" && e.preventDefault(); };
