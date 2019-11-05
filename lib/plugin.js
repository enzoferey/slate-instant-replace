import {
  getSelection,
  getCurrentWordOffset,
  getLastWord,
  getPreviousNode,
  isFirstCharOfNode,
} from "./queries";
import { focusPreviousInlineNode } from "./commands";
import { isPrintableChar, isCtrlOrCmd, isSpace } from "./keyHelpers";

const InstantReplace = transforms => ({
  queries: {
    getSelection,
    getCurrentWordOffset,
    getLastWord,
    getPreviousNode,
    isFirstCharOfNode,
  },
  commands: {
    focusPreviousInlineNode,
  },
  onKeyDown(event, editor, next) {
    // NOTE:
    // > Calling `next()` allows subsequent plugins in the stack to use the `onKeyDown` event

    // We don't care about not printable characters
    if (!isPrintableChar(event)) {
      return next();
    }

    // Needed to handle space & control + key actions by default
    if (isCtrlOrCmd(event)) {
      return next();
    }

    // 1. Focus previous node to make sure to write inside the previous `Inline` if any
    if (!isSpace(event)) {
      focusPreviousInlineNode(editor);
    }

    // 2. Insert the text manually
    editor.insertText(event.key);

    // 3. Apply transforms
    if (Array.isArray(transforms)) {
      transforms.forEach(transform => {
        const lastWord = getLastWord(editor);
        transform(editor, lastWord);
      });
    } else if (transforms) {
      const lastWord = getLastWord(editor);
      transforms(editor, lastWord);
    }

    // 4. Prevent insertion of the char
    event.preventDefault();

    // 5. Allow subsequent plugins to use the event as well
    return next();
  },
});

export default InstantReplace;
