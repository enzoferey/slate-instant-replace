import { isPrintableChar, isCtrlOrCmd } from "../keyHelpers";

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

describe("isCtrlOrCmd(event: { ctrlKey, metaKey })", () => {
  describe("when the function is called", () => {
    it("should return true if control or cmd key is being pressed", () => {
      let result = isCtrlOrCmd({ ctrlKey: true });
      expect(result).toBe(true);

      result = isCtrlOrCmd({ metaKey: true });
      expect(result).toBe(true);

      result = isCtrlOrCmd({ ctrlKey: true, metaKey: true });
      expect(result).toBe(true);

      result = isCtrlOrCmd({ ctrlKey: true, metaKey: false });
      expect(result).toBe(true);

      result = isCtrlOrCmd({ ctrlKey: false, metaKey: true });
      expect(result).toBe(true);

      result = isCtrlOrCmd({ ctrlKey: false, metaKey: false });
      expect(result).toBe(false);
    });
  });
});
