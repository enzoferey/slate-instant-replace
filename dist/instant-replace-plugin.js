"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slate = require("slate");

var isLetter = function isLetter(event) {
	return event.key.length === 1;
};

var isCtrlOrCmd = function isCtrlOrCmd(event) {
	return event.ctrlKey || event.metaKey;
};

var isSpace = function isSpace(event) {
	return event.key === " ";
};

var getSelection = function getSelection(change) {
	return change.value.fragment.text;
};

var getLastWord = function getLastWord(change, maxIndex) {
	var counter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	// If first char of the input is found just select everything (single word)
	if (counter === maxIndex) {
		var _selectedWord = getSelection(change);
		change.extend(counter);
		return _selectedWord;
	}

	// Move selection
	var selectedWord = getSelection(change.extend(-1));

	// Exit condition
	if (selectedWord[0] === " ") {
		change.extend(counter + 1); // one more needed because space
		return selectedWord.substring(1);
	}

	return getLastWord(change, maxIndex, counter + 1);
};

var getPreviousNode = function getPreviousNode(change) {
	var block = change.value.focusBlock;
	var activeKey = change.value.selection.focusKey;
	return block.getPreviousSibling(activeKey);
};

var focusPreviousNode = function focusPreviousNode(change) {
	var offsetCurrentWord = change.value.focusOffset;
	// check if we just started a the node
	if (offsetCurrentWord === 0) {
		var previousNode = getPreviousNode(change);
		if (previousNode && _slate.Inline.isInline(previousNode)) {
			change.extendToEndOf(previousNode).focus();
		}
	}
};

var InstantReplace = function InstantReplace(transforms) {
	return {
		onKeyDown: function onKeyDown(event, change) {
			if (!isLetter(event)) return;

			// needed to handle space & control + key actions by default
			if (!isCtrlOrCmd(event)) {
				if (!isSpace(event)) focusPreviousNode(change);
				change.insertText(event.key);

				// Get last word
				var offsetCurrentWord = change.value.focusOffset;
				var lastWord = getLastWord(change, offsetCurrentWord);

				// Apply transforms
				if (Array.isArray(transforms)) transforms.forEach(function (transform) {
					return transform(change, lastWord);
				});else transforms(change, lastWord);

				event.preventDefault();
			}
		}
	};
};

exports.default = InstantReplace;
