import { isPrintableChar } from "../lib";

describe("isPrintableChar(event: { key })", () => {
  describe("when the function is called", () => {
    it("should return true if the key pressed is a letter or space", () => {
      let result = isPrintableChar({ key: "a" });
      expect(result).to.equal(true);

      result = isPrintableChar({ key: "b" });
      expect(result).to.equal(true);

      result = isPrintableChar({ key: " " });
      expect(result).to.equal(true);

      result = isPrintableChar({ key: "Enter" });
      expect(result).to.equal(false);

      result = isPrintableChar({ key: "Backspace" });
      expect(result).to.equal(false);

      result = isPrintableChar({ key: "Shift" });
      expect(result).to.equal(false);

      result = isPrintableChar({ key: "ArrowRight" });
      expect(result).to.equal(false);
    });
  });
});
