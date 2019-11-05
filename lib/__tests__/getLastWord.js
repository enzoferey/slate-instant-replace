import { Editor } from "slate";
import Plain from "slate-plain-serializer";

import { getLastWord } from "../lib/queries";

describe("getLastWord()", () => {
  describe("when a single word is writen", () => {
    it("should return the last word", () => {
      const editor = new Editor({ value: Plain.deserialize("hello") });

      // Anchor at the middle of the word
      expect(getLastWord(editor.moveForward(2))).to.equal("he");

      // Anchor at the end of the word
      expect(getLastWord(editor.moveForward(3))).to.equal("hello");
    });
  });

  describe("when two words are writen", () => {
    it("should return the last word", () => {
      const editor = new Editor({ value: Plain.deserialize("hello world") });

      // Anchor at the end of the first word
      expect(getLastWord(editor.moveForward(5))).to.equal("hello");

      // Anchor at the beginning of the second word
      expect(getLastWord(editor.moveForward(1))).to.equal("");

      // Anchor at the end of the second word
      expect(getLastWord(editor.moveForward(5))).to.equal("world");
    });
  });
});
