import { Inline } from "slate";

const isLetter = event => event.key.length === 1;

const isCtrlOrCmd = event => event.ctrlKey || event.metaKey;

const isSpace = event => event.key === " ";

const getSelection = change => change.value.fragment.text;

const getLastWord = (change, maxIndex, counter = 0) => {
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

	return getLastWord(change, maxIndex, counter + 1);
};

const getPreviousNode = change => {
	const block = change.value.focusBlock;
	const activeKey = change.value.selection.focusKey;
	return block.getPreviousSibling(activeKey);
};

const focusPreviousNode = change => {
	const offsetCurrentWord = change.value.focusOffset;
	// check if we just started a the node
	if (offsetCurrentWord === 0) {
		const previousNode = getPreviousNode(change);
		if (previousNode && Inline.isInline(previousNode)) {
			change.extendToEndOf(previousNode).focus();
		}
	}
};

const InstantReplace = transforms => ({
	onKeyDown(event, change) {
		if (!isLetter(event)) return;

		// needed to handle space & control + key actions by default
		if (!isCtrlOrCmd(event)) {
			if (!isSpace(event)) focusPreviousNode(change);
			change.insertText(event.key);

			// Get last word
			const offsetCurrentWord = change.value.focusOffset;
			const lastWord = getLastWord(change, offsetCurrentWord);

			// Apply transforms
			if (Array.isArray(transforms))
				transforms.forEach(transform => transform(change, lastWord));
			else transforms(change, lastWord);

			event.preventDefault();
		}
	}
});

export default InstantReplace;
