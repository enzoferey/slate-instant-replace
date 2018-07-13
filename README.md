# slate-instant-replace
A Slate plugin to automatically replace text automatically when the user types certain strings.

#### Why ?

I was looking at some plugin to automatically replace some text at the very same moment that you press the key that completes the word you want to replace. There is already a SlateJS [auto replace plugin](https://github.com/ianstormtaylor/slate-plugins/tree/master/packages/slate-auto-replace), however you need to specify a key to trigger the replacement and this key cannot be a part of the replaced text.

#### How ?

This plugin applies your transformations everytime you write a new letter and has no opinion on the changes you make to the SlateJS's `change` object. It gives you the change object and the last word and the rest is up to you !

## Install

```sh
npm install --save slate-instant-replace
```

## Usage

```jsx
import InstantReplace from "slate-instant-replace";
import { Editor } from "slate-react";

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

#### Multiple transforms

You can also apply a set of multiple replacement functions, in that case the argument needs to be an array of functions like (in which case the function will be applied in the same order you write them):

```jsx
const plugins = [InstantReplace([YourFunction1, YourFunction2, YourFunction3])];
```

## Options

Option | Type | Description
--- | --- | ---
**`transform`** | `Function` `ArrayOf(Function)` | The transforms to apply to the `change` object each time a letter is pressed. If an array is passed, the functions will be applied from the first element of the array to the last.

## Examples

- Emoji auto replacement

![Gif Emoji demo](./examples/emojis-example/demo.gif "Gif Emoji demo")

[Check source code](https://github.com/enzoferey/slate-instant-replace/blob/master/examples/emojis-example/src/Slate.js).

- URL inline-node auto insert

![Gif URL demo](./examples/urls-example/demo.gif "Gif URL demo")

[Check source code](https://github.com/enzoferey/slate-instant-replace/blob/master/examples/urls-example/src/Slate.js).

- Multiples transforms (hello => hi + emoji auto replacement)

![Gif multiple transforms demo](./examples/multiple-transforms-example/demo.gif "Gif multiple transforms demo")

[Check source code](https://github.com/enzoferey/slate-instant-replace/blob/master/examples/multiple-transforms-example/src/Slate.js).
