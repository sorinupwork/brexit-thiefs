import { Timestamp } from "firebase/firestore";

/**
 * Converts a Firestore Timestamp (or legacy ISO string / epoch ms) into an
 * ISO-8601 string for RSC -> Client serialization without invoking `new Date()`.
 */
export function serializeFirestoreTimestamp(
  value: unknown,
  legacyMillis?: unknown
): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (
    value &&
    typeof value === "object" &&
    "seconds" in value &&
    typeof (value as { seconds: unknown }).seconds === "number"
  ) {
    const { seconds, nanoseconds = 0 } = value as {
      seconds: number;
      nanoseconds?: number;
    };
    return Timestamp.fromMillis(
      seconds * 1000 + Math.floor(nanoseconds / 1_000_000)
    )
      .toDate()
      .toISOString();
  }
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  if (typeof legacyMillis === "number" && Number.isFinite(legacyMillis)) {
    return Timestamp.fromMillis(legacyMillis).toDate().toISOString();
  }
  return "";
}

/**
 * Descending comparator for ISO-8601 timestamps (empty timestamps sort last).
 */
export function compareIsoDesc(a: string, b: string): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return b.localeCompare(a);
}
