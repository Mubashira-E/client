import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("should return an empty string, when no arguments are provided", () => {
    expect(cn()).toBe("");
  });

  it("should return the class name, when a single string is provided", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("should return merged class names, when multiple strings are provided", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should return merged class names, when an array of strings is provided", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("should return merged class names, when a mix of strings and arrays is provided", () => {
    expect(cn("foo", ["bar", "baz"])).toBe("foo bar baz");
  });

  it("should return merged class names, when conditional objects are provided", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("should return merged class names, when tailwind classes are overridden", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("should return merged class names, when null, undefined, or false values are provided", () => {
    expect(cn("foo", null, undefined, false, "bar")).toBe("foo bar");
  });

  it("should return merged class names, when a mix of all types is provided", () => {
    expect(cn("foo", ["bar", { baz: true, qux: false }], null, undefined)).toBe("foo bar baz");
  });
});
