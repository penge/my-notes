import { h, Fragment } from "preact";
import { t, tString } from "i18n";

interface VersionProps {
  version: string
}

const Version = ({ version }: VersionProps): h.JSX.Element => (
  <Fragment>
    <h2>{t("Version")}</h2>
    <div>
      <strong id="version">{version}</strong>
      <a href="https://github.com/penge/my-notes/releases" target="_blank" class="space-left">{t("Changelog")}</a>
      <a href="https://github.com/penge/my-notes" target="_blank" class="space-left">{t("Homepage")}</a>
      <br />
      <br />
      <span>{tString("Created by")} <a href="https://github.com/penge" target="_blank">Pavel Bucka</a></span>
      {" "}
      (<a href="https://www.buymeacoffee.com/penge" target="_blank">{t("Buy me a coffee")}</a>)
    </div>
  </Fragment>
);

export default Version;
