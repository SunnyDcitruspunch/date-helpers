import DateConstants from './constants/DateConstants'
import DateStringHelper from './DateStringHelper'

class DateHelper {
  public static areDatesOnSameCalendarDate(dateA: Date, dateB: Date): boolean {
    return (
      DateStringHelper.getYYYY_MM_DDString(dateA) === DateStringHelper.getYYYY_MM_DDString(dateB)
    )
  }

  public static areDatesAdjacent(dateA: Date, dateB: Date): boolean {
    const earlierDate = dateA < dateB ? dateA : dateB
    const laterDate = dateA < dateB ? dateB : dateA
    const dateAfterEarlierDate = new Date(DateStringHelper.getYYYY_MM_DDString(earlierDate))

    dateAfterEarlierDate.setUTCDate(earlierDate.getUTCDate() + 1)
    return this.areDatesOnSameCalendarDate(dateAfterEarlierDate, laterDate)
  }

  public static totalDaysIncludingStartOrEndDate(startDate: Date, endDate: Date): number {
    // @ts-ignore
    const milliSeconds: number = endDate - startDate
    const seconds: number = milliSeconds / DateConstants.millisecondsInASecond
    const days: number = seconds / DateConstants.secondsInADay
    const daysBetweenDates = Math.floor(days)
    return daysBetweenDates || daysBetweenDates + 1
  }

  public static totalDaysExcludingStartAndEndDate(startDate: Date, endDate: Date): number {
    // @ts-ignore
    const milliSeconds: number = endDate - new Date(startDate).setDate(startDate.getDate() + 1)
    const seconds: number = milliSeconds / DateConstants.millisecondsInASecond
    const days: number = seconds / DateConstants.secondsInADay
    const daysBetweenDates = Math.floor(days)
    return daysBetweenDates
  }

  public static dateDiffInDays = (a: Date, b: Date): number => {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

    return Math.floor((utc2 - utc1) / DateConstants.millisecondsPerDay)
  }

  public static areDateRangesOverlapped(
    startA: Date,
    endA: Date,
    startB: Date,
    endB: Date
  ): boolean {
    const aStartsWithinB = DateHelper.isDateOnOrInDateRange(startA, startB, endB)
    const aEndsWithinB = DateHelper.isDateOnOrInDateRange(endA, startB, endB)
    const bStartsWithinA = DateHelper.isDateOnOrInDateRange(startB, startA, endA)
    const bEndsWithinA = DateHelper.isDateOnOrInDateRange(endB, startA, endA)
    return aStartsWithinB || aEndsWithinB || bStartsWithinA || bEndsWithinA
  }

  public static findQuarterByDate(date: Date): number {
    const month = date.getMonth() + 1
    return Math.ceil(month / 3)
  }

  // Ignores local timezone
  static fromISO = (date: string): Date => {
    const dateObj = new Date(date)
    const tzOffset = dateObj.getTimezoneOffset() * 60000
    // @ts-ignore
    return new Date(dateObj.getTime() + tzOffset)
  }

  public static getDateByYYYY_MM_DDString(date: string): Date {
    const dateBreakdown: string[] = date.split('-')
    const year: number = parseInt(dateBreakdown[0], 10)
    // -1 because of ZERO based indexing for date months
    const month: number = parseInt(dateBreakdown[1], 10) - 1
    const day: number = parseInt(dateBreakdown[2], 10)

    return new Date(year, month, day)
  }

  public static getDateNWorkdaysFromDate(date: Date, nWorkDays: number): Date {
    let copyOfDate = new Date(date)
    let workDaysRemaining = nWorkDays

    if (!this.isWorkDay(date)) {
      copyOfDate = this.getNextWorkDay(date)
    }

    while (workDaysRemaining > 1) {
      workDaysRemaining--
      copyOfDate = this.getNextWorkDay(copyOfDate)
    }

    return copyOfDate
  }

  public static getDateFromNumWorkDaysAgo(workDaysAgo: number, date = new Date()): Date {
    const sunday = 0
    const saturday = 6
    let dateResult = new Date(date.getTime())
    let shiftedCount = 0

    while (shiftedCount < workDaysAgo) {
      const previousDay = DateHelper.getPreviousDate(dateResult).getDay()

      if (previousDay !== sunday && previousDay !== saturday) {
        ++shiftedCount
      }

      dateResult = DateHelper.getPreviousDate(dateResult)
    }

    return dateResult
  }

  public static getQuarterNumber(date = new Date()): number {
    return Math.floor(date.getUTCMonth() / 3) + 1
  }

  public static getDaysInDateRange = (startDate: Date, endDate: Date): number => {
    const totalDaysInDateRange = DateHelper.dateDiffInDays(startDate, endDate) + 1

    return totalDaysInDateRange > 0 ? totalDaysInDateRange : null
  }

  public static getDaysInMonth(date: Date): number {
    return new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0).getUTCDate()
  }

  public static getEarlierDate(dateA: Date, dateB: Date): Date {
    return this.isDateBeforeDate(dateA, dateB) ? dateA : dateB
  }

  public static getEndDateOfQuarterByDate(date: Date): Date {
    const endMonth = [
      DateConstants.q1EndMonthIndex,
      DateConstants.q2EndMonthIndex,
      DateConstants.q3EndMonthIndex,
      DateConstants.q4EndMonthIndex
    ].find(month => month >= date.getUTCMonth())

    return new Date(date.getUTCFullYear(), endMonth + 1, 0)
  }

  public static getFollowingDay(date: Date): Date {
    return this.getNewDateByAddingDays(date, 1)
  }

  public static getLastDayOfMonthFromDate(date: Date): Date {
    return new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  }

  public static getLaterDate(dateA: Date, dateB: Date): Date {
    return this.isDateBeforeDate(dateA, dateB) ? dateB : dateA
  }

  public static getMillisecondsInMonth(year: number, month: number, date: number): number[] {
    const currentMonth = new Date().getMonth()
    const currentMonthIndex = month === 0 ? 1 : month - 1
    const startDate = new Date(year, currentMonthIndex)
    const startMillisecond = startDate.getTime()
    const endDay = currentMonth + 1 === month ? date : DateHelper.getDaysInMonth(startDate)
    const endDate = new Date(year, currentMonthIndex, endDay)
    const endMillisecond = endDate.getTime()

    return [startMillisecond, endMillisecond]
  }

  public static getMostRecentDate(dates: Date[]): Date {
    return dates.reduce((a: Date, b: Date) => {
      return this.getLaterDate(a, b)
    })
  }

  public static getNewDateByAddingDays(date: Date, days: number): Date {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days)
  }

  public static getNextWorkDay(date: Date): Date {
    let copyOfDate = new Date(date.getTime())

    copyOfDate.setDate(copyOfDate.getDate() + 1)
    while (!this.isWorkDay(copyOfDate)) {
      copyOfDate.setUTCDate(copyOfDate.getUTCDate() + 1)
    }

    return copyOfDate
  }

  public static getPreviousWorkDay(date: Date): Date {
    const copyOfDate = new Date(date.getTime())
    copyOfDate.setUTCDate(copyOfDate.getUTCDate() - 1)
    while (!this.isWorkDay(copyOfDate)) {
      copyOfDate.setUTCDate(copyOfDate.getUTCDate() - 1)
    }
    return copyOfDate
  }

  public static getToday(): Date {
    return new Date(Date.now())
  }

  public static getQuarterEndMonth(quarter: number): number {
    return [
      DateConstants.q1EndMonthIndex,
      DateConstants.q2EndMonthIndex,
      DateConstants.q3EndMonthIndex,
      DateConstants.q4EndMonthIndex
    ][quarter - 1]
  }

  public static getQuartersInRange(startDate: string, endDate: string): number {
    let start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) {
      return 0
    }

    let numQuarters = 1

    while (this.isNotSameYearAndMonth(start, end)) {
      const lastMonth = start.getUTCMonth()

      const lastYear = start.getUTCFullYear()
      start = new Date(start.getUTCFullYear(), start.getUTCMonth() + 1, 1)

      if (
        this.doMonthsCrossQuarterBoundary(
          lastMonth,
          start.getUTCMonth(),
          lastYear,
          start.getUTCFullYear()
        )
      ) {
        numQuarters++
      }
    }

    return numQuarters
  }

  private static isNotSameYearAndMonth(start: Date, end: Date): boolean {
    return !(
      start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth()
    )
  }

  public static getStartDateOfQuarterByDate(date: Date): Date {
    const startMonth = [
      DateConstants.q4StartMonthIndex,
      DateConstants.q3StartMonthIndex,
      DateConstants.q2StartMonthIndex,
      DateConstants.q1StartMonthIndex
    ].find(month => date.getUTCMonth() >= month)

    return new Date(date.getUTCFullYear(), startMonth, 1)
  }

  public static getTomorrow(): Date {
    const tomorrow = this.getToday()
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

    return tomorrow
  }

  public static getUtcHourFromMstHour(mstHour: number): number {
    const hoursInDay = 24
    const timeZoneHoursDifference = 6
    const hoursRemaining = hoursInDay - timeZoneHoursDifference

    if (mstHour < hoursRemaining) {
      return mstHour + timeZoneHoursDifference
    } else {
      return mstHour - hoursRemaining
    }
  }

  private static getYearsBetweenDates(startDate: Date, endDate: Date): number {
    return endDate.getUTCFullYear() - startDate.getUTCFullYear()
  }

  public static getYesterday = (date = new Date(Date.now())): Date => {
    return new Date(new Date(date).setDate(date.getDate() - 1))
  }

  public static hasWorkedFewerDaysThanTimePeriod(
    startDate: Date,
    comparisonDate: Date,
    daysBack: number
  ): boolean {
    return this.totalDaysIncludingStartOrEndDate(startDate, comparisonDate) < daysBack
  }

  public static isDateBeforeDate(comparisonDate: Date, date: Date): boolean {
    return comparisonDate < date
  }

  public static isDateInDateRangeInclusive(comparisonDate: Date, start: Date, end: Date): boolean {
    return comparisonDate >= start && comparisonDate <= end
  }

  public static isDateOnOrBeforeDate(comparisonDate: Date, date: Date): boolean {
    const dateFunctions = ['getUTCFullYear', 'getUTCMonth', 'getUTCDate']

    for (let i = 0; i < dateFunctions.length; i++) {
      const dateA = comparisonDate[dateFunctions[i]]()
      const dateB = date[dateFunctions[i]]()

      if (dateA > dateB) {
        return false
      } else if (dateA < dateB) {
        return true
      }
    }

    return true
  }

  public static isDateOnOrInDateRange(comparisonDate: Date, start: Date, end: Date): boolean {
    return comparisonDate >= start && comparisonDate <= end
  }

  public static isDoubleDigit(num: number): boolean {
    return num > 9
  }

  public static isToday(date: Date): boolean {
    return this.areDatesOnSameCalendarDate(date, this.getToday())
  }

  public static isValidDate(date): boolean {
    return !isNaN(date) && date instanceof Date
  }

  public static isWorkDay(date: Date): boolean {
    const dayOfWeek = date.getUTCDay()
    return dayOfWeek !== 6 && dayOfWeek !== 0
  }

  public static isYesterday(date: Date): boolean {
    const today = this.getToday()
    return this.areDatesOnSameCalendarDate(date, new Date(today.setDate(today.getDate() - 1)))
  }

  public static isYYYY_MM_DD_string(date: string): boolean {
    return DateStringHelper.getYYYY_MM_DDString(new Date(date)) === date
  }

  public static monthsBetweenDates(startDate: Date, endDate: Date): number {
    const yearsBetweenDates = this.getYearsBetweenDates(startDate, endDate)
    return (
      endDate.getUTCMonth() -
      startDate.getUTCMonth() +
      yearsBetweenDates * DateConstants.monthsInYear
    )
  }

  public static numberBusinessDaysInDateRangeInclusive(startDate: Date, endDate: Date): number {
    let days = 0
    const currDate = new Date(startDate)

    while (currDate <= endDate) {
      const dayOfWeek = currDate.getUTCDay()
      if (dayOfWeek !== 6 && dayOfWeek !== 0) {
        days++
      }
      currDate.setUTCDate(currDate.getUTCDate() + 1)
    }

    return days
  }

  public static numberOfDistinctMonthsInPeriod(startDate: Date, endDate: Date): number {
    return (
      endDate.getUTCMonth() -
      startDate.getUTCMonth() +
      DateConstants.monthsInYear * (endDate.getUTCFullYear() - startDate.getUTCFullYear()) +
      1
    )
  }

  public static oneYearAgoToday(): Date {
    const oneYearAgoToday = new Date(this.getToday())
    oneYearAgoToday.setUTCDate(oneYearAgoToday.getUTCDate() - DateConstants.daysInYear)

    return oneYearAgoToday
  }

  public static getPreviousDate(date = this.getToday()): Date {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1)
  }

  public static getPreviousMonth(date = this.getToday()): Date {
    return new Date(date.getUTCFullYear(), date.getUTCMonth() - 1, date.getUTCDate())
  }

  public static getPreviousYear(date = this.getToday()): Date {
    return new Date(date.getUTCFullYear() - 1, date.getUTCMonth(), date.getUTCDate())
  }

  public static removeTimestampFromDate(date: Date): Date {
    return new Date(DateStringHelper.getYYYY_MM_DDString(date))
  }

  public static doMonthsCrossQuarterBoundary(
    startMonth: number,
    endMonth: number,
    startYear: number,
    endYear: number
  ): boolean {
    if (startYear < endYear) {
      return true
    }

    if (endYear < startYear) {
      return false
    }
    if (
      startYear < endYear &&
      startMonth > DateConstants.q1StartMonthIndex &&
      endMonth >= DateConstants.q1StartMonthIndex
    ) {
      return true
    }

    if (
      startMonth < DateConstants.q2StartMonthIndex &&
      endMonth >= DateConstants.q2StartMonthIndex
    ) {
      return true
    }

    if (
      startMonth < DateConstants.q3StartMonthIndex &&
      endMonth >= DateConstants.q3StartMonthIndex
    ) {
      return true
    }

    if (
      startMonth < DateConstants.q4StartMonthIndex &&
      endMonth >= DateConstants.q4StartMonthIndex
    ) {
      return true
    }

    return false
  }

  /**
   * Given a number that has been scaled from 90 days, return that number
   * in a back to 90 days
   *
   * @param scaledNumber a number that represents a metric for a 90-day period
   * @param scale 0: workDay, 1: week, 2: month
   */
  public static reverseScale90DayNumber = (scaledNumber: number, scale: number): number => {
    switch (scale) {
      case 0:
        return scaledNumber * DateConstants.workDaysIn90Days
      case 1:
        return scaledNumber * DateConstants.weeksIn90Days
      case 2:
        return scaledNumber * DateConstants.monthsIn90Days
      default:
        return scaledNumber
    }
  }

  /**
   * Given a number toScale that is in terms of 90 days, return that number
   * in a scaled average format of either workDays, weeks, or months
   *
   * @param toScale a number that represents a metric for a 90-day period
   * @param scale 0: workDay, 1: week, 2: month
   * @param numOptions
   * @param workDaysIntoJob
   */
  public static scale90DayNumber = (
    toScale: number,
    scale: number,
    numOptions?: number,
    workDaysIntoJob?: number,
    ceilResult?: boolean
  ): number => {
    if (numOptions === undefined || numOptions === 4) {
      switch (scale) {
        case 0:
          return toScale / DateConstants.workDaysIn90Days
        case 1:
          return toScale / DateConstants.weeksIn90Days
        case 2:
          return toScale / DateConstants.monthsIn90Days
        default:
          return toScale
      }
    } else if (numOptions === 2) {
      if (scale === 0) {
        return ceilResult ? Math.ceil(toScale / workDaysIntoJob) : toScale / workDaysIntoJob
      }
    }
    return toScale
  }
}

export default DateHelper
