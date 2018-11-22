import React from "react";
import { Editor } from "slate-react";
import Plain from "slate-plain-serializer";

import InstantReplace from "slate-instant-replace";

import { toArray } from "react-emoji-render";

// Check out react-emoji-render, pretty cool library !
const parseEmojis = value => {
  const emojisArray = toArray(value);
  const newValue = emojisArray.reduce((previous, current) => {
    if (typeof current === "string") return previous + current;
    return previous + current.props.children;
  }, "");
  return newValue;
};

// Transformation function
const AddEmojis = (editor, lastWord) => {
  editor.moveFocusBackward(lastWord.length); // select last word
  editor.insertText(parseEmojis(lastWord)); // replace it
};

// Initialise the plugin
const plugins = [InstantReplace(AddEmojis)];

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
      />
    );
  }
}

export default Slate;
