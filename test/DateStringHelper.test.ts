import DateHelper from '../src/DateStringHelper'
import StringConstants from '../src/constants/StringConstants'

const realDate = Date.now

beforeAll(() => {
  global.Date.now = jest.fn(() => new Date('2020-10-10T10:20:30Z').getTime())
})

afterAll(() => {
  global.Date.now = realDate
})

describe('test addLeadingZeros', () => {
  test('build 2 digits number string with a 1-digit number', () => {
    const numberString = '5'
    const totalDigits = 2

    const result = DateHelper.addLeadingZeros(numberString, totalDigits)
    expect(result).toBe('05')
  })

  test('build 2 digits number string with a 2-digit number', () => {
    const numberString = '12'
    const totalDigits = 2

    const result = DateHelper.addLeadingZeros(numberString, totalDigits)
    expect(result).toBe('12')
  })
})

describe('test buildEndOfMonthDateString', () => {
  test('build end of month string 1', () => {
    const date = new Date('2020-09-07')
    const result = DateHelper.buildEndOfMonthDateString(date)

    expect(result).toBe('2020-09-30')
  })

  test('build end of month string 2', () => {
    const date = new Date('2020-02-28')
    const result = DateHelper.buildEndOfMonthDateString(date)

    expect(result).toBe('2020-02-29')
  })
})

describe('test buildStartOfMonthDateString', () => {
  test('build start of month string 1', () => {
    const date = new Date('2020-09-07')
    const result = DateHelper.buildStartOfMonthDateString(date)

    expect(result).toBe('2020-09-01')
  })

  test('build start of month string 2', () => {
    const date = new Date('2020-02-28')
    const result = DateHelper.buildStartOfMonthDateString(date)

    expect(result).toBe('2020-02-01')
  })
})

describe('findDateLastNWorkdaysAgoInclusive', () => {
  test('workdays is 0', () => {
    const workdays = 0
    const endDateString = '2020-03-03'
    const result = DateHelper.findDateLastNWorkdaysAgoInclusive(workdays, endDateString)

    expect(result).toBe(null)
  })

  test('no endDateString', () => {
    const workdays = 0
    const endDateString = ''
    const result = DateHelper.findDateLastNWorkdaysAgoInclusive(workdays, endDateString)

    expect(result).toBe(null)
  })

  test('return valid last N workdays starting a weekend', () => {
    const workdays = 3
    const endDateString = '2020-10-03'
    const result = DateHelper.findDateLastNWorkdaysAgoInclusive(workdays, endDateString)

    expect(result).toMatch('2020-09-30')
  })

  test('return valid last N workdays starting a weekday - 1', () => {
    const workdays = 6
    const endDateString = '2020-10-02'
    const result = DateHelper.findDateLastNWorkdaysAgoInclusive(workdays, endDateString)

    expect(result).toMatch('2020-09-25')
  })

  test('return valid last N workdays starting a weekday - 2', () => {
    const workdays = 3
    const endDateString = '2020-10-02'
    const result = DateHelper.findDateLastNWorkdaysAgoInclusive(workdays, endDateString)

    expect(result).toMatch('2020-09-30')
  })
})

describe('test formatOptionalDate', () => {
  test('no optional date', () => {
    const optionalDate = null
    const result = DateHelper.formatOptionalDate(optionalDate)

    expect(result).toBe(null)
  })

  test('with valid optional date - 1', () => {
    const optionalDate = '2020-08-10'
    const result = DateHelper.formatOptionalDate(optionalDate)

    expect(result).toMatch('2020-08-10')
  })
})

describe('test getYYYY_MM_DDString', () => {
  test('getYYYY_MM_DDString - 1', () => {
    const date = new Date('2019-12-30T06:00:00.000Z')
    const result = DateHelper.getYYYY_MM_DDString(date)

    expect(result).toMatch('2019-12-30')
  })

  test('getYYYY_MM_DDString - 2', () => {
    const result = DateHelper.getYYYY_MM_DDString(new Date('2020-10-10'))

    expect(result).toMatch('2020-10-10')
  })

  test('getYYYY_MM_DDString - 3', () => {
    const result = DateHelper.getYYYY_MM_DDString(new Date('2020-10-3'))

    expect(result).toMatch('2020-10-03')
  })
})

describe('test monthIndexToString', () => {
  test('monthIndexToString - 1', () => {
    const monthIndex = 0
    const result = DateHelper.monthIndexToString(monthIndex)

    expect(result).toMatch('January')
  })

  test('monthIndexToString - 1', () => {
    const monthIndex = 11
    const result = DateHelper.monthIndexToString(monthIndex)

    expect(result).toMatch('December')
  })
})

describe('test getTodayDateString', () => {
  test('getTodayDateString', () => {
    const result = DateHelper.getTodayDateString()

    expect(result).toBe('2020-10-10')
  })
})

test('fullDateFormat', () => {
  const result = DateHelper.getFullDateFormat()
  expect(result).toMatch('October 10, 2020')
})

test('getFullDateFormat', () => {
  const result = DateHelper.monthYearFormat(new Date('2020-10-10'))
  expect(result).toMatch('Oct 2020')
})

describe('test getStartAndEndDateByNTimePeriods', () => {
  test('monthly time period', () => {
    const periodType = 'm'
    const timePeriods = 3
    const endDateString = '2020-10-10'
    const result = DateHelper.getStartAndEndDateByNTimePeriods(
      periodType,
      timePeriods,
      endDateString
    )

    expect(result.length).toBe(3)
    expect(result[result.length - 1].endDate).toMatch('2020-10-10')
    expect(result).toEqual([
      { endDate: '2020-08-31', startDate: '2020-08-01' },
      { endDate: '2020-09-30', startDate: '2020-09-01' },
      { endDate: '2020-10-10', startDate: '2020-10-01' }
    ])
  })

  test('daily time period - end date is a workday', () => {
    const periodType = 'd'
    const timePeriods = 2
    const endDateString = '2020-01-01'
    const result = DateHelper.getStartAndEndDateByNTimePeriods(
      periodType,
      timePeriods,
      endDateString
    )

    expect(result.length).toBe(2)
    expect(result[0].endDate).toEqual(result[0].startDate)
    expect(result[1].endDate).toEqual(result[1].startDate)
    expect(result).toEqual([
      { endDate: '2019-12-31', startDate: '2019-12-31' },
      { endDate: '2020-01-01', startDate: '2020-01-01' }
    ])
  })

  test('daily time period - end date is not a workday', () => {
    const periodType = 'd'
    const timePeriods = 2
    const endDateString = '2020-01-04'
    const result = DateHelper.getStartAndEndDateByNTimePeriods(
      periodType,
      timePeriods,
      endDateString
    )

    expect(result.length).toBe(2)
    expect(result[0].endDate).toEqual(result[0].startDate)
    expect(result[1].endDate).toEqual(result[1].startDate)
    expect(result).toEqual([
      { endDate: '2020-01-02', startDate: '2020-01-02' },
      { endDate: '2020-01-03', startDate: '2020-01-03' }
    ])
  })

  test('quarterly time period', () => {
    const periodType = 'q'
    const timePeriods = 4
    const endDateString = '2020-12-31'
    const result = DateHelper.getStartAndEndDateByNTimePeriods(
      periodType,
      timePeriods,
      endDateString
    )

    expect(result.length).toBe(4)
    expect(result).toEqual([
      { endDate: '2020-03-31', startDate: '2020-01-01' },
      { endDate: '2020-06-30', startDate: '2020-04-01' },
      { endDate: '2020-09-30', startDate: '2020-07-01' },
      { endDate: '2020-12-31', startDate: '2020-10-01' }
    ])
  })
})

describe('test getStartDateByTimePeriod', () => {
  test('get monthly time period', () => {
    const date = new Date('2020-03-04')
    const timePeriod = 'm'

    const result = DateHelper.getStartDateByTimePeriod(date, timePeriod)
    expect(result).toBe('2020-03-01')
  })

  test('get daily time period - workday', () => {
    const date = new Date('2020-03-04')
    const timePeriod = 'd'

    const result = DateHelper.getStartDateByTimePeriod(date, timePeriod)
    expect(result).toBe('2020-03-04')
  })

  test('get daily time period - non-workday', () => {
    const date = new Date('2020-03-07')
    const timePeriod = 'd'

    const result = DateHelper.getStartDateByTimePeriod(date, timePeriod)
    expect(result).toBe('2020-03-09')
  })

  test('get quarterly time period', () => {
    const date = new Date('2020-03-04')
    const timePeriod = 'q'

    const result = DateHelper.getStartDateByTimePeriod(date, timePeriod)
    expect(result).toBe('2020-01-01')
  })

  test('invalid time period', () => {
    const date = new Date('2020-03-04')
    const timePeriod = 's'

    const result = DateHelper.getStartDateByTimePeriod(date, timePeriod)
    expect(result).toBe(null)
  })
})

test('getShortDateWithYearFormat', () => {
  const date = new Date('2020-10-10')
  const result = DateHelper.getShortDateWithYearFormat(date)

  expect(result).toBe('Oct 10, 2020')
})

test('getShortDateFormat', () => {
  const date = new Date('2020-10-10')
  const result = DateHelper.getShortDateFormat(date)

  expect(result).toBe('Oct 10')
})

describe('test getDashedDateFormat', () => {
  test('with valid date string', () => {
    const result = DateHelper.getDashedDateFormat('2019-12-30T06:00:00.000Z')

    expect(result).toBe('2019-12-30')
  })

  test('getDashedDateFormat', () => {
    const date = null
    const result = DateHelper.getDashedDateFormat(date)

    expect(result).toBe(null)
  })
})

describe('convert date string to date to date format', () => {
  it('should return null because no valid time was provided', () => {
    const date = new Date('2020-01-01')
    expect(DateHelper.convertDateStringToDateToDateFormat(date, 'invalid')).toEqual(null)
  })

  it('should return proper day string because work day time period was provided', () => {
    const date = '2020-01-01'
    expect(
      DateHelper.convertDateStringToDateToDateFormat(
        new Date(date),
        StringConstants.dailyTimePeriod
      )
    ).toEqual(`${date} to ${date}`)
  })

  it('should return proper day string because day time period was provided', () => {
    const date = '2020-01-01'
    expect(
      DateHelper.convertDateStringToDateToDateFormat(
        new Date(date),
        StringConstants.monthlyTimePeriod
      )
    ).toEqual(`${date} to 2020-01-31`)
  })

  it('should return proper quarterly string because quarterly time period was provided', () => {
    const date = '2020-01-01'
    expect(
      DateHelper.convertDateStringToDateToDateFormat(
        new Date(date),
        StringConstants.quarterlyTimePeriod
      )
    ).toEqual(`${date} to 2020-03-31`)
  })
})
