export function nowInTaipei(): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";

  return {
    date: `${get("year")}/${get("month")}/${get("day")}`,
    time: `${get("hour")}:${get("minute")}:${get("second")}`,
  };
}
