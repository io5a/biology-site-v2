export function getPastedImageFiles(event: ClipboardEvent): File[] {
  const clipboardData = event.clipboardData;
  if (!clipboardData) return [];

  const files = new Set<File>();

  for (const item of Array.from(clipboardData.items)) {
    if (!item.type.startsWith("image/")) continue;

    const file = item.getAsFile();
    if (file) files.add(file);
  }

  for (const file of Array.from(clipboardData.files)) {
    if (file.type.startsWith("image/")) files.add(file);
  }

  return Array.from(files);
}