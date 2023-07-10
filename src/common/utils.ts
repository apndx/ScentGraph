import { Season, TimeOfDay } from './data-classes'

export function seasonDecider(): Season {
  // Northern hemisphere (Winter as Dec/Jan/Feb etc...)
const getSeason = (d: Date) => Math.floor((d.getMonth() / 12 * 4)) % 4
return [Season.Winter, Season.Spring, Season.Summer, Season.Autumn][getSeason(new Date())]
}

export function timeDecider(): TimeOfDay {
  // Breakpoints at 02:00 AM and 14:00 PM UTC
const hours: number = new Date().getUTCHours()
return (hours > 1 && hours < 14) ? TimeOfDay.Day : TimeOfDay.Night
}
