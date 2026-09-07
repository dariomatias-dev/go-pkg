import { describe, expect, it, vi } from "vitest";

import { getCachedPackageDetail } from "./cached";
import { getPackageDetail } from "./detail";

vi.mock("./detail", () => ({
  getPackageDetail: vi.fn().mockResolvedValue({
    pkg: { name: "gin", importPath: "github.com/gin-gonic/gin" },
    goMod: "",
    isCustom: false,
  }),
}));

describe("getCachedPackageDetail", () => {
  it("delegates to getPackageDetail", async () => {
    const result = await getCachedPackageDetail("github.com/gin-gonic/gin");

    expect(getPackageDetail).toHaveBeenCalledWith("github.com/gin-gonic/gin");
    expect(result.pkg.name).toBe("gin");
  });
});
