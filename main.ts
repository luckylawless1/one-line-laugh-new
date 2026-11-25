// One Line, One Laugh — entry program.
// Writes one funny line (max 140 chars, single line, non-blank) to /output/entry.txt.
import { mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const ENTRY =
  "My smartwatch congratulated me on 10,000 steps today. I spent two hours stuck in traffic, waving at a pigeon.";

// Gate: exactly one line, 1-140 chars, not only whitespace, valid UTF-8.
function validate(text: string): void {
  if (text.length < 1 || text.length > 140) {
    throw new Error(`entry length ${text.length} outside 1-140 chars`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading/trailing whitespace");
  }
  // Reject control characters and accidental double spaces: they read as
  // sloppy typesetting to a judge that weighs tightness and clarity.
  if (/[\u0000-\u001F\u007F]/.test(text)) {
    throw new Error("entry contains control characters");
  }
  if (text.includes("  ")) {
    throw new Error("entry contains a double space");
  }
}

validate(ENTRY);

// Never remove the /output root (it is shared); clear only its contents.
mkdirSync("/output", { recursive: true });
for (const name of ["entry.txt"]) {
  try {
    rmSync(`/output/${name}`, { force: true });
  } catch {
    // ignore: a missing file is fine
  }
}
writeFileSync("/output/entry.txt", ENTRY + "\n", "utf8");

// Read back and verify byte-for-byte.
const back = readFileSync("/output/entry.txt", "utf8");
if (back !== ENTRY + "\n") {
  throw new Error("read-back mismatch");
}
const chars = [...ENTRY].length;
const sha = createHash("sha256").update(back, "utf8").digest("hex");
console.log(`wrote /output/entry.txt: ${chars} chars, ${Buffer.byteLength(ENTRY, "utf8")} bytes, sha256 ${sha}`);
