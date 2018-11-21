import {
  getSelection,
  getCurrentWordOffset,
  getLastWord,
  getPreviousNode,
  isFirstCharOfNode,
} from "./queries";
import { focusPreviousNode } from "./commands";
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
    focusPreviousNode,
  },
  onKeyDown(event, editor, next) {
    if (!isPrintableChar(event)) return next();

    // Needed to handle space & control + key actions by default
    if (!isCtrlOrCmd(event)) {
      // Focus previous node to make sure to write inside the previous Inline
      if (!isSpace(event)) focusPreviousNode(editor);

      // Insert the text manually
      editor.insertText(event.key);

      // Apply transforms
      if (Array.isArray(transforms)) {
        transforms.forEach(transform => {
          const lastWord = getLastWord(editor);
          transform(editor, lastWord);
        });
      } else if (transforms) {
        const lastWord = getLastWord(editor);
        transforms(editor, lastWord);
      }

      // Prevent insertion of the char
      event.preventDefault();
    }
  },
});

export default InstantReplace;
