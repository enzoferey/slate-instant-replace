import Simulator from "slate-simulator";
import Plain from "slate-plain-serializer";
import { Character, Text, Inline } from "slate";
import Immutable from "immutable";
import AutoReplacePlugin from "../lib";

const Transform1 = (change, lastWord) => {
  if (lastWord === "hi") {
    change.extend(-lastWord.length); // select last word
    change.insertText("hello"); // replace it
  }
};

const Transform2 = (change, lastWord) => {
  if (lastWord === "bye") {
    change.extend(-lastWord.length); // select last word
    change.insertText("goodbye"); // replace it
  }
};

const Transform3 = (change, lastWord) => {
  if (lastWord === "hello") {
    change.insertText("!");
  }
};

const initialValue = Plain.deserialize("");

describe("AutoReplacePlugin()", () => {
  // Apply one transform (hi => hello)
  describe("when a a transform is passed to the plugin", () => {
    it("should apply it", () => {
      const value = initialValue;
      const plugins = [AutoReplacePlugin(Transform1)];
      const simulator = new Simulator({ value, plugins });

      simulator
        .keyDown({ key: "h", ctrlKey: false, metaKey: false })
        .keyDown({ key: "i", ctrlKey: false, metaKey: false });

      expect(simulator.value.focusText.text).to.equal("hello");
    });
  });

  // Apply another transform (bye => goodbye) and check array with one element
  describe("when a single transform inside an array is passed to the plugin", () => {
    it("should apply it", () => {
      const value = initialValue;
      const plugins = [AutoReplacePlugin([Transform2])];
      const simulator = new Simulator({ value, plugins });

      simulator
        .keyDown({ key: "b", ctrlKey: false, metaKey: false })
        .keyDown({ key: "y", ctrlKey: false, metaKey: false })
        .keyDown({ key: "e", ctrlKey: false, metaKey: false });

      expect(simulator.value.focusText.text).to.equal("goodbye");
    });
  });

  // Apply multiple transforms in order (hi => hello && hello => hello!)
  describe("when multiple transforms inside an array are passed to the plugin", () => {
    it("should apply them from left to right", () => {
      const value = initialValue;
      const plugins = [AutoReplacePlugin([Transform1, Transform3])];
      const simulator = new Simulator({ value, plugins });

      simulator
        .keyDown({ key: "h", ctrlKey: false, metaKey: false })
        .keyDown({ key: "i", ctrlKey: false, metaKey: false });

      expect(simulator.value.focusText.text).to.equal("hello!");
    });
  });

  describe("when writing a non space character and the last block is an inline", () => {
    it("should append the new character to the inline", () => {
      const value = initialValue;
      const plugins = [AutoReplacePlugin()];
      let simulator = new Simulator({ value, plugins });

      // Write some text
      simulator
        .keyDown({ key: "h", ctrlKey: false, metaKey: false })
        .keyDown({ key: "i", ctrlKey: false, metaKey: false });

      // Insert inline
      const withInline = simulator.value
        .change()
        .extend(-2)
        .wrapInline({ type: "whatever" })
        .extend(2).value;

      // Create new simulator with the updated value
      simulator = new Simulator({ value: withInline, plugins });

      // Write another character
      simulator.keyDown({ key: "!", ctrlKey: false, metaKey: false });

      expect(simulator.value.inlines.get(0).text).to.equal("hi!");
    });
  });
});
