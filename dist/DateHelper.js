import DateConstants from './constants/DateConstants';
import DateStringHelper from './DateStringHelper';
class DateHelper {
    static areDatesOnSameCalendarDate(dateA, dateB) {
        return (DateStringHelper.getYYYY_MM_DDString(dateA) === DateStringHelper.getYYYY_MM_DDString(dateB));
    }
    static areDatesAdjacent(dateA, dateB) {
        const earlierDate = dateA < dateB ? dateA : dateB;
        const laterDate = dateA < dateB ? dateB : dateA;
        const dateAfterEarlierDate = new Date(DateStringHelper.getYYYY_MM_DDString(earlierDate));
        dateAfterEarlierDate.setUTCDate(earlierDate.getUTCDate() + 1);
        return this.areDatesOnSameCalendarDate(dateAfterEarlierDate, laterDate);
    }
    static totalDaysIncludingStartOrEndDate(startDate, endDate) {
        // @ts-ignore
        const milliSeconds = endDate - startDate;
        const seconds = milliSeconds / DateConstants.millisecondsInASecond;
        const days = seconds / DateConstants.secondsInADay;
        const daysBetweenDates = Math.floor(days);
        return daysBetweenDates || daysBetweenDates + 1;
    }
    static totalDaysExcludingStartAndEndDate(startDate, endDate) {
        // @ts-ignore
        const milliSeconds = endDate - new Date(startDate).setDate(startDate.getDate() + 1);
        const seconds = milliSeconds / DateConstants.millisecondsInASecond;
        const days = seconds / DateConstants.secondsInADay;
        const daysBetweenDates = Math.floor(days);
        return daysBetweenDates;
    }
    static areDateRangesOverlapped(startA, endA, startB, endB) {
        const aStartsWithinB = DateHelper.isDateOnOrInDateRange(startA, startB, endB);
        const aEndsWithinB = DateHelper.isDateOnOrInDateRange(endA, startB, endB);
        const bStartsWithinA = DateHelper.isDateOnOrInDateRange(startB, startA, endA);
        const bEndsWithinA = DateHelper.isDateOnOrInDateRange(endB, startA, endA);
        return aStartsWithinB || aEndsWithinB || bStartsWithinA || bEndsWithinA;
    }
    static findQuarterByDate(date) {
        const month = date.getMonth() + 1;
        return Math.ceil(month / 3);
    }
    static getDateByYYYY_MM_DDString(date) {
        const dateBreakdown = date.split('-');
        const year = parseInt(dateBreakdown[0], 10);
        // -1 because of ZERO based indexing for date months
        const month = parseInt(dateBreakdown[1], 10) - 1;
        const day = parseInt(dateBreakdown[2], 10);
        return new Date(year, month, day);
    }
    static getDateNWorkdaysFromDate(date, nWorkDays) {
        let copyOfDate = new Date(date);
        let workDaysRemaining = nWorkDays;
        if (!this.isWorkDay(date)) {
            copyOfDate = this.getNextWorkDay(date);
        }
        while (workDaysRemaining > 1) {
            workDaysRemaining--;
            copyOfDate = this.getNextWorkDay(copyOfDate);
        }
        return copyOfDate;
    }
    static getDateFromNumWorkDaysAgo(workDaysAgo, date = new Date()) {
        const sunday = 0;
        const saturday = 6;
        let dateResult = new Date(date.getTime());
        let shiftedCount = 0;
        while (shiftedCount < workDaysAgo) {
            const previousDay = DateHelper.getPreviousDate(dateResult).getDay();
            if (previousDay !== sunday && previousDay !== saturday) {
                ++shiftedCount;
            }
            dateResult = DateHelper.getPreviousDate(dateResult);
        }
        return dateResult;
    }
    static getQuarterNumber(date = new Date()) {
        return Math.floor(date.getUTCMonth() / 3) + 1;
    }
    static getDaysInMonth(date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0).getUTCDate();
    }
    static getEarlierDate(dateA, dateB) {
        return this.isDateBeforeDate(dateA, dateB) ? dateA : dateB;
    }
    static getEndDateOfQuarterByDate(date) {
        const endMonth = [
            DateConstants.q1EndMonthIndex,
            DateConstants.q2EndMonthIndex,
            DateConstants.q3EndMonthIndex,
            DateConstants.q4EndMonthIndex
        ].find(month => month >= date.getUTCMonth());
        return new Date(date.getUTCFullYear(), endMonth + 1, 0);
    }
    static getFollowingDay(date) {
        return this.getNewDateByAddingDays(date, 1);
    }
    static getLastDayOfMonthFromDate(date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
    }
    static getLaterDate(dateA, dateB) {
        return this.isDateBeforeDate(dateA, dateB) ? dateB : dateA;
    }
    static getMillisecondsInMonth(year, month, date) {
        const currentMonth = new Date().getMonth();
        const currentMonthIndex = month === 0 ? 1 : month - 1;
        const startDate = new Date(year, currentMonthIndex);
        const startMillisecond = startDate.getTime();
        const endDay = currentMonth + 1 === month ? date : DateHelper.getDaysInMonth(startDate);
        const endDate = new Date(year, currentMonthIndex, endDay);
        const endMillisecond = endDate.getTime();
        return [startMillisecond, endMillisecond];
    }
    static getMostRecentDate(dates) {
        return dates.reduce((a, b) => {
            return this.getLaterDate(a, b);
        });
    }
    static getNewDateByAddingDays(date, days) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days);
    }
    static getNextWorkDay(date) {
        let copyOfDate = new Date(date.getTime());
        copyOfDate.setDate(copyOfDate.getDate() + 1);
        while (!this.isWorkDay(copyOfDate)) {
            copyOfDate.setUTCDate(copyOfDate.getUTCDate() + 1);
        }
        return copyOfDate;
    }
    static getPreviousWorkDay(date) {
        const copyOfDate = new Date(date.getTime());
        copyOfDate.setUTCDate(copyOfDate.getUTCDate() - 1);
        while (!this.isWorkDay(copyOfDate)) {
            copyOfDate.setUTCDate(copyOfDate.getUTCDate() - 1);
        }
        return copyOfDate;
    }
    static getToday() {
        return new Date(Date.now());
    }
    static getQuarterEndMonth(quarter) {
        return [
            DateConstants.q1EndMonthIndex,
            DateConstants.q2EndMonthIndex,
            DateConstants.q3EndMonthIndex,
            DateConstants.q4EndMonthIndex
        ][quarter - 1];
    }
    static getQuartersInRange(startDate, endDate) {
        let start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
            return 0;
        }
        let numQuarters = 1;
        while (this.isNotSameYearAndMonth(start, end)) {
            const lastMonth = start.getUTCMonth();
            const lastYear = start.getUTCFullYear();
            start = new Date(start.getUTCFullYear(), start.getUTCMonth() + 1, 1);
            if (this.doMonthsCrossQuarterBoundary(lastMonth, start.getUTCMonth(), lastYear, start.getUTCFullYear())) {
                numQuarters++;
            }
        }
        return numQuarters;
    }
    static isNotSameYearAndMonth(start, end) {
        return !(start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth());
    }
    static getStartDateOfQuarterByDate(date) {
        const startMonth = [
            DateConstants.q4StartMonthIndex,
            DateConstants.q3StartMonthIndex,
            DateConstants.q2StartMonthIndex,
            DateConstants.q1StartMonthIndex
        ].find(month => date.getUTCMonth() >= month);
        return new Date(date.getUTCFullYear(), startMonth, 1);
    }
    static getTomorrow() {
        const tomorrow = this.getToday();
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        return tomorrow;
    }
    static getUtcHourFromMstHour(mstHour) {
        const hoursInDay = 24;
        const timeZoneHoursDifference = 6;
        const hoursRemaining = hoursInDay - timeZoneHoursDifference;
        if (mstHour < hoursRemaining) {
            return mstHour + timeZoneHoursDifference;
        }
        else {
            return mstHour - hoursRemaining;
        }
    }
    static getYearsBetweenDates(startDate, endDate) {
        return endDate.getUTCFullYear() - startDate.getUTCFullYear();
    }
    static hasWorkedFewerDaysThanTimePeriod(startDate, comparisonDate, daysBack) {
        return this.totalDaysIncludingStartOrEndDate(startDate, comparisonDate) < daysBack;
    }
    static isDateBeforeDate(comparisonDate, date) {
        return comparisonDate < date;
    }
    static isDateInDateRangeInclusive(comparisonDate, start, end) {
        return comparisonDate >= start && comparisonDate <= end;
    }
    static isDateOnOrBeforeDate(comparisonDate, date) {
        const dateFunctions = ['getUTCFullYear', 'getUTCMonth', 'getUTCDate'];
        for (let i = 0; i < dateFunctions.length; i++) {
            const dateA = comparisonDate[dateFunctions[i]]();
            const dateB = date[dateFunctions[i]]();
            if (dateA > dateB) {
                return false;
            }
            else if (dateA < dateB) {
                return true;
            }
        }
        return true;
    }
    static isDateOnOrInDateRange(comparisonDate, start, end) {
        return comparisonDate >= start && comparisonDate <= end;
    }
    static isDoubleDigit(num) {
        return num > 9;
    }
    static isToday(date) {
        return this.areDatesOnSameCalendarDate(date, this.getToday());
    }
    static isValidDate(date) {
        return !isNaN(date) && date instanceof Date;
    }
    static isWorkDay(date) {
        const dayOfWeek = date.getUTCDay();
        return dayOfWeek !== 6 && dayOfWeek !== 0;
    }
    static isYesterday(date) {
        const today = this.getToday();
        return this.areDatesOnSameCalendarDate(date, new Date(today.setDate(today.getDate() - 1)));
    }
    static isYYYY_MM_DD_string(date) {
        return DateStringHelper.getYYYY_MM_DDString(new Date(date)) === date;
    }
    static monthsBetweenDates(startDate, endDate) {
        const yearsBetweenDates = this.getYearsBetweenDates(startDate, endDate);
        return (endDate.getUTCMonth() -
            startDate.getUTCMonth() +
            yearsBetweenDates * DateConstants.monthsInYear);
    }
    static numberBusinessDaysInDateRangeInclusive(startDate, endDate) {
        let days = 0;
        const currDate = new Date(startDate);
        while (currDate <= endDate) {
            const dayOfWeek = currDate.getUTCDay();
            if (dayOfWeek !== 6 && dayOfWeek !== 0) {
                days++;
            }
            currDate.setUTCDate(currDate.getUTCDate() + 1);
        }
        return days;
    }
    static numberOfDistinctMonthsInPeriod(startDate, endDate) {
        return (endDate.getUTCMonth() -
            startDate.getUTCMonth() +
            DateConstants.monthsInYear * (endDate.getUTCFullYear() - startDate.getUTCFullYear()) +
            1);
    }
    static oneYearAgoToday() {
        const oneYearAgoToday = new Date(this.getToday());
        oneYearAgoToday.setUTCDate(oneYearAgoToday.getUTCDate() - DateConstants.daysInYear);
        return oneYearAgoToday;
    }
    static getPreviousDate(date = this.getToday()) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1);
    }
    static getPreviousMonth(date = this.getToday()) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth() - 1, date.getUTCDate());
    }
    static getPreviousYear(date = this.getToday()) {
        return new Date(date.getUTCFullYear() - 1, date.getUTCMonth(), date.getUTCDate());
    }
    static removeTimestampFromDate(date) {
        return new Date(DateStringHelper.getYYYY_MM_DDString(date));
    }
    static doMonthsCrossQuarterBoundary(startMonth, endMonth, startYear, endYear) {
        if (startYear < endYear) {
            return true;
        }
        if (endYear < startYear) {
            return false;
        }
        if (startYear < endYear &&
            startMonth > DateConstants.q1StartMonthIndex &&
            endMonth >= DateConstants.q1StartMonthIndex) {
            return true;
        }
        if (startMonth < DateConstants.q2StartMonthIndex &&
            endMonth >= DateConstants.q2StartMonthIndex) {
            return true;
        }
        if (startMonth < DateConstants.q3StartMonthIndex &&
            endMonth >= DateConstants.q3StartMonthIndex) {
            return true;
        }
        if (startMonth < DateConstants.q4StartMonthIndex &&
            endMonth >= DateConstants.q4StartMonthIndex) {
            return true;
        }
        return false;
    }
}
DateHelper.dateDiffInDays = (a, b) => {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / DateConstants.millisecondsPerDay);
};
// Ignores local timezone
DateHelper.fromISO = (date) => {
    const dateObj = new Date(date);
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    // @ts-ignore
    return new Date(dateObj.getTime() + tzOffset);
};
DateHelper.getDaysInDateRange = (startDate, endDate) => {
    const totalDaysInDateRange = DateHelper.dateDiffInDays(startDate, endDate) + 1;
    return totalDaysInDateRange > 0 ? totalDaysInDateRange : null;
};
DateHelper.getYesterday = (date = new Date(Date.now())) => {
    return new Date(new Date(date).setDate(date.getDate() - 1));
};
/**
 * Given a number that has been scaled from 90 days, return that number
 * in a back to 90 days
 *
 * @param scaledNumber a number that represents a metric for a 90-day period
 * @param scale 0: workDay, 1: week, 2: month
 */
DateHelper.reverseScale90DayNumber = (scaledNumber, scale) => {
    switch (scale) {
        case 0:
            return scaledNumber * DateConstants.workDaysIn90Days;
        case 1:
            return scaledNumber * DateConstants.weeksIn90Days;
        case 2:
            return scaledNumber * DateConstants.monthsIn90Days;
        default:
            return scaledNumber;
    }
};
/**
 * Given a number toScale that is in terms of 90 days, return that number
 * in a scaled average format of either workDays, weeks, or months
 *
 * @param toScale a number that represents a metric for a 90-day period
 * @param scale 0: workDay, 1: week, 2: month
 * @param numOptions
 * @param workDaysIntoJob
 */
DateHelper.scale90DayNumber = (toScale, scale, numOptions, workDaysIntoJob, ceilResult) => {
    if (numOptions === undefined || numOptions === 4) {
        switch (scale) {
            case 0:
                return toScale / DateConstants.workDaysIn90Days;
            case 1:
                return toScale / DateConstants.weeksIn90Days;
            case 2:
                return toScale / DateConstants.monthsIn90Days;
            default:
                return toScale;
        }
    }
    else if (numOptions === 2) {
        if (scale === 0) {
            return ceilResult ? Math.ceil(toScale / workDaysIntoJob) : toScale / workDaysIntoJob;
        }
    }
    return toScale;
};
export default DateHelper;
//# sourceMappingURL=DateHelper.js.map