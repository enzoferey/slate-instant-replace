import { Inline } from "slate";

export const isPrintableChar = event => event.key.length === 1;

export const isCtrlOrCmd = event => event.ctrlKey || event.metaKey;

const isSpace = event => event.key === " ";

const getSelection = change => change.value.fragment.text;

const getLastWordRec = (change, maxIndex, counter = 0) => {
  // If first char of the input is found just select everything (single word)
  if (counter === maxIndex) {
    const selectedWord = getSelection(change);
    change.extend(counter);
    return selectedWord;
  }

  // Move selection
  const selectedWord = getSelection(change.extend(-1));

  // Exit condition
  if (selectedWord[0] === " ") {
    change.extend(counter + 1); // one more needed because space
    return selectedWord.substring(1);
  }

  return getLastWordRec(change, maxIndex, counter + 1);
};

export const getLastWord = change => {
  const offsetCurrentWord = change.value.focusOffset;
  return getLastWordRec(change, offsetCurrentWord);
};

const getPreviousNode = change => {
  const block = change.value.focusBlock;
  const activeKey = change.value.selection.focusKey;
  return block.getPreviousSibling(activeKey);
};

export const focusPreviousNode = change => {
  const offsetCurrentWord = change.value.focusOffset;
  // check if we just started a the node
  if (offsetCurrentWord === 0) {
    const previousNode = getPreviousNode(change);
    if (previousNode && Inline.isInline(previousNode)) {
      change.moveToRangeOf(previousNode);
      change.collapseToEnd();
    }
  }
};

const InstantReplace = transforms => ({
  onKeyDown(event, change) {
    if (!isPrintableChar(event)) return;

    // needed to handle space & control + key actions by default
    if (!isCtrlOrCmd(event)) {
      if (!isSpace(event)) focusPreviousNode(change);
      change.insertText(event.key);

      // Apply transforms
      if (Array.isArray(transforms)) {
        transforms.forEach(transform => {
          const lastWord = getLastWord(change);
          transform(change, lastWord);
        });
      } else if (transforms) {
        const lastWord = getLastWord(change);
        transforms(change, lastWord);
      }

      // Prevent insertion of the char
      event.preventDefault();
    }
  },
});

export default InstantReplace;
