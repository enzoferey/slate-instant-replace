import { Editor } from "slate";
import Plain from "slate-plain-serializer";

import { getLastWord } from "../queries";

describe("getLastWord()", () => {
  describe("when a single word is writen", () => {
    it("should return the last word", () => {
      const editor = new Editor({ value: Plain.deserialize("hello") });

      // Anchor at the middle of the word
      expect(getLastWord(editor.moveForward(2))).toBe("he");

      // Anchor at the end of the word
      expect(getLastWord(editor.moveForward(3))).toBe("hello");
    });
  });

  describe("when two words are writen", () => {
    it("should return the last word", () => {
      const editor = new Editor({ value: Plain.deserialize("hello world") });

      // Anchor at the end of the first word
      expect(getLastWord(editor.moveForward(5))).toBe("hello");

      // Anchor at the beginning of the second word
      expect(getLastWord(editor.moveForward(1))).toBe("");

      // Anchor at the end of the second word
      expect(getLastWord(editor.moveForward(5))).toBe("world");
    });
  });
});
