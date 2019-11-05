import { Editor } from "slate";
import Plain from "slate-plain-serializer";

import AutoReplacePlugin from "../";

const KeyDownInsertTextPlugin = textToInsert => ({
  onKeyDown(event, editor, next) {
    editor.insertText(textToInsert);
    return next();
  },
});

const Transform1 = (editor, lastWord) => {
  if (lastWord === "hi") {
    editor.moveFocusBackward(lastWord.length); // select last word
    editor.insertText("hello"); // replace it
  }
};

const Transform2 = (editor, lastWord) => {
  if (lastWord === "bye") {
    editor.moveFocusBackward(lastWord.length); // select last word
    editor.insertText("goodbye"); // replace it
  }
};

const Transform3 = (editor, lastWord) => {
  if (lastWord === "hello") {
    editor.insertText("!");
  }
};

const initialValue = Plain.deserialize("");
const keyEvent = key => ({ key, preventDefault: () => null });
const ctrlKeyEvent = () => ({
  key: "1",
  ctrlKey: true,
  preventDefault: () => null,
});
const cmdKeyEvent = () => ({
  key: "2",
  metaKey: true,
  preventDefault: () => null,
});

describe("AutoReplacePlugin()", () => {
  // Apply one transform (hi => hello)
  describe("when a a transform is passed to the plugin", () => {
    it("should apply it", () => {
      const value = initialValue;
      const plugins = [AutoReplacePlugin(Transform1)];
      const simulator = new Editor({ value, plugins });

      simulator.run("onKeyDown", keyEvent("h"));
      simulator.run("onKeyDown", keyEvent("i"));

      expect(simulator.value.focusText.text).toBe("hello");
    });
  });

  // Apply another transform (bye => goodbye) and check array with one element
  describe("when a single transform inside an array is passed to the plugin", () => {
    it("should apply it", () => {
      const value = initialValue;
      const plugins = [AutoReplacePlugin([Transform2])];
      const simulator = new Editor({ value, plugins });

      simulator.run("onKeyDown", keyEvent("b"));
      simulator.run("onKeyDown", keyEvent("y"));
      simulator.run("onKeyDown", keyEvent("e"));

      expect(simulator.value.focusText.text).toBe("goodbye");
    });
  });

  // Apply multiple transforms in order (hi => hello && hello => hello!)
  describe("when multiple transforms inside an array are passed to the plugin", () => {
    it("should apply them from left to right", () => {
      const value = initialValue;
      const plugins = [AutoReplacePlugin([Transform1, Transform3])];
      const simulator = new Editor({ value, plugins });

      simulator.run("onKeyDown", keyEvent("h"));
      simulator.run("onKeyDown", keyEvent("i"));

      expect(simulator.value.focusText.text).toBe("hello!");
    });
  });

  // Not related specifically to this plugin, but ensures it works as we depend on it for our `focusPreviousInlineNode` usage
  describe("when writing a non space character and the last block is an inline", () => {
    it("should append the new character to the inline", () => {
      const value = initialValue;
      const plugins = [AutoReplacePlugin()];
      let simulator = new Editor({ value, plugins });

      // Write some text
      simulator.run("onKeyDown", keyEvent("h"));
      simulator.run("onKeyDown", keyEvent("i"));

      // Insert inline
      simulator
        .moveFocusBackward(2)
        .wrapInline({ type: "whatever" })
        .moveFocusForward(2);

      // Write another character
      simulator.run("onKeyDown", keyEvent("!"));

      expect(simulator.value.inlines.get(0).text).toBe("hi!");
    });
  });

  describe("when writing a non printable character", () => {
    it("should ignore the event", () => {
      const value = initialValue;
      const fakeTransform = jest.fn();
      const plugins = [AutoReplacePlugin(fakeTransform)];
      let simulator = new Editor({ value, plugins });

      // Press enter
      simulator.run("onKeyDown", keyEvent("Enter"));

      expect(fakeTransform).toHaveBeenCalledTimes(0);
    });
  });

  describe("when writing ctrl or cmd character", () => {
    it("should ignore the event", () => {
      const value = initialValue;
      const fakeTransform = jest.fn();
      const plugins = [AutoReplacePlugin(fakeTransform)];
      let simulator = new Editor({ value, plugins });

      // Press ctrl
      simulator.run("onKeyDown", ctrlKeyEvent());

      // Press cmd
      simulator.run("onKeyDown", cmdKeyEvent());

      expect(fakeTransform).toHaveBeenCalledTimes(0);
    });
  });

  describe("when the `onKeyDown` hook is finished", () => {
    it("should propagate the event to other plugins in the stack", () => {
      const value = initialValue;
      const textToInsert = "a";
      const plugins = [
        AutoReplacePlugin(),
        KeyDownInsertTextPlugin(textToInsert),
      ];
      let simulator = new Editor({ value, plugins });

      // Write some text
      simulator.run("onKeyDown", keyEvent("h"));

      expect(simulator.value.focusText.text).toBe("h" + textToInsert);
    });
  });
});
