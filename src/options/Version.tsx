import { h, Fragment } from "preact";

interface VersionProps {
  version: string
}

const Version = ({ version }: VersionProps): h.JSX.Element => (
  <Fragment>
    <h2>Version</h2>
    <div>
      <strong id="version" class="space-right">{version}</strong>
      <a href="https://github.com/penge/my-notes/releases" target="_blank" class="space-left">Changelog</a>
      <a href="https://github.com/penge/my-notes" target="_blank" class="space-left">Homepage</a>
      <br />
      <br />
      <span>Created by <a href={`mailto:${process.env.MY_NOTES_AUTHOR_EMAIL}`}>Pavel Bucka</a></span>
      &nbsp;
      (<a href="https://www.buymeacoffee.com/penge" target="_blank">Buy me a coffee</a>)
    </div>
  </Fragment>
);

export default Version;
