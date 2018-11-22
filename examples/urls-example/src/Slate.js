import React from "react";
import { Editor } from "slate-react";
import Plain from "slate-plain-serializer";

import InstantReplace from "slate-instant-replace";

import isUrl from "is-url";

// Transformation function
const AddURL = (editor, lastWord) => {
  if (isUrl(lastWord)) {
    editor.moveFocusBackward(lastWord.length); // select last word
    editor.unwrapInline("link"); // remove existing urls
    const href = lastWord.startsWith("http") ? lastWord : `https://${lastWord}`;
    editor.wrapInline({ type: "link", data: { href } }); // set URL inline
    editor.moveFocusForward(lastWord.length); // deselect it
  }
};

// Initialise the plugin
const plugins = [InstantReplace(AddURL)];

const initialValue = Plain.deserialize("Habak");

class Slate extends React.Component {
  // Set the initial value when the app is first constructed.
  state = {
    value: initialValue,
  };

  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    this.setState({ value });
  };

  // Render the editor.
  render() {
    return (
      <Editor
        value={this.state.value}
        onChange={this.onChange}
        plugins={plugins}
        renderNode={Node}
      />
    );
  }
}

// Render slate node
const Node = ({ attributes, children, node }) => {
  switch (node.type) {
    case "link": {
      const { data } = node;
      const href = data.get("href");
      return (
        <a href={href} {...attributes}>
          {children}
        </a>
      );
    }
    default:
      return null;
  }
};

export default Slate;
