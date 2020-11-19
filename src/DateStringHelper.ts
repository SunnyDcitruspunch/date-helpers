import DateConstants from './constants/DateConstants'
import DateHelper from './DateHelper'
import StringConstants from './constants/StringConstants'

class DateStringHelper {
  public static addLeadingZeros = (numberString: string, totalDigits: number): string => {
    if (numberString.length === totalDigits) {
      return numberString
    }

    return `0${DateStringHelper.addLeadingZeros(numberString, totalDigits - 1)}`
  }

  public static buildEndOfMonthDateString(date: Date): string {
    const daysInMonth = DateHelper.getDaysInMonth(date)
    const endOfMonthDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), daysInMonth)
    return this.getYYYY_MM_DDString(endOfMonthDate)
  }

  public static buildStartOfMonthDateString(date: Date): string {
    const startOfMonthDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1)
    return this.getYYYY_MM_DDString(startOfMonthDate)
  }

  public static findDateLastNWorkdaysAgoInclusive(workdays: number, endDateStr: string): string {
    if (workdays <= 0 || !endDateStr) {
      return null
    }

    let daysRemaining = workdays
    let currentDate: Date = new Date(endDateStr)
    if (!DateHelper.isWorkDay(currentDate)) {
      currentDate = DateHelper.getPreviousWorkDay(currentDate)
    }

    while (daysRemaining > 1) {
      currentDate = DateHelper.getPreviousWorkDay(currentDate)
      daysRemaining--
    }
    return this.getYYYY_MM_DDString(currentDate)
  }

  public static formatOptionalDate(optionalDate: string): string {
    if (optionalDate === null) {
      return null
    } else {
      return this.getYYYY_MM_DDString(new Date(optionalDate))
    }
  }

  private static getDailyDateRangeWithTimePeriod(
    timePeriods: number,
    lastDate: Date
  ): { startDate: string; endDate: string }[] {
    const dateRanges = []
    let currentDate = new Date(lastDate)

    if (!DateHelper.isWorkDay(currentDate)) {
      currentDate = DateHelper.getPreviousWorkDay(currentDate)
    }

    for (let i = 0; i < timePeriods; i++) {
      dateRanges.unshift({
        startDate: this.getYYYY_MM_DDString(currentDate),
        endDate: this.getYYYY_MM_DDString(currentDate)
      })
      currentDate = DateHelper.getPreviousWorkDay(currentDate)
    }
    return dateRanges
  }

  public static getDashedDateFormat = (dateString: string): string => {
    if (!dateString) {
      return dateString
    }

    const date = DateHelper.fromISO(dateString)

    return `${date.getFullYear()}-${DateStringHelper.addLeadingZeros(
      (date.getMonth() + 1).toString(),
      2
    )}-${DateStringHelper.addLeadingZeros(date.getDate().toString(), 2)}`
  }

  private static getMonthDateRangeWithTimePeriod(
    timePeriod: number,
    lastDate: Date
  ): { startDate: string; endDate: string }[] {
    const dateRanges = []
    for (let i = 0; i < timePeriod; i++) {
      const isEndDateInTheMiddleOfTheMonth =
        lastDate !== new Date(lastDate.getFullYear(), lastDate.getMonth(), 0)
      const startDate = this.getYYYY_MM_DDString(
        new Date(lastDate.getFullYear(), lastDate.getMonth() - i, 1)
      )
      const endDate = this.getYYYY_MM_DDString(
        isEndDateInTheMiddleOfTheMonth && i === 0
          ? lastDate
          : new Date(lastDate.getFullYear(), lastDate.getMonth() - i + 1, 0)
      )
      dateRanges.unshift({
        startDate,
        endDate
      })
    }
    return dateRanges
  }

  private static getQuarterDateRangeWithTimePeriod(
    timePeriod: number,
    lastDate: Date
  ): { startDate: string; endDate: string }[] {
    const dateRanges = []
    for (let i = 0; i < timePeriod; i++) {
      const currentQuarter = DateHelper.findQuarterByDate(lastDate)
      const quarterEndMonth = DateHelper.getQuarterEndMonth(currentQuarter)
      const isEndDateInTheMiddleOfTheQuarter: boolean =
        lastDate.getMonth() !==
        (DateConstants.q1EndMonthIndex ||
          DateConstants.q2EndMonthIndex ||
          DateConstants.q3EndMonthIndex ||
          DateConstants.q4EndMonthIndex)

      const startDate = this.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(
          new Date(
            lastDate.getFullYear(),
            lastDate.getMonth() - DateConstants.monthsInQuarter * i,
            1
          )
        )
      )
      const endDate = this.getYYYY_MM_DDString(
        isEndDateInTheMiddleOfTheQuarter && i === 0
          ? lastDate
          : DateHelper.getEndDateOfQuarterByDate(
              new Date(
                lastDate.getFullYear(),
                quarterEndMonth - DateConstants.monthsInQuarter * i,
                0
              )
            )
      )
      dateRanges.unshift({
        startDate,
        endDate
      })
    }
    return dateRanges
  }

  public static getStartAndEndDateByNTimePeriods(
    periodType: string,
    timePeriods: number,
    endDateStr: string
  ): { startDate: string; endDate: string }[] {
    let endDate: Date = new Date(endDateStr)

    if (periodType === StringConstants.monthlyTimePeriod) {
      return this.getMonthDateRangeWithTimePeriod(timePeriods, new Date(endDate))
    } else if (periodType === StringConstants.quarterlyTimePeriod) {
      return this.getQuarterDateRangeWithTimePeriod(timePeriods, new Date(endDate))
    } else {
      return this.getDailyDateRangeWithTimePeriod(timePeriods, new Date(endDate))
    }
  }

  public static getStartDateByTimePeriod(date: Date, timePeriod: string): string {
    if (timePeriod === StringConstants.quarterlyTimePeriod) {
      return this.getYYYY_MM_DDString(DateHelper.getStartDateOfQuarterByDate(date))
    } else if (timePeriod === StringConstants.monthlyTimePeriod) {
      return this.buildStartOfMonthDateString(date)
    } else if (timePeriod === StringConstants.dailyTimePeriod) {
      if (DateHelper.isWorkDay(date)) {
        return this.getYYYY_MM_DDString(date)
      }
      return this.getYYYY_MM_DDString(DateHelper.getNextWorkDay(date))
    }
    return null
  }

  public static getYYYY_MM_DDString(date = new Date()): string {
    const paddingFillString = '0'
    const month = (date.getUTCMonth() + 1).toString().padStart(2, paddingFillString)
    const day = date
      .getUTCDate()
      .toString()
      .padStart(2, paddingFillString)

    return [date.getUTCFullYear(), month, day].join('-')
  }

  public static monthIndexToString = (monthIndex: number): string => {
    return StringConstants.months[monthIndex]
  }

  public static getShortDateFormat = (date = new Date()): string => {
    const shortMonth = DateStringHelper.monthIndexToString(date.getUTCMonth()).substring(0, 3)
    return `${shortMonth} ${date.getUTCDate()}`
  }

  public static monthYearFormat = (date = new Date()): string => {
    const shortMonth = DateStringHelper.monthIndexToString(date.getUTCMonth()).substring(0, 3)
    return `${shortMonth} ${date.getUTCFullYear()}`
  }

  public static getShortDateWithYearFormat = (date = new Date(Date.now())): string => {
    const shortMonth = DateStringHelper.monthIndexToString(date.getUTCMonth()).substring(0, 3)
    return `${shortMonth} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
  }

  public static getFullDateFormat = (date = new Date(Date.now())): string => {
    const shortMonth = DateStringHelper.monthIndexToString(date.getUTCMonth())
    return `${shortMonth} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
  }

  public static getTodayDateString = (): string => {
    return DateStringHelper.getYYYY_MM_DDString(new Date(Date.now()))
  }

  public static convertDateStringToDateToDateFormat(startDate: Date, timePeriod: string): string {
    if (timePeriod === StringConstants.dailyTimePeriod) {
      const start = this.getYYYY_MM_DDString(startDate)
      return `${start} to ${start}`
    } else if (timePeriod === StringConstants.monthlyTimePeriod) {
      return this.monthDateToDateFormat(startDate)
    } else if (timePeriod === StringConstants.quarterlyTimePeriod) {
      return this.quarterlyDataToDateFormat(startDate)
    }
    return null
  }

  private static monthDateToDateFormat(date: Date): string {
    const start = this.buildStartOfMonthDateString(date)
    const end = this.buildEndOfMonthDateString(date)
    return `${start} to ${end}`
  }

  private static quarterlyDataToDateFormat(date: Date): string {
    const start = this.getYYYY_MM_DDString(DateHelper.getStartDateOfQuarterByDate(date))
    const end = this.getYYYY_MM_DDString(DateHelper.getEndDateOfQuarterByDate(date))
    return `${start} to ${end}`
  }
}

export default DateStringHelper
