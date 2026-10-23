import { mediaUrl, API_ORIGIN } from "./lib/api";

describe("mediaUrl", () => {
  it("returns absolute urls unchanged", () => {
    expect(mediaUrl("https://cdn.example.com/a.png")).toBe(
      "https://cdn.example.com/a.png",
    );
  });

  it("prefixes backend origin for relative paths", () => {
    expect(mediaUrl("/logo.svg")).toBe(`${API_ORIGIN}/logo.svg`);
  });

  it("handles empty values", () => {
    expect(mediaUrl(null)).toBeNull();
    expect(mediaUrl("")).toBeNull();
  });
});
