import { describe, expect, it } from "vitest";
import { getErrorMessage } from "@/src/lib/error-message";

describe("getErrorMessage", () => {
  it("preserves Supabase error details", () => {
    expect(
      getErrorMessage({
        code: "42501",
        message: "new row violates row-level security policy",
        details: "Role authenticated is not allowed",
        hint: "Add an INSERT policy",
      }),
    ).toBe(
      "[42501] new row violates row-level security policy Role authenticated is not allowed Add an INSERT policy",
    );
  });

  it("supports native errors and fallback values", () => {
    expect(getErrorMessage(new Error("Network failure"))).toBe("Network failure");
    expect(getErrorMessage({})).toBe("Actiunea nu a putut fi finalizata.");
    expect(getErrorMessage({}, "Eroare personalizata.")).toBe("Eroare personalizata.");
  });
});