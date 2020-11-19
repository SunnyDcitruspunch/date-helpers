import DateHelper from '../src/DateHelper'
import DateStringHelper from '../src/DateStringHelper'
import TestHelper from '../src/TestHelper'

const realDate = Date.now

beforeAll(() => {
  global.Date.now = jest.fn(() => new Date('2020-08-14T10:20:30Z').getTime())
})

afterAll(() => {
  global.Date.now = realDate
})

describe('test areDatesOnSameCalendarDate', () => {
  test('2 days are the same', () => {
    const dateA = new Date('2020-03-03')
    const dateB = new Date('2020-03-03')
    const result = DateHelper.areDatesOnSameCalendarDate(dateA, dateB)

    expect(result).toBeTruthy()
  })

  test('2 days are not the same', () => {
    const dateA = new Date('2020-03-03')
    const dateB = new Date('2020-04-03')
    const result = DateHelper.areDatesOnSameCalendarDate(dateA, dateB)

    expect(result).toBeFalsy()
  })
})

describe('test areDateRangesOverlapped', () => {
  test('areDateRangesOverlapped with overlapped date ranges', () => {
    const startA = new Date('2020-01-01')
    const endA = new Date('2020-02-01')
    const startB = new Date('2020-01-03')
    const endB = new Date('2020-01-20')

    const result = DateHelper.areDateRangesOverlapped(startA, endA, startB, endB)
    expect(result).toBeTruthy()
  })

  test('areDateRangesOverlapped with no overlapped date ranges', () => {
    const startA = new Date('2020-01-01')
    const endA = new Date('2020-02-01')
    const startB = new Date('2020-03-03')
    const endB = new Date('2020-03-20')

    const result = DateHelper.areDateRangesOverlapped(startA, endA, startB, endB)
    expect(result).toBeFalsy()
  })

  test('areDateRangesOverlapped with the same date range', () => {
    const startA = new Date('2020-01-01')
    const endA = new Date('2020-02-01')
    const startB = new Date('2020-01-01')
    const endB = new Date('2020-02-01')

    const result = DateHelper.areDateRangesOverlapped(startA, endA, startB, endB)
    expect(result).toBeTruthy()
  })
})

describe('test isDoubleDigit', () => {
  test('number is double digit', () => {
    const number = 22
    const result = DateHelper.isDoubleDigit(number)

    expect(result).toBeTruthy()
  })

  test('number is not double digit', () => {
    const number = 2
    const result = DateHelper.isDoubleDigit(number)

    expect(result).toBeFalsy()
  })
})

describe('test isDateOnOrInDateRange', () => {
  test('Comparison date is within date range', () => {
    const comparisonDate = new Date('2020-02-10')
    const start = new Date('2020-02-01')
    const end = new Date('2020-03-01')

    const result = DateHelper.isDateOnOrInDateRange(comparisonDate, start, end)
    expect(result).toBeTruthy()
  })

  test('Comparison date is not within date range', () => {
    const comparisonDate = new Date('2020-06-10')
    const start = new Date('2020-02-01')
    const end = new Date('2020-03-01')

    const result = DateHelper.isDateOnOrInDateRange(comparisonDate, start, end)
    expect(result).toBeFalsy()
  })
})

describe('test business days between dates', () => {
  test('days between dates 1', () => {
    const startDate = new Date('2020-01-01')
    const endDate = new Date('2019-12-31')
    const daysBetween = DateHelper.numberBusinessDaysInDateRangeInclusive(startDate, endDate)
    expect(daysBetween).toEqual(0)
  })

  test('days between dates 2', () => {
    const startDate = new Date('2019-12-31')
    const endDate = new Date('2020-01-01')
    const daysBetween = DateHelper.numberBusinessDaysInDateRangeInclusive(startDate, endDate)
    // Tuesday & Wednesday
    expect(daysBetween).toEqual(2)
  })

  test('days between dates 3', () => {
    const startDate = new Date('2020-01-03')
    const endDate = new Date('2020-01-5')

    const daysBetween = DateHelper.numberBusinessDaysInDateRangeInclusive(startDate, endDate)
    // Friday to Sunday
    expect(daysBetween).toEqual(1)
  })

  test('days between dates 4', () => {
    const startDate = new Date('2020-01-03')
    const endDate = new Date('2020-01-12')
    const daysBetween = DateHelper.numberBusinessDaysInDateRangeInclusive(startDate, endDate)
    // Friday through next week till Sunday
    expect(daysBetween).toEqual(6)
  })

  test('days between dates 5', () => {
    const startDate = new Date('2020-01-4')
    const endDate = new Date('2020-01-5')
    const daysBetween = DateHelper.numberBusinessDaysInDateRangeInclusive(startDate, endDate)
    // Friday through next week till Sunday
    expect(daysBetween).toEqual(0)
  })

  test('days between dates 6', () => {
    const startDate = new Date('2019-12-29')
    const endDate = new Date('2020-01-31')
    const daysBetween = DateHelper.numberBusinessDaysInDateRangeInclusive(startDate, endDate)
    // Dec. 29, 2019 (Sunday) through Jan. 31 2020 (Friday)
    expect(daysBetween).toEqual(25)
  })
})

test('removeTimestampFromDate', () => {
  const date = new Date('2020-10-10')

  const result = DateHelper.removeTimestampFromDate(date)
  expect(result.toString()).toMatch('Fri Oct 09 2020 18:00:00 GMT-0600 (Mountain Daylight Time)')
})

test('isYYYY_MM_DD_string', () => {
  const date = '2020-10-10'

  const result = DateHelper.isYYYY_MM_DD_string(date)
  expect(result).toBeTruthy()
})

describe('areDatesAdjacent', () => {
  test('2 dates are adjacent', () => {
    const dateA = new Date('2020-01-01')
    const dateB = new Date('2020-01-02')

    const result = DateHelper.areDatesAdjacent(dateA, dateB)
    expect(result).toBeTruthy()
  })

  test('2 dates are not adjacent', () => {
    const dateA = new Date('2020-01-01')
    const dateB = new Date('2020-01-05')

    const result = DateHelper.areDatesAdjacent(dateA, dateB)
    expect(result).toBeFalsy()
  })
})

describe('Test totalDaysIncludingStartOrEndDate', () => {
  test('totalDaysIncludingStartOrEndDate - 1', () => {
    const startDate = new Date('2019-12-30')
    const endDate = new Date('2020-01-10')

    const result = DateHelper.totalDaysIncludingStartOrEndDate(startDate, endDate)
    expect(result).toEqual(11)
  })

  test('totalDaysIncludingStartOrEndDate - 2', () => {
    const startDate = new Date('2020-03-30T06:00:00.000Z')
    const endDate = new Date('2020-04-03T06:00:00.000Z')

    const result = DateHelper.totalDaysIncludingStartOrEndDate(startDate, endDate)
    expect(result).toEqual(4)
  })

  test('totalDaysIncludingStartOrEndDate - 3', () => {
    const startDate = new Date('2020-08-31T06:00:00.000Z')
    const endDate = new Date('2020-10-05T06:00:00.000Z')

    const result = DateHelper.totalDaysIncludingStartOrEndDate(startDate, endDate)
    expect(result).toEqual(35)
  })

  test('totalDaysIncludingStartOrEndDate should return 1 day if start and end date are the same', () => {
    const startDate = new Date('2020-08-31T06:00:00.000Z')
    const endDate = new Date('2020-08-31T06:00:00.000Z')

    const result = DateHelper.totalDaysIncludingStartOrEndDate(startDate, endDate)
    expect(result).toEqual(1)
  })
})

describe('Test totalDaysExcludingStartAndEndDate', () => {
  test('totalDaysExcludingStartAndEndDate - 1', () => {
    const startDate = new Date('2019-12-30T06:00:00.000Z')
    const endDate = new Date('2020-01-10T06:00:00.000Z')

    const result = DateHelper.totalDaysExcludingStartAndEndDate(startDate, endDate)
    expect(result).toEqual(10)
  })

  test('totalDaysExcludingStartAndEndDate - 2', () => {
    const startDate = new Date('2020-03-30T06:00:00.000Z')
    const endDate = new Date('2020-04-03T06:00:00.000Z')

    const result = DateHelper.totalDaysExcludingStartAndEndDate(startDate, endDate)
    expect(result).toEqual(3)
  })

  test('totalDaysExcludingStartAndEndDate - 3', () => {
    const startDate = new Date('2020-03-30T06:00:00.000Z')
    const endDate = new Date('2020-03-31T06:00:00.000Z')

    const result = DateHelper.totalDaysExcludingStartAndEndDate(startDate, endDate)
    expect(result).toEqual(0)
  })
})

describe('Test getMillisecondsInMonth', () => {
  test('August 2020', () => {
    const year = 2020
    const month = 8
    const date = 31

    const result = DateHelper.getMillisecondsInMonth(year, month, date)

    expect(result).toEqual([1596261600000, 1598853600000])
    expect(new Date(result[0]).toString()).toEqual(
      'Sat Aug 01 2020 00:00:00 GMT-0600 (Mountain Daylight Time)'
    )
    expect(new Date(result[1]).toString()).toEqual(
      'Mon Aug 31 2020 00:00:00 GMT-0600 (Mountain Daylight Time)'
    )
  })

  test('September 2019', () => {
    const year = 2019
    const month = 9
    const date = 30

    const result = DateHelper.getMillisecondsInMonth(year, month, date)

    expect(result).toEqual([1567317600000, 1569823200000])
    expect(new Date(result[0]).toString()).toEqual(
      'Sun Sep 01 2019 00:00:00 GMT-0600 (Mountain Daylight Time)'
    )
    expect(new Date(result[1]).toString()).toEqual(
      'Mon Sep 30 2019 00:00:00 GMT-0600 (Mountain Daylight Time)'
    )
  })
})

describe('Test getDateByYYYY_MM_DDString', () => {
  test('return valid date string', () => {
    const date = '2019-01-01'

    const result = DateHelper.getDateByYYYY_MM_DDString(date)
    expect(result.toString().includes('Tue Jan 01 2019 00:00:00')).toBeTruthy()
  })
})

describe('Test getNewDateByAddingDays', () => {
  test('get new date across year end', () => {
    const date = new Date('2019-12-30T06:00:00.000Z')
    const days = 20

    const result = DateHelper.getNewDateByAddingDays(date, days)
    expect(result.toString().includes('Sun Jan 19 2020 00:00:00')).toBeTruthy()
  })

  test('get new date across months', () => {
    const date = new Date('2019-08-28T06:00:00.000Z')
    const days = 5

    const result = DateHelper.getNewDateByAddingDays(date, days)
    expect(result.toString()).toEqual('Mon Sep 02 2019 00:00:00 GMT-0600 (Mountain Daylight Time)')
  })

  test('subtracting one day', () => {
    const date = new Date('2020-01-01')
    const days = -1

    const result = DateHelper.getNewDateByAddingDays(date, days)
    expect(result.toString()).toEqual('Tue Dec 31 2019 00:00:00 GMT-0700 (Mountain Standard Time)')
  })
})

describe('chronological sort of objects', () => {
  it('should return objects in chronological order', () => {
    const dateObjects = [
      { date: '2020-01-01' },
      { date: '2020-01-04' },
      { date: '2020-01-02' },
      { date: '2020-01-05' },
      { date: '2020-01-03' }
    ]
    const sorted = TestHelper.sortObjectListByDateChronologically(dateObjects, 'date')
    expect(sorted[0]['date']).toEqual('2020-01-01')
    expect(sorted[1]['date']).toEqual('2020-01-02')
    expect(sorted[2]['date']).toEqual('2020-01-03')
    expect(sorted[3]['date']).toEqual('2020-01-04')
    expect(sorted[4]['date']).toEqual('2020-01-05')
  })

  it('should return null because a prop that is not on the object is passed in', () => {
    const objs = [
      { date: '2020-01-01' },
      { date: '2020-01-04' },
      { date: '2020-01-02' },
      { date: '2020-01-05' },
      { date: '2020-01-03' }
    ]
    const sorted = TestHelper.sortObjectListByDateChronologically(objs, 'not a prop')
    expect(sorted).toEqual(null)
  })

  it('should return null because a prop that is not on all objects is passed in', () => {
    const objs = [
      { date: '2020-01-01' },
      { date: '2020-01-04' },
      { date: '2020-01-02' },
      { date: '2020-01-05' },
      { woops: '2020-01-03' }
    ]
    const sorted = TestHelper.sortObjectListByDateChronologically(objs, 'date')
    expect(sorted).toEqual(null)
  })
})

describe('DateHelper.isDateOnOrBeforeDate(dateA, dateB)', () => {
  it("should return true when dateA's year is earlier than dateB's", () => {
    expect(DateHelper.isDateOnOrBeforeDate(new Date('2019-12-31'), new Date('2020-01-01'))).toBe(
      true
    )
  })
  it("should return true when dateA's year is the same as dateB's and dateA's month is earlier", () => {
    expect(DateHelper.isDateOnOrBeforeDate(new Date('2020-01-31'), new Date('2020-12-01'))).toBe(
      true
    )
  })
  it('should return true when dateA and dateB are the same', () => {
    expect(DateHelper.isDateOnOrBeforeDate(new Date('2020-01-01'), new Date('2020-01-01'))).toBe(
      true
    )
  })
  it("should return false when dateA's year is later than dateB's", () => {
    expect(DateHelper.isDateOnOrBeforeDate(new Date('2021-01-01'), new Date('2020-06-15'))).toBe(
      false
    )
  })
  it("should return false when dateA's month is later than dateB's but their year is the same", () => {
    expect(DateHelper.isDateOnOrBeforeDate(new Date('2020-08-01'), new Date('2020-06-15'))).toBe(
      false
    )
  })
  it("should return false when dateA's day of the month is later than dateB's but their year and month are the same", () => {
    expect(DateHelper.isDateOnOrBeforeDate(new Date('2020-05-27'), new Date('2020-05-15'))).toBe(
      false
    )
  })
})

describe('test getLastDayOfMonthFormate', () => {
  test('return valid date object', () => {
    const date = new Date('2020-10-10')
    const result = DateHelper.getLastDayOfMonthFromDate(date)

    expect(result.toString().includes('Oct 31 2020')).toBeTruthy()
  })
})

describe('get Following Day', () => {
  it('should return following day', () => {
    expect(
      DateStringHelper.getYYYY_MM_DDString(DateHelper.getFollowingDay(new Date('2019-12-31')))
    ).toEqual('2020-01-01')
  })
})

describe('areDatesAdjacent', () => {
  it('should return true when given two adjacent dates', () => {
    expect(
      DateHelper.areDatesAdjacent(
        new Date('2020-07-19T06:00:00.000Z'),
        new Date('2020-07-20T06:00:00.000Z')
      )
    ).toBe(true)
  })

  it('should return false when given two dates that are more than one day apart', () => {
    expect(
      DateHelper.areDatesAdjacent(
        new Date('2020-07-18T06:00:00.000Z'),
        new Date('2020-07-20T06:00:00.000Z')
      )
    ).toBe(false)
  })
})

describe('Get Earlier Date', () => {
  it('should return the right answer', () => {
    expect(DateHelper.getEarlierDate(new Date('2020-01-02'), new Date('2020-01-01'))).toEqual(
      new Date('2020-01-01')
    )
    expect(DateHelper.getEarlierDate(new Date('2020-01-01'), new Date('2020-01-02'))).toEqual(
      new Date('2020-01-01')
    )
    expect(DateHelper.getEarlierDate(new Date('2020-01-01'), new Date('2020-01-01'))).toEqual(
      new Date('2020-01-01')
    )
  })
})

describe('Tomorrow', () => {
  it('should return tomorrow', () => {
    expect(DateStringHelper.getYYYY_MM_DDString(DateHelper.getTomorrow())).toBe('2020-08-15')
  })
})

describe('One Year Ago Today', () => {
  it('should return 365 calendar days ago', () => {
    expect(DateStringHelper.getYYYY_MM_DDString(DateHelper.oneYearAgoToday())).toBe('2019-08-15')
  })
})

describe('Get Year Month Day String', () => {
  it('should work', () => {
    expect(DateStringHelper.getYYYY_MM_DDString(new Date('2020-12-01'))).toBe('2020-12-01')
  })
})

describe('UTC to MST hour conversion', () => {
  it('Should convert hour correctly', () => {
    expect(DateHelper.getUtcHourFromMstHour(0)).toBe(6)
    expect(DateHelper.getUtcHourFromMstHour(1)).toBe(7)
    expect(DateHelper.getUtcHourFromMstHour(6)).toBe(12)
    expect(DateHelper.getUtcHourFromMstHour(17)).toBe(23)
    expect(DateHelper.getUtcHourFromMstHour(18)).toBe(0)
    expect(DateHelper.getUtcHourFromMstHour(19)).toBe(1)
  })
})

describe('Test hasWorkedFewerDaysThanTimePeriod', () => {
  it('Test work more days than time period', () => {
    const startDate = new Date('2020-01-01')
    const comparisonDate = new Date('2020-02-10')
    const dayBack = 20

    const result = DateHelper.hasWorkedFewerDaysThanTimePeriod(startDate, comparisonDate, dayBack)
    expect(result).toBeFalsy()
  })

  it('Test work fewer days than time period', () => {
    const startDate = new Date('2020-01-01')
    const comparisonDate = new Date('2020-01-10')
    const dayBack = 20

    const result = DateHelper.hasWorkedFewerDaysThanTimePeriod(startDate, comparisonDate, dayBack)
    expect(result).toBeTruthy()
  })

  it('Test work same days as the time period', () => {
    const startDate = new Date('2020-01-01')
    const comparisonDate = new Date('2020-01-10')
    const dayBack = 9

    const result = DateHelper.hasWorkedFewerDaysThanTimePeriod(startDate, comparisonDate, dayBack)
    expect(result).toBeFalsy()
  })
})

describe('Test isToday', () => {
  test('date is today', () => {
    const date = new Date(Date.now())
    const result = DateHelper.isToday(date)

    expect(result).toBeTruthy()
  })

  test('date is not today', () => {
    const date = new Date('2020-09-01')
    const result = DateHelper.isToday(date)

    expect(result).toBeFalsy()
  })
})

describe('Test isValidDate', () => {
  test('date is valid', () => {
    const date = new Date('2020-03-03')
    const result = DateHelper.isValidDate(date)

    expect(result).toBeTruthy()
  })

  test('date is valid', () => {
    const date = new Date('2020-0303')
    const result = DateHelper.isValidDate(date)

    expect(result).toBeFalsy()
  })
})

describe('Test isWorkDay', () => {
  test('date is a workday', () => {
    const date = new Date('2020-10-26')
    const result = DateHelper.isWorkDay(date)

    expect(result).toBeTruthy()
  })

  test('date is not a workday', () => {
    const date = new Date('2020-10-25')
    const result = DateHelper.isWorkDay(date)

    expect(result).toBeFalsy()
  })
})

describe('Test isYesterday', () => {
  test('date is yesterday', () => {
    const date = new Date('2020-08-13')
    const result = DateHelper.isYesterday(date)

    expect(result).toBeTruthy()
  })

  test('date is not yesterday', () => {
    const date = new Date('2020-10-25')
    const result = DateHelper.isYesterday(date)

    expect(result).toBeFalsy()
  })
})

describe('test getDaysInDateRange', () => {
  test("should return 1 if a date range's start and end date are the same", () => {
    const date = new Date('2020-08-08')
    const totalDaysInDateRange = 1
    const result = DateHelper.getDaysInDateRange(date, date)

    expect(result).toBe(totalDaysInDateRange)
  })

  test('date range within a month', () => {
    const startDate = new Date('2020-08-03')
    const endDate = new Date('2020-08-08')
    const totalDaysInDateRange = 6
    const result = DateHelper.getDaysInDateRange(startDate, endDate)

    expect(result).toBe(totalDaysInDateRange)
  })

  test('date range across different months', () => {
    const startDate = new Date('2020-07-30')
    const endDate = new Date('2020-08-08')
    const totalDaysInDateRange = 10
    const result = DateHelper.getDaysInDateRange(startDate, endDate)

    expect(result).toBe(totalDaysInDateRange)
  })

  test('should return null if end date is earlier than the start date', () => {
    const startDate = new Date('2020-08-30')
    const endDate = new Date('2020-07-08')
    const totalDaysInDateRange = null
    const result = DateHelper.getDaysInDateRange(startDate, endDate)

    expect(result).toBe(totalDaysInDateRange)
  })

  test('should return two if the days are only one apart', () => {
    const startDate = new Date('2020-07-07')
    const endDate = new Date('2020-07-08')
    const totalDaysInDateRange = 2
    const result = DateHelper.getDaysInDateRange(startDate, endDate)

    expect(result).toBe(totalDaysInDateRange)
  })
})

describe('getDateNWorkdaysFromDate', () => {
  it('should handle weekends correctly', () => {
    const friday = new Date('2020-08-21')
    const wednesday = new Date('2020-08-26')
    expect(DateHelper.getDateNWorkdaysFromDate(friday, 4)).toEqual(wednesday)
  })
  it('should not count the weekend if the current day is a weekend', () => {
    const saturday = new Date('2020-08-22')
    const wednesday = new Date('2020-08-26')
    expect(DateHelper.getDateNWorkdaysFromDate(saturday, 3)).toEqual(wednesday)
  })
})

describe('test getDateFromWorkDaysAgo', () => {
  test('getDateFromWorkDaysAgo - start date is not a work day', () => {
    const workDaysAgo = 3
    const date = new Date('2020-11-01')
    const result = DateHelper.getDateFromNumWorkDaysAgo(workDaysAgo, date)

    expect(result.toString()).toMatch('Wed Oct 28 2020 00:00:00 GMT-0600 (Mountain Daylight Time)')
  })

  test('getDateFromWorkDaysAgo - start date is a work day - 1', () => {
    const workDaysAgo = 3
    const date = new Date('2020-10-02')
    const result = DateHelper.getDateFromNumWorkDaysAgo(workDaysAgo, date)

    expect(result.toString()).toMatch('Tue Sep 29 2020 00:00:00 GMT-0600 (Mountain Daylight Time)')
  })

  test('getDateFromWorkDaysAgo - start date is a work day - 2', () => {
    const workDaysAgo = 3
    const date = new Date('2020-09-28')
    const result = DateHelper.getDateFromNumWorkDaysAgo(workDaysAgo, date)

    expect(result.toString()).toMatch('Wed Sep 23 2020 00:00:00 GMT-0600 (Mountain Daylight Time)')
  })
})

describe('test getQuarterNumber', () => {
  test('get quarter number - 1', () => {
    const date = new Date('2020-03-31')
    const result = DateHelper.getQuarterNumber(date)

    expect(result).toBe(1)
  })

  test('get quarter number - 2', () => {
    const date = new Date('2020-10-31')
    const result = DateHelper.getQuarterNumber(date)

    expect(result).toBe(4)
  })
})

describe('test getDaysInMonth', () => {
  test('get days in month - 1', () => {
    const date = new Date('2020-02-29')
    const result = DateHelper.getDaysInMonth(date)

    expect(result).toBe(29)
  })

  test('get days in month - 2', () => {
    const date = new Date('2020-12-09')
    const result = DateHelper.getDaysInMonth(date)

    expect(result).toBe(31)
  })
})

describe('test getEndDateOfQuarterByDate', () => {
  test('getEndDateOfQuarterByDate - 1', () => {
    const date = new Date('2020-10-20')
    const result = DateHelper.getEndDateOfQuarterByDate(date)

    expect(result.toString().includes('Dec 31 2020')).toBeTruthy()
  })

  test('getEndDateOfQuarterByDate - 2', () => {
    const date = new Date('2020-03-31')
    const result = DateHelper.getEndDateOfQuarterByDate(date)

    expect(result.toString().includes('Mar 31 2020')).toBeTruthy()
  })

  test('getEndDateOfQuarterByDate - 3', () => {
    const date = new Date('2020-01-01')
    const result = DateHelper.getEndDateOfQuarterByDate(date)

    expect(result.toString().includes('Mar 31 2020')).toBeTruthy()
  })
})

describe('test getPreviousWorkDay', () => {
  test('given date is not a work day', () => {
    const date = new Date('2020-11-01')
    const result = DateHelper.getPreviousWorkDay(date)

    expect(result).toEqual(new Date('2020-10-30'))
  })

  test('given date is a work day - 1', () => {
    const date = new Date('2020-11-02')
    const result = DateHelper.getPreviousWorkDay(date)

    expect(result).toEqual(new Date('2020-10-30'))
  })

  test('given date is a work day - 2', () => {
    const date = new Date('2020-11-03')
    const result = DateHelper.getPreviousWorkDay(date)

    expect(result.toString().includes('Nov 01 2020')).toBeTruthy()
  })
})

test('getToday', () => {
  const result = DateHelper.getToday()
  expect(result.toString().includes('Aug 14 2020')).toBeTruthy()
})

describe('test getStartDateOfQuarterByDate', () => {
  test('getStartDateOfQuarterByDate', () => {
    const date = new Date('2020-01-02')
    const result = DateHelper.getStartDateOfQuarterByDate(date)

    expect(result.toString().includes('Jan 01 2020')).toBeTruthy()
  })

  it('should work for the same for any day of the month', () => {
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-01-01'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-01-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-01-15'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-01-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-01-31'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-01-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-02-01'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-01-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-02-15'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-01-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-02-29'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-01-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-03-01'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-01-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-03-15'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-01-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-03-31'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-01-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-04-01'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-04-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-04-15'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-04-01')))
    expect(
      DateStringHelper.getYYYY_MM_DDString(
        DateHelper.getStartDateOfQuarterByDate(new Date('2020-04-30'))
      )
    ).toEqual(DateStringHelper.getYYYY_MM_DDString(new Date('2020-04-01')))
  })
})

describe('test numberOfDistinctMonthsInPeriod', () => {
  test('Get months between dates 1', async () => {
    const startDate = new Date('2020-01-01')
    const endDate = new Date('2020-01-31')
    const res = DateHelper.numberOfDistinctMonthsInPeriod(startDate, endDate)
    expect(res).toEqual(1)
  })

  test('Get months between dates 2', async () => {
    const startDate = new Date('2020-01-01')
    const endDate = new Date('2020-02-29')
    const res = DateHelper.numberOfDistinctMonthsInPeriod(startDate, endDate)
    expect(res).toEqual(2)
  })

  test('Get months between dates 3', async () => {
    const startDate = new Date('2020-01-01')
    const endDate = new Date('2020-05-1')
    const res = DateHelper.numberOfDistinctMonthsInPeriod(startDate, endDate)
    expect(res).toEqual(5)
  })

  test('Get months between dates 4', async () => {
    const startDate = new Date('2019-01-01')
    const endDate = new Date('2020-02-29')
    const res = DateHelper.numberOfDistinctMonthsInPeriod(startDate, endDate)
    expect(res).toEqual(14)
  })

  test('Get months between dates 5', async () => {
    const startDate = new Date('2019-12-01')
    const endDate = new Date('2020-02-29')
    const res = DateHelper.numberOfDistinctMonthsInPeriod(startDate, endDate)
    expect(res).toEqual(3)
  })
})

describe('test doMonthsCrossQuarterBoundary', () => {
  test('do months cross quarter boundary - 1', async () => {
    const startDate = new Date('2020-01-05')
    const endDate = new Date('2020-02-06')
    const res = DateHelper.doMonthsCrossQuarterBoundary(
      startDate.getUTCMonth(),
      endDate.getUTCMonth(),
      startDate.getUTCFullYear(),
      endDate.getUTCFullYear()
    )
    expect(res).toEqual(false)
  })

  test('do months cross quarter boundary - 2', async () => {
    const startDate = new Date('2019-12-05')
    const endDate = new Date('2020-01-06')
    const res = DateHelper.doMonthsCrossQuarterBoundary(
      startDate.getUTCMonth(),
      endDate.getUTCMonth(),
      startDate.getUTCFullYear(),
      endDate.getUTCFullYear()
    )
    expect(res).toEqual(true)
  })

  test('do months cross quarter boundary - 3', async () => {
    const startDate = new Date('2020-01-05')
    const endDate = new Date('2020-03-29')
    const res = DateHelper.doMonthsCrossQuarterBoundary(
      startDate.getUTCMonth(),
      endDate.getUTCMonth(),
      startDate.getUTCFullYear(),
      endDate.getUTCFullYear()
    )
    expect(res).toEqual(false)
  })

  test('do months cross quarter boundary - 4', async () => {
    const startDate = new Date('2019-01-05')
    const endDate = new Date('2020-10-06')
    const res = DateHelper.doMonthsCrossQuarterBoundary(
      startDate.getUTCMonth(),
      endDate.getUTCMonth(),
      startDate.getUTCFullYear(),
      endDate.getUTCFullYear()
    )
    expect(res).toEqual(true)
  })

  test('do months cross quarter boundary - 5', async () => {
    const startDate = new Date('2020-01-05')
    const endDate = new Date('2020-10-06')
    const res = DateHelper.doMonthsCrossQuarterBoundary(
      startDate.getUTCMonth(),
      endDate.getUTCMonth(),
      startDate.getUTCFullYear(),
      endDate.getUTCFullYear()
    )
    expect(res).toEqual(true)
  })

  test('do months cross quarter boundary - 6', async () => {
    const startDate = new Date('2020-03-02')
    const endDate = new Date('2020-04-29')
    const res = DateHelper.doMonthsCrossQuarterBoundary(
      startDate.getUTCMonth(),
      endDate.getUTCMonth(),
      startDate.getUTCFullYear(),
      endDate.getUTCFullYear()
    )
    expect(res).toEqual(true)
  })

  test('start year smaller than end year', () => {
    const startMonth = 2
    const endMonth = 9
    const startYear = 2020
    const endYear = 2021
    const result = DateHelper.doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear)

    expect(result).toBeTruthy()
  })

  test('end year smaller than start year', () => {
    const startMonth = 2
    const endMonth = 9
    const startYear = 2020
    const endYear = 2019
    const result = DateHelper.doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear)

    expect(result).toBeFalsy()
  })

  test('months cross quarter boundary', () => {
    const startMonth = 2
    const endMonth = 9
    const startYear = 2020
    const endYear = 2020
    const result = DateHelper.doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear)

    expect(result).toBeTruthy()
  })

  test('months do not cross quarter boundary', () => {
    const startMonth = 0
    const endMonth = 2
    const startYear = 2020
    const endYear = 2020
    const result = DateHelper.doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear)

    expect(result).toBeFalsy()
  })

  test('months do not cross quarter boundary', () => {
    const startMonth = 4
    const endMonth = 5
    const startYear = 2020
    const endYear = 2020
    const result = DateHelper.doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear)

    expect(result).toBeFalsy()
  })

  test('months cross quarter boundary and cross year', () => {
    const startMonth = 0
    const endMonth = 2
    const startYear = 2020
    const endYear = 2021
    const result = DateHelper.doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear)

    expect(result).toBeTruthy()
  })

  test('months cross quarter boundary and cross year - 1', () => {
    const startMonth = 4
    const endMonth = 6
    const startYear = 2020
    const endYear = 2020
    const result = DateHelper.doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear)

    expect(result).toBeTruthy()
  })

  test('months cross quarter boundary and cross year - 2', () => {
    const startMonth = 10
    const endMonth = 2
    const startYear = 2020
    const endYear = 2021
    const result = DateHelper.doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear)

    expect(result).toBeTruthy()
  })

  test('months cross quarter boundary and cross year - 3', () => {
    const startMonth = 2
    const endMonth = 8
    const startYear = 2019
    const endYear = 2020
    const result = DateHelper.doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear)

    expect(result).toBeTruthy()
  })

  test("start year earlier than end year, start month larger than Q1's start month, and end month equals than Q1's start month", () => {
    const startMonth = 2
    const endMonth = 0
    const startYear = 2019
    const endYear = 2020
    const result = DateHelper.doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear)

    expect(result).toBeTruthy()
  })
})

describe('test getQuartersInRange', () => {
  test('get num quarters - 1', async () => {
    const res = DateHelper.getQuartersInRange('2020-03-02', '2020-04-29')
    expect(res).toEqual(2)
  })

  test('get num quarters - 2', async () => {
    const res = DateHelper.getQuartersInRange('2020-01-02', '2020-03-29')
    expect(res).toEqual(1)
  })

  test('get num quarters - 3', async () => {
    const res = DateHelper.getQuartersInRange('2019-12-02', '2020-04-29')
    expect(res).toEqual(3)
  })

  test('get num quarters - 4', async () => {
    const res = DateHelper.getQuartersInRange('2020-03-02', '2020-07-29')
    expect(res).toEqual(3)
  })

  test('get num quarters - 5', async () => {
    const res = DateHelper.getQuartersInRange('2020-03-02', '2020-09-29')
    expect(res).toEqual(3)
  })

  test('get num quarters - 6', async () => {
    const res = DateHelper.getQuartersInRange('2020-03-29', '2020-09-1')
    expect(res).toEqual(3)
  })

  test('get num quarters - 7', async () => {
    const res = DateHelper.getQuartersInRange('2018-01-02', '2020-10-02')
    expect(res).toEqual(12)
  })

  test('get num quarters - end date is earlier than start date', async () => {
    const res = DateHelper.getQuartersInRange('2020-01-02', '2007-10-02')
    expect(res).toEqual(0)
  })
})

describe('test getMostRecentDate', () => {
  it('should return the most recent date among 3 distinct dates', () => {
    const dates = [
      new Date('2019-12-31'),
      new Date('2020-01-01'),
      new Date('2019-12-31'),
      new Date('2020-01-01'),
      new Date('2019-12-30')
    ]
    const res = DateHelper.getMostRecentDate(dates)
    expect(DateStringHelper.getYYYY_MM_DDString(res)).toEqual(
      DateStringHelper.getYYYY_MM_DDString(new Date('2020-01-01'))
    )
  })
})

describe('Test isDateInDateRangeInclusive()', () => {
  it('should return true for a date between the range', () => {
    const comparisonDate = new Date('2020-01-10')
    const start = new Date('2020-01-01')
    const end = new Date('2020-01-31')

    const result = DateHelper.isDateInDateRangeInclusive(comparisonDate, start, end)
    expect(result).toEqual(true)
  })

  it('should return false for a date outside the range', () => {
    const comparisonDate = new Date('2020-02-10')
    const start = new Date('2020-01-01')
    const end = new Date('2020-01-31')

    const result = DateHelper.isDateInDateRangeInclusive(comparisonDate, start, end)
    expect(result).toEqual(false)
  })

  it('should return true for a date equal to the start', () => {
    const comparisonDate = new Date('2020-01-01')
    const start = new Date('2020-01-01')
    const end = new Date('2020-01-31')

    const result = DateHelper.isDateInDateRangeInclusive(comparisonDate, start, end)
    expect(result).toEqual(true)
  })

  it('should return true for a date equal to the end', () => {
    const comparisonDate = new Date('2020-01-31')
    const start = new Date('2020-01-01')
    const end = new Date('2020-01-31')

    const result = DateHelper.isDateInDateRangeInclusive(comparisonDate, start, end)
    expect(result).toEqual(true)
  })

  it('should return false for a date one day before start', () => {
    const comparisonDate = new Date('2019-12-31')
    const start = new Date('2020-01-01')
    const end = new Date('2020-01-31')

    const result = DateHelper.isDateInDateRangeInclusive(comparisonDate, start, end)
    expect(result).toEqual(false)
  })

  it('should return false for a date one day after end', () => {
    const comparisonDate = new Date('2020-02-01')
    const start = new Date('2020-01-01')
    const end = new Date('2020-01-31')

    const result = DateHelper.isDateInDateRangeInclusive(comparisonDate, start, end)
    expect(result).toEqual(false)
  })
})

describe('Get Later Date', () => {
  it('should return the right answer', () => {
    expect(DateHelper.getLaterDate(new Date('2020-01-02'), new Date('2020-01-01'))).toEqual(
      new Date('2020-01-02')
    )
    expect(DateHelper.getLaterDate(new Date('2020-01-01'), new Date('2020-01-02'))).toEqual(
      new Date('2020-01-02')
    )
    expect(DateHelper.getLaterDate(new Date('2020-01-01'), new Date('2020-01-01'))).toEqual(
      new Date('2020-01-01')
    )
  })
})

describe('test monthsBetweenDates', () => {
  test('dates are in the same year', () => {
    const startDate = new Date('2020-03-03')
    const endDate = new Date('2020-06-09')
    const result = DateHelper.monthsBetweenDates(startDate, endDate)

    expect(result).toBe(3)
  })

  test('dates are in 2 different years', () => {
    const startDate = new Date('2019-03-03')
    const endDate = new Date('2020-01-09')
    const result = DateHelper.monthsBetweenDates(startDate, endDate)

    expect(result).toBe(10)
  })

  test('dates are in 2 different years - 2', () => {
    const startDate = new Date('2019-03-03')
    const endDate = new Date('2020-02-09')
    const result = DateHelper.monthsBetweenDates(startDate, endDate)

    expect(result).toBe(11)
  })
})

test('getPerviousDate', () => {
  const date = new Date('2020-03-09')
  const result = DateHelper.getPreviousDate(date)

  expect(result.toString().includes('Mar 08 2020')).toBeTruthy()
})

test('getPerviousMonth', () => {
  const date = new Date('2020-03-09')
  const result = DateHelper.getPreviousMonth(date)

  expect(result.toString().includes('Feb 09 2020')).toBeTruthy()
})

test('getPreviousYear', () => {
  const result = DateHelper.getPreviousYear()
  expect(result.toString().includes('Aug 14 2019')).toBeTruthy()
})

const workDayScale = 0
const weekScale = 1
const monthScale = 2
describe('test reverseScale90DayNumber', () => {
  test('return default case', () => {
    const scaleNumber = 4
    const result = DateHelper.reverseScale90DayNumber(1, scaleNumber)
    expect(result).toBe(1)
  })

  test('day scale', () => {
    const result = DateHelper.reverseScale90DayNumber(1, workDayScale)
    expect(result).toBe(61.890410958904106)
  })

  test('week scale', () => {
    const result = DateHelper.reverseScale90DayNumber(1, weekScale)
    expect(result).toBe(12.8571)
  })

  test('month scale', () => {
    const result = DateHelper.reverseScale90DayNumber(1, monthScale)
    expect(result).toBe(2.9589)
  })
})

describe('test scale90DayNumber', () => {
  test('workDay scale', () => {
    const result = DateHelper.scale90DayNumber(2, workDayScale)

    expect(result).toBe(0.032315183709606024)
  })

  test('week scale', () => {
    const result = DateHelper.scale90DayNumber(1, weekScale)

    expect(result).toBe(0.07777803703790123)
  })

  test('month scale', () => {
    const result = DateHelper.scale90DayNumber(1, monthScale)

    expect(result).toBe(0.337963432356619)
  })
})
