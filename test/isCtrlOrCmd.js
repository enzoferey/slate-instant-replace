import { isCtrlOrCmd } from "../lib/keyHelpers";

describe("isCtrlOrCmd(event: { ctrlKey, metaKey })", () => {
  describe("when the function is called", () => {
    it("should return true if control or cmd key is being pressed", () => {
      let result = isCtrlOrCmd({ ctrlKey: true });
      expect(result).to.equal(true);

      result = isCtrlOrCmd({ metaKey: true });
      expect(result).to.equal(true);

      result = isCtrlOrCmd({ ctrlKey: true, metaKey: true });
      expect(result).to.equal(true);

      result = isCtrlOrCmd({ ctrlKey: true, metaKey: false });
      expect(result).to.equal(true);

      result = isCtrlOrCmd({ ctrlKey: false, metaKey: true });
      expect(result).to.equal(true);

      result = isCtrlOrCmd({ ctrlKey: false, metaKey: false });
      expect(result).to.equal(false);
    });
  });
});
