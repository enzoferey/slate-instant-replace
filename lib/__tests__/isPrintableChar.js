import { isPrintableChar } from "../keyHelpers";

describe("isPrintableChar(event: { key })", () => {
  describe("when the function is called", () => {
    it("should return true if the key pressed is a letter or space", () => {
      let result = isPrintableChar({ key: "a" });
      expect(result).toBe(true);

      result = isPrintableChar({ key: "b" });
      expect(result).toBe(true);

      result = isPrintableChar({ key: " " });
      expect(result).toBe(true);

      result = isPrintableChar({ key: "Enter" });
      expect(result).toBe(false);

      result = isPrintableChar({ key: "Backspace" });
      expect(result).toBe(false);

      result = isPrintableChar({ key: "Shift" });
      expect(result).toBe(false);

      result = isPrintableChar({ key: "ArrowRight" });
      expect(result).toBe(false);
    });
  });
});
