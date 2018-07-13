import Plain from "slate-plain-serializer";
import { getLastWord } from "../lib";

describe("getLastWord()", () => {
  describe("when a single word is writen", () => {
    it("should return the last word", () => {
      const value = Plain.deserialize("hello");

      // Selection at the middle of the word
      expect(getLastWord(value.change().move(2))).to.equal("he");

      // Selection at the end of the word
      expect(getLastWord(value.change().move(5))).to.equal("hello");
    });
  });

  describe("when two words are writen", () => {
    it("should return the last word", () => {
      const value = Plain.deserialize("hello world");

      // Selection at the end of the first word
      expect(getLastWord(value.change().move(5))).to.equal("hello");

      // Selection at the beginning of the second word
      expect(getLastWord(value.change().move(6))).to.equal("");

      // Selection at the end of the second word
      expect(getLastWord(value.change().move(11))).to.equal("world");
    });
  });
});
