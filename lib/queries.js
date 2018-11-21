export const getSelection = editor => editor.value.fragment.text;

export const getCurrentWordOffset = editor =>
  editor.value.selection.focus.offset;

export const isFirstCharOfNode = editor => getCurrentWordOffset(editor) === 0;

export const getPreviousNode = editor => {
  const block = editor.value.focusBlock;
  const focusKey = editor.value.selection.focus.key;
  return block.getPreviousSibling(focusKey);
};

export const getLastWord = editor => {
  const currentWordOffset = getCurrentWordOffset(editor);
  return getLastWordRec(editor, currentWordOffset);
};

const getLastWordRec = (editor, maxIndex, counter = 0) => {
  // If first char of the input is found just select everything (single word)
  if (counter === maxIndex) {
    const selectedWord = getSelection(editor);
    editor.moveFocusForward(counter);
    return selectedWord;
  }

  // Move selection
  const selectedWord = getSelection(editor.moveFocusBackward(1));

  // If we find a space it means previous chars are the last word !
  if (selectedWord[0] === " ") {
    editor.moveFocusForward(counter + 1); // one more needed because space
    return selectedWord.substring(1);
  }

  return getLastWordRec(editor, maxIndex, counter + 1);
};
