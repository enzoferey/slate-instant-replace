import React from "react";
import { Editor } from "slate-react";
import { Value } from "slate";

import InstantReplace from "./instant-replace-plugin";

import { toArray } from "react-emoji-render";
import isUrl from "is-url";

const parseEmojis = value => {
	const emojisArray = toArray(value);
	const newValue = emojisArray.reduce((previous, current) => {
		if (typeof current === "string") return previous + current;
		return previous + current.props.children;
	}, "");
	return newValue;
};

const AddEmojis = (change, lastWord) => {
	change.extend(-lastWord.length); // select last word and replace it
	change.insertText(parseEmojis(lastWord));
};

const AddURL = (change, lastWord) => {
	if (isUrl(lastWord)) {
		change.extend(-lastWord.length); // select last word
		change.unwrapInline("link"); // remove existing urls
		const href = lastWord.startsWith("http") ? lastWord : `https://${lastWord}`;
		change.wrapInline({ type: "link", data: { href } }); // set URL inline
		change.extend(lastWord.length); // deselect it
	}
};

const plugins = [InstantReplace([AddEmojis, AddURL])];

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
								text: "Habak"
							}
						]
					}
				]
			}
		]
	}
});

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
				renderNode={Node}
			/>
		);
	}
}

export default Slate;
