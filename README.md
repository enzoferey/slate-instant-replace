# slate-instant-replace
A Slate plugin to automatically replace text automatically when the user types certain strings.

### Why ?

I was looking at some plugin to automatically replace some text at the very same moment that you press the key that completes the word you want to replace. There is already a SlateJS [auto replace plugin](https://github.com/ianstormtaylor/slate-plugins/tree/master/packages/slate-auto-replace), however you need to specify a key to trigger the replacement and this key cannot be a part of the replaced text.

### How ?

This plugin applies your transformations everytime you write a new letter and has no opinion on the changes you make to the SlateJS's `change` object. It gives you the change object and the last word and the rest is up to you !

### Install

```sh
npm install --save slate-instant-replace
```

### Usage

```jsx
import InstantReplace from "slate-instant-replace";
import { Editor } from 'slate-react'

const YourFunction = (change, lastWord) => {
  ...
}

// Add the plugin to your set of plugins...
const plugins = [InstantReplace(YourFunction)];

// And later pass it into the Slate editor...
<Editor
  ...
  plugins={plugins}
/>
```

> Note: you can also apply a set of multiple replacement functions, in that case the argument needs to be an array of functions like (in which case the function will be applied in the same order you write them):

> ```jsx
> const plugins = [InstantReplace([YourFunction1, YourFunction2, YourFunction3])];
> ```

Option | Type | Description
--- | --- | ---
**`transform`** | `Function` `ArrayOf(Function)` | The transforms to apply to the `change` object each time a letter is pressed. If an array is passed, the functions will be applied from the first element of the array to the last.

### Example

Emoji auto replacement

![Gif Emoji demo](./gifs/emojis.gif "Gif Emoji demo")

```jsx
import React from "react";
import { Editor } from "slate-react";
import { Value } from "slate";

import InstantReplace from "slate-instant-replace";
import { toArray } from "react-emoji-render";

// Parses text and emojis to a string
const parseEmojis = value => {
  const emojisArray = toArray(value);
  const newValue = emojisArray.reduce((previous, current) => {
    if (typeof current === "string") return previous + current;
    return previous + current.props.children;
  }, "");
  return newValue;
};

// Transforms last word to emoji unicode
const AddEmojis = (change, lastWord) => {
  change.extend(-lastWord.length); // select last word 
  change.insertText(parseEmojis(lastWord)); // replace it
};

const plugins = [InstantReplace(AddEmojis)];

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "Write some emojis like :) or :+1: here"
              }
            ]
          }
        ]
      }
    ]
  }
});

class Slate extends React.Component {
  // Set the initial value when the app is first constructed.
  state = {
    value: initialValue
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
```

URL inline-node auto insert

![Gif URL demo](./gifs/URLs.gif "Gif URL demo")

Source can be found [here](https://github.com/enzoferey/slate-instant-replace/blob/master/src/Slate.js).