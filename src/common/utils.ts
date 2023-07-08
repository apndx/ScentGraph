import { Season, TimeOfDay } from './data-classes'

export function seasonDecider(): Season {
  // Northern hemisphere (Winter as Dec/Jan/Feb etc...)
const getSeason = (d: Date) => Math.floor((d.getMonth() / 12 * 4)) % 4
return [Season.Winter, Season.Spring, Season.Summer, Season.Autumn][getSeason(new Date())]
}

export function timeDecider(): TimeOfDay {
  // Breakpoints at 05:00 AM and 17:00 PM
const hours: number = new Date().getHours()
return (hours > 4 && hours < 17) ? TimeOfDay.Day : TimeOfDay.Night
}
