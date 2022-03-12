export const findFirstAvailableDuplicateName = (names: string[], noteNameToDuplicate: string): string => {
  if (!names.includes(noteNameToDuplicate)) {
    return "";
  }

  let original = noteNameToDuplicate + " "; // one empty space before "(5)", "(6)", etc.
  let suffix = 1;
  let duplicate;

  const duplicateMatch = noteNameToDuplicate.match(/(.+)\((\d{1,2})\)$/); // "article (5)" (allow 1 or 2 digits only)
  if (duplicateMatch) {
    original = duplicateMatch[1]; // "article " (may include space)
    suffix = parseInt(duplicateMatch[2]); // "5" => 5
  }

  do {
    suffix += 1;
    duplicate = `${original}(${suffix})`;
  } while (names.includes(duplicate)); // repeat until first available duplicate name is found

  return duplicate;
};
