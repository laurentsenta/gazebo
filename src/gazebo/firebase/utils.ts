import { Timestamp } from "./core";

export const optionalTimestamp = (
  date: Date | number | null | undefined
): Timestamp | null => {
  if (date === null) {
    return null;
  }
  if (date === undefined) {
    return null;
  }
  if (typeof date === "number") {
    return Timestamp.fromMillis(date);
  }
  return Timestamp.fromDate(date);
};

export const optionalDate = (ts: Timestamp | null): Date | null => {
  if (ts === null) {
    return null;
  }
  return ts.toDate();
};
