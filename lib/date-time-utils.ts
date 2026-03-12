/**
 * Converts a time string from 12-hour AM/PM format to 24-hour format.
 * @param time12h - Time in 12-hour format (e.g., "01:00 PM", "1:00 AM").
 * @returns Time in 24-hour format (e.g., "13:00", "01:00") or empty string if invalid.
 */
export function convertTo24Hour(time12h: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const match = time12h.match(timeRegex);

  if (!match) {
    return ""; // Return empty string for invalid input
  }

  let hours: number = Number.parseInt(match[1], 10);
  const minutes: string = match[2];
  const period: string = match[3].toUpperCase();

  // Validate hours and minutes
  if (hours < 1 || hours > 12) {
    return "";
  }
  const minutesNum = Number.parseInt(minutes, 10);
  if (minutesNum < 0 || minutesNum > 59) {
    return "";
  }

  // Convert to 24-hour format
  if (period === "AM") {
    if (hours === 12) {
      hours = 0; // 12:00 AM → 00:00
    }
  }
  else if (period === "PM") {
    if (hours !== 12) {
      hours += 12; // e.g., 1:00 PM → 13:00
    }
  }

  // Format hours and minutes with leading zeros
  const hoursStr: string = hours.toString().padStart(2, "0");
  const minutesStr: string = minutes.padStart(2, "0");

  return `${hoursStr}:${minutesStr}`;
}

export function formatDateForApi(date: Date | null) {
  if (!date) {
    return "";
  }

  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

export function formatDateToCustomString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Formats a date as a relative time string (e.g., "Refreshed 2 minutes ago").
 * @param date - The date to format, or null if no refresh has occurred yet.
 * @returns A human-readable relative time string.
 */
export function formatTimeAgo(date: Date | null): string {
  if (!date) {
    return "Not refreshed yet";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 10) {
    return "Refreshed just now";
  }
  if (diffInSeconds < 60) {
    return `Refreshed ${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Refreshed ${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Refreshed ${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  // For older timestamps, fall back to formatted date/time
  return `Refreshed on ${formatDateToCustomString(date)}`;
}
