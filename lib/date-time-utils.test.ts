import { describe, expect, it } from "vitest";
import { convertTo24Hour, formatDateForApi } from "./date-time-utils";

describe("convertTo24Hour", () => {
  it("should return \"13:00\", when input is \"1:00 PM\"", () => {
    expect(convertTo24Hour("1:00 PM")).toBe("13:00");
  });

  it("should return \"01:00\", when input is \"1:00 AM\"", () => {
    expect(convertTo24Hour("1:00 AM")).toBe("01:00");
  });

  it("should return \"00:00\", when input is \"12:00 AM\"", () => {
    expect(convertTo24Hour("12:00 AM")).toBe("00:00");
  });

  it("should return \"12:00\", when input is \"12:00 PM\"", () => {
    expect(convertTo24Hour("12:00 PM")).toBe("12:00");
  });

  it("should return \"23:59\", when input is \"11:59 PM\"", () => {
    expect(convertTo24Hour("11:59 PM")).toBe("23:59");
  });

  it("should return \"09:05\", when input is \"9:05 AM\"", () => {
    expect(convertTo24Hour("9:05 AM")).toBe("09:05");
  });

  it("should return an empty string, when input is invalid", () => {
    expect(convertTo24Hour("25:00 PM")).toBe("");
    expect(convertTo24Hour("random string")).toBe("");
    expect(convertTo24Hour("")).toBe("");
    expect(convertTo24Hour("13:00")).toBe("");
  });
});

describe("formatDateForApi", () => {
  it("should return formatted date as \"01/01/2023\", when input is new Date(2023, 0, 1)", () => {
    expect(formatDateForApi(new Date(2023, 0, 1))).toBe("01/01/2023");
  });

  it("should return formatted date as \"31/12/2023\", when input is new Date(2023, 11, 31)", () => {
    expect(formatDateForApi(new Date(2023, 11, 31))).toBe("31/12/2023");
  });

  it("should return formatted date as \"05/06/2023\", when input is new Date(2023, 5, 5)", () => {
    expect(formatDateForApi(new Date(2023, 5, 5))).toBe("05/06/2023");
  });

  it("should return an empty string, when input is null", () => {
    expect(formatDateForApi(null)).toBe("");
  });
});
