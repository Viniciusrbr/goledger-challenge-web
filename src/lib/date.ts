import { format, parseISO } from "date-fns";

/** Converts a date-input value ("2013-10-12") to RFC3339 for the API */
export function toRFC3339(date: string): string {
  return `${date}T00:00:00Z`;
}

/** Extracts the date portion ("2013-10-12") from RFC3339 for <input type="date"> */
export function fromRFC3339(date: string): string {
  return format(parseISO(date), "yyyy-MM-dd");
}

/** Formats an RFC3339 string to "DD/MM/YYYY" for display */
export function displayDate(date: string): string {
  return format(parseISO(date), "dd/MM/yyyy");
}