import moment from 'moment';
let dateFunc = {
    getMonthViewStartDate(date, firstDay) {
        firstDay = parseInt(firstDay);
        let start = moment(date);
        let startOfMonth = moment(start.startOf('month'));
        start.subtract(startOfMonth.day(), 'days');
        if (startOfMonth.day() < firstDay) {
            start.subtract(7, 'days');
        }
        start.add(firstDay, 'days');
        return start;
    },
    getMonthViewEndDate(date) {
        return this.getMonthViewStartDate().add(6, 'weeks');
    },
    getWeekViewStartDate(date,firstDay,weekIndex) {
        let start = this.getMonthViewStartDate(date);
        if (weekIndex) {
            start.add(weekIndex*7, 'days');
        }
       return start;
    },
    getWeekViewEndDate(date) {
        return this.getMonthViewStartDate().add(6, 'weeks');
    },
    weekOfMonth(m) {
      return m.week() - moment(m).startOf('month').week();
    }
};
module.exports = dateFunc;
