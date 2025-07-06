/**
 * Defines the type of recurrence for an event.
 */
export enum RecurrenceType {
    ONE_TIME = 'ONE_TIME',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
}

/**
 * Represents a one-time event scheduled for a specific date and time.
 */
export interface OneTimeSchedule {
    type: RecurrenceType.ONE_TIME;
    /** The exact start date and time for the one-time event. */
    startDatetime: Date;
    /** The exact end date and time for the one-time event. Must be on the same day as startDatetime. */
    endDatetime: Date;
}

/**
 * Base interface for all recurring event schedules.
 * Includes common properties like start and optional end dates.
 */
interface BaseRecurringSchedule {
    /** The start date from which the recurrence begins. The time component of this date might be ignored or used as the default time for daily/weekly/monthly events, depending on implementation. */
    startDate: Date;
    /** Optional end date for the recurrence. If not provided, the event recurs indefinitely from the startDate. */
    endDate?: Date;
    /** Optional start time of day for the event, if applicable (e.g., '10:30' for 10:30 AM).
     * This should be a string in 'HH:MM' format.
     */
    startTimeOfDay?: string;
    /** Optional end time of day for the event, if applicable (e.g., '11:00' for 11:00 AM).
     * This should be a string in 'HH:MM' format and must be on the same day as startTimeOfDay.
     */
    endTimeOfDay?: string;
}

/**
 * Represents a daily recurring event.
 */
export interface DailySchedule extends BaseRecurringSchedule {
    type: RecurrenceType.DAILY;
}

/**
 * Represents a weekly recurring event.
 */
export interface WeeklySchedule extends BaseRecurringSchedule {
    type: RecurrenceType.WEEKLY;
    /**
     * An array of numbers representing the days of the week the event occurs.
     * 0 = Sunday, 1 = Monday, ..., 6 = Saturday.
     * Can include multiple days (e.g., [1, 3, 5] for Monday, Wednesday, Friday).
     */
    daysOfWeek: number[];
}

/**
 * Represents a monthly recurring event.
 */
export interface MonthlySchedule extends BaseRecurringSchedule {
    type: RecurrenceType.MONTHLY;
    /**
     * An array of numbers representing the days of the month the event occurs.
     * 1 = 1st of the month, ..., 31 = 31st of the month.
     * Can include multiple days (e.g., [1, 15] for the 1st and 15th of each month).
     * Note: Dates like 30 or 31 will automatically adjust for shorter months (e.g., February).
     */
    daysOfMonth: number[];
}

/**
 * A union type that can represent any type of event schedule:
 * either a one-time event or a daily, weekly, or monthly recurring event.
 */
export type EventSchedule = OneTimeSchedule | DailySchedule | WeeklySchedule | MonthlySchedule;

/**
 * Formats an EventSchedule into a human-readable string.
 */
export function formatEventSchedule(schedule: EventSchedule | undefined): string {
  if (!schedule) return 'old schedule format';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      const d = new Date(date);
      return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
    } else if (date instanceof Date) {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
    throw new Error(`Invalid date format: ${date}`);
  };
  const formatTime = (t?: string | Date) => {
    if (!t) return '';
    if (typeof t === 'string') return t;
    return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
  };
  switch (schedule.type) {
    case RecurrenceType.ONE_TIME: {
      const start = schedule.startDatetime instanceof Date ? schedule.startDatetime : new Date(schedule.startDatetime);
      const end = schedule.endDatetime instanceof Date ? schedule.endDatetime : new Date(schedule.endDatetime);
      return `One-time: ${formatDate(start)} ${formatTime(start)} - ${formatTime(end)}`;
    }
    case RecurrenceType.DAILY: {
      let str = `Daily`;
      if (schedule.startTimeOfDay && schedule.endTimeOfDay)
        str += `, ${schedule.startTimeOfDay} - ${schedule.endTimeOfDay}`;
      if (schedule.startDate)
        str += ` from ${formatDate(schedule.startDate)}`;
      if (schedule.endDate)
        str += ` to ${formatDate(schedule.endDate)}`;
      return str;
    }
    case RecurrenceType.WEEKLY: {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let str = `Weekly on ${schedule.daysOfWeek.map(d => days[d]).join(', ')}`;
      if (schedule.startTimeOfDay && schedule.endTimeOfDay)
        str += `, ${schedule.startTimeOfDay} - ${schedule.endTimeOfDay}`;
      if (schedule.startDate)
        str += ` from ${formatDate(schedule.startDate)}`;
      if (schedule.endDate)
        str += ` to ${formatDate(schedule.endDate)}`;
      return str;
    }
    case RecurrenceType.MONTHLY: {
      let str = `Monthly on the ${schedule.daysOfMonth.join(', ')}${schedule.daysOfMonth.length === 1 ? 'th' : 'ths'}`;
      if (schedule.startTimeOfDay && schedule.endTimeOfDay)
        str += `, ${schedule.startTimeOfDay} - ${schedule.endTimeOfDay}`;
      if (schedule.startDate)
        str += ` from ${formatDate(schedule.startDate)}`;
      if (schedule.endDate)
        str += ` to ${formatDate(schedule.endDate)}`;
      return str;
    }
    default:
      return '';
  }
}

export interface Event {
  id: string;
  title: string;
  description: string;
  schedule: EventSchedule;
  location: string;
  category: string;
  imageUrl?: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar: string;
  createdAt: string;
  participants: string[];
  maxParticipants: number | null;
  tags: string[];
  link?: string;
}