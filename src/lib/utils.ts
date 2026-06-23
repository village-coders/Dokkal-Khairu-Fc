export function cn(...classes: (string | undefined | null | boolean | { [key: string]: boolean })[]) {
  const result: string[] = [];
  
  classes.forEach((c) => {
    if (!c) return;
    if (typeof c === "string") {
      result.push(c);
    } else if (typeof c === "object") {
      Object.entries(c).forEach(([key, value]) => {
        if (value) result.push(key);
      });
    }
  });

  return result.join(" ");
}

export function formatDate(dateString: string, includeTime = true): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    const dayName = days[d.getUTCDay()];
    const dayNum = d.getUTCDate();
    const monthName = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();

    let result = `${dayName}, ${dayNum} ${monthName} ${year}`;

    if (includeTime) {
      const hours = d.getUTCHours().toString().padStart(2, "0");
      const minutes = d.getUTCMinutes().toString().padStart(2, "0");
      result += ` — ${hours}:${minutes} WAT`;
    }

    return result;
  } catch (e) {
    return dateString;
  }
}

export function truncate(text: string, length = 150): string {
  if (!text) return "";
  if (text.length <= length) return text;
  
  // Cut clean at word boundaries
  let cut = text.substring(0, length);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > length * 0.7) {
    cut = cut.substring(0, lastSpace);
  }
  return `${cut}...`;
}

export function getWordCount(htmlString: string): number {
  if (!htmlString) return 0;
  const text = htmlString.replace(/<[^>]*>/g, " ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function calculateReadTime(htmlString: string): string {
  const words = getWordCount(htmlString);
  const minutes = Math.max(1, Math.ceil(words / 200)); // Average 200 wpm
  return `${minutes} min read`;
}
