import DateConstants from './constants/DateConstants';
import DateHelper from './DateHelper';
import StringConstants from './constants/StringConstants';
class DateStringHelper {
    static buildEndOfMonthDateString(date) {
        const daysInMonth = DateHelper.getDaysInMonth(date);
        const endOfMonthDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), daysInMonth);
        return this.getYYYY_MM_DDString(endOfMonthDate);
    }
    static buildStartOfMonthDateString(date) {
        const startOfMonthDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
        return this.getYYYY_MM_DDString(startOfMonthDate);
    }
    static findDateLastNWorkdaysAgoInclusive(workdays, endDateStr) {
        if (workdays <= 0 || !endDateStr) {
            return null;
        }
        let daysRemaining = workdays;
        let currentDate = new Date(endDateStr);
        if (!DateHelper.isWorkDay(currentDate)) {
            currentDate = DateHelper.getPreviousWorkDay(currentDate);
        }
        while (daysRemaining > 1) {
            currentDate = DateHelper.getPreviousWorkDay(currentDate);
            daysRemaining--;
        }
        return this.getYYYY_MM_DDString(currentDate);
    }
    static formatOptionalDate(optionalDate) {
        if (optionalDate === null) {
            return null;
        }
        else {
            return this.getYYYY_MM_DDString(new Date(optionalDate));
        }
    }
    static getDailyDateRangeWithTimePeriod(timePeriods, lastDate) {
        const dateRanges = [];
        let currentDate = new Date(lastDate);
        if (!DateHelper.isWorkDay(currentDate)) {
            currentDate = DateHelper.getPreviousWorkDay(currentDate);
        }
        for (let i = 0; i < timePeriods; i++) {
            dateRanges.unshift({
                startDate: this.getYYYY_MM_DDString(currentDate),
                endDate: this.getYYYY_MM_DDString(currentDate)
            });
            currentDate = DateHelper.getPreviousWorkDay(currentDate);
        }
        return dateRanges;
    }
    static getMonthDateRangeWithTimePeriod(timePeriod, lastDate) {
        const dateRanges = [];
        for (let i = 0; i < timePeriod; i++) {
            const isEndDateInTheMiddleOfTheMonth = lastDate !== new Date(lastDate.getFullYear(), lastDate.getMonth(), 0);
            const startDate = this.getYYYY_MM_DDString(new Date(lastDate.getFullYear(), lastDate.getMonth() - i, 1));
            const endDate = this.getYYYY_MM_DDString(isEndDateInTheMiddleOfTheMonth && i === 0
                ? lastDate
                : new Date(lastDate.getFullYear(), lastDate.getMonth() - i + 1, 0));
            dateRanges.unshift({
                startDate,
                endDate
            });
        }
        return dateRanges;
    }
    static getQuarterDateRangeWithTimePeriod(timePeriod, lastDate) {
        const dateRanges = [];
        for (let i = 0; i < timePeriod; i++) {
            const currentQuarter = DateHelper.findQuarterByDate(lastDate);
            const quarterEndMonth = DateHelper.getQuarterEndMonth(currentQuarter);
            const isEndDateInTheMiddleOfTheQuarter = lastDate.getMonth() !==
                (DateConstants.q1EndMonthIndex ||
                    DateConstants.q2EndMonthIndex ||
                    DateConstants.q3EndMonthIndex ||
                    DateConstants.q4EndMonthIndex);
            const startDate = this.getYYYY_MM_DDString(DateHelper.getStartDateOfQuarterByDate(new Date(lastDate.getFullYear(), lastDate.getMonth() - DateConstants.monthsInQuarter * i, 1)));
            const endDate = this.getYYYY_MM_DDString(isEndDateInTheMiddleOfTheQuarter && i === 0
                ? lastDate
                : DateHelper.getEndDateOfQuarterByDate(new Date(lastDate.getFullYear(), quarterEndMonth - DateConstants.monthsInQuarter * i, 0)));
            dateRanges.unshift({
                startDate,
                endDate
            });
        }
        return dateRanges;
    }
    static getStartAndEndDateByNTimePeriods(periodType, timePeriods, endDateStr) {
        let endDate = new Date(endDateStr);
        if (periodType === StringConstants.monthlyTimePeriod) {
            return this.getMonthDateRangeWithTimePeriod(timePeriods, new Date(endDate));
        }
        else if (periodType === StringConstants.quarterlyTimePeriod) {
            return this.getQuarterDateRangeWithTimePeriod(timePeriods, new Date(endDate));
        }
        else {
            return this.getDailyDateRangeWithTimePeriod(timePeriods, new Date(endDate));
        }
    }
    static getStartDateByTimePeriod(date, timePeriod) {
        if (timePeriod === StringConstants.quarterlyTimePeriod) {
            return this.getYYYY_MM_DDString(DateHelper.getStartDateOfQuarterByDate(date));
        }
        else if (timePeriod === StringConstants.monthlyTimePeriod) {
            return this.buildStartOfMonthDateString(date);
        }
        else if (timePeriod === StringConstants.dailyTimePeriod) {
            if (DateHelper.isWorkDay(date)) {
                return this.getYYYY_MM_DDString(date);
            }
            return this.getYYYY_MM_DDString(DateHelper.getNextWorkDay(date));
        }
        return null;
    }
    static getYYYY_MM_DDString(date = new Date()) {
        const paddingFillString = '0';
        const month = (date.getUTCMonth() + 1).toString().padStart(2, paddingFillString);
        const day = date
            .getUTCDate()
            .toString()
            .padStart(2, paddingFillString);
        return [date.getUTCFullYear(), month, day].join('-');
    }
    static convertDateStringToDateToDateFormat(startDate, timePeriod) {
        if (timePeriod === StringConstants.dailyTimePeriod) {
            const start = this.getYYYY_MM_DDString(startDate);
            return `${start} to ${start}`;
        }
        else if (timePeriod === StringConstants.monthlyTimePeriod) {
            return this.monthDateToDateFormat(startDate);
        }
        else if (timePeriod === StringConstants.quarterlyTimePeriod) {
            return this.quarterlyDataToDateFormat(startDate);
        }
        return null;
    }
    static monthDateToDateFormat(date) {
        const start = this.buildStartOfMonthDateString(date);
        const end = this.buildEndOfMonthDateString(date);
        return `${start} to ${end}`;
    }
    static quarterlyDataToDateFormat(date) {
        const start = this.getYYYY_MM_DDString(DateHelper.getStartDateOfQuarterByDate(date));
        const end = this.getYYYY_MM_DDString(DateHelper.getEndDateOfQuarterByDate(date));
        return `${start} to ${end}`;
    }
}
DateStringHelper.addLeadingZeros = (numberString, totalDigits) => {
    if (numberString.length === totalDigits) {
        return numberString;
    }
    return `0${DateStringHelper.addLeadingZeros(numberString, totalDigits - 1)}`;
};
DateStringHelper.getDashedDateFormat = (dateString) => {
    if (!dateString) {
        return dateString;
    }
    const date = DateHelper.fromISO(dateString);
    return `${date.getFullYear()}-${DateStringHelper.addLeadingZeros((date.getMonth() + 1).toString(), 2)}-${DateStringHelper.addLeadingZeros(date.getDate().toString(), 2)}`;
};
DateStringHelper.monthIndexToString = (monthIndex) => {
    return StringConstants.months[monthIndex];
};
DateStringHelper.getShortDateFormat = (date = new Date()) => {
    const shortMonth = DateStringHelper.monthIndexToString(date.getUTCMonth()).substring(0, 3);
    return `${shortMonth} ${date.getUTCDate()}`;
};
DateStringHelper.monthYearFormat = (date = new Date()) => {
    const shortMonth = DateStringHelper.monthIndexToString(date.getUTCMonth()).substring(0, 3);
    return `${shortMonth} ${date.getUTCFullYear()}`;
};
DateStringHelper.getShortDateWithYearFormat = (date = new Date(Date.now())) => {
    const shortMonth = DateStringHelper.monthIndexToString(date.getUTCMonth()).substring(0, 3);
    return `${shortMonth} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
};
DateStringHelper.getFullDateFormat = (date = new Date(Date.now())) => {
    const shortMonth = DateStringHelper.monthIndexToString(date.getUTCMonth());
    return `${shortMonth} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
};
DateStringHelper.getTodayDateString = () => {
    return DateStringHelper.getYYYY_MM_DDString(new Date(Date.now()));
};
export default DateStringHelper;
//# sourceMappingURL=DateStringHelper.js.map