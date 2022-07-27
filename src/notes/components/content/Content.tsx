/* eslint-disable react/jsx-props-no-spreading */
import { h } from "preact";
import { ContentProps } from "./common";
import ContentHtml from "./ContentHtml";
import ContentText from "./ContentText";

const Content = (props: ContentProps): h.JSX.Element => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.note.raw) {
    return <ContentText {...props} />;
  }

  return <ContentHtml {...props} />;
};

export default Content;
