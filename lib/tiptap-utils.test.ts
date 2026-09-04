import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  upload: vi.fn(),
  getPublicUrl: vi.fn(),
}));

vi.mock("@/supabase-client", () => ({
  supabase: {
    auth: { getUser: mocks.getUser },
    storage: {
      from: () => ({
        upload: mocks.upload,
        getPublicUrl: mocks.getPublicUrl,
      }),
    },
  },
}));

import { handleImageUpload } from "@/lib/tiptap-utils";

describe("handleImageUpload", () => {
  beforeEach(() => {
    mocks.getUser.mockReset();
    mocks.upload.mockReset();
    mocks.getPublicUrl.mockReset();
    mocks.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
    mocks.upload.mockResolvedValue({ error: null });
    mocks.getPublicUrl.mockReturnValue({
      data: { publicUrl: "https://example.supabase.co/article-image.png" },
    });
  });

  it("uploads article images to the authenticated user's gallery path", async () => {
    const progress: number[] = [];
    const file = new File(["image"], "cell.png", { type: "image/png" });

    const url = await handleImageUpload(file, ({ progress: value }) => {
      progress.push(value);
    });

    expect(url).toBe("https://example.supabase.co/article-image.png");
    expect(progress).toEqual([10, 100]);
    expect(mocks.upload).toHaveBeenCalledWith(
      expect.stringMatching(/^articles\/user-123\/[0-9a-f-]+\.png$/),
      file,
      expect.objectContaining({
        cacheControl: "31536000",
        contentType: "image/png",
        upsert: false,
      }),
    );
  });

  it("rejects uploads without an authenticated user", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    const file = new File(["image"], "cell.png", { type: "image/png" });

    await expect(handleImageUpload(file)).rejects.toThrow(
      "Trebuie sa fii autentificat pentru a incarca imagini",
    );
    expect(mocks.upload).not.toHaveBeenCalled();
  });
});