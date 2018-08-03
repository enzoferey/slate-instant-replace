import React from "react";
import { Editor } from "slate-react";
import Plain from "slate-plain-serializer";

import InstantReplace from "./lib";

import isUrl from "is-url";

// Transformation function
const AddURL = (change, lastWord) => {
  if (isUrl(lastWord)) {
    change.extend(-lastWord.length); // select last word
    change.unwrapInline("link"); // remove existing urls
    const href = lastWord.startsWith("http") ? lastWord : `https://${lastWord}`;
    change.wrapInline({ type: "link", data: { href } }); // set URL inline
    change.extend(lastWord.length); // deselect it
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
