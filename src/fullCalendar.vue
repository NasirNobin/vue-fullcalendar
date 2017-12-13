<template>
    <div class="comp-full-calendar">

        <!-- header -->
        <div class="full-calendar-header">
            <div class="header-left">
                <slot name="header-left">
                    <div class="fc-button-group button-group">
                        <button
                                type="button"
                                class="fc-month-button fc-button"
                                :class="{'fc-active': currentView == 'month'}"
                                @click.prevent="currentView = 'month'"
                        > month </button>
                        <button
                                type="button"
                                class="fc-agendaWeek-button fc-button"
                                :class="{'fc-active': currentView == 'week'}"
                                @click.prevent="currentView = 'week'"
                            > week </button>
                        <button
                                type="button"
                                class="fc-month-button fc-button"
                                v-if="!isSameWeek"
                                @click.prevent="goToday"
                        > today </button>
                    </div>
                </slot>
            </div>

            <div class="header-center">
                <span @click.stop="goPrev" class="prev-month">
                    <slot name="next-btn">&laquo;</slot>
                </span>
                <span class="title">
                    {{title}}
                </span>
                <span @click.stop="goNext" class="next-month">
                    <slot name="prev-btn">&raquo;</slot>
                </span>
            </div>

            <div class="header-right">
                <slot name="header-right">

                </slot>
            </div>
        </div>
        <!-- ./header -->

        <!-- body display date day and events -->
        <div class="full-calendar-body" :class="{'fc-week-view' : isWeekView}">
            <div class="weeks">
                <strong class="week" v-for="dayIndex in 7">{{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}</strong>
            </div>
            <div class="dates" ref="dates">

                <!-- absolute so we can make dynamic td -->
                <div class="dates-events">
                        <div class="events-week week-row" v-for="(week,weekIndex) in currentDates" :data-weekIndex="weekIndex">
                            <div
                                class="events-day day-cell" v-for="day in week"
                                track-by="$index"
                                :class="{'today' : day.isToday, 'not-cur-month' : !day.isCurMonth}"
                                @click="dayClick(day.date, $event)">

                                <p class="day-number">{{day.monthDay}}</p>

                                <div class="event-box" :data-date="day.date.format()">
                                    <event-card
                                        :event="event"
                                        :date="day.date"
                                        :firstDay="firstDay"
                                        v-for="event in day.events"
                                        v-show="event.cellIndex <= eventLimit"
                                        @click="eventClick">
                                            <div :data-event-id="event.id">
                                                <slot name="fc-event-card" :event="event"></slot>
                                            </div>
                                    </event-card>

                                    <p
                                        v-if="day.events.length > eventLimit"
                                        class="more-link"
                                        @click.stop="selectThisDay(day, $event)">
                                        + {{day.events[day.events.length -1].cellIndex - eventLimit}} more
                                    </p>
                                </div>
                            </div>
                        </div>
                </div>

                <!-- full events when click show more -->
                <div class="more-events" v-show="showMore" :style="{left: morePos.left + 'px', top: morePos.top + 'px'}">
                    <div class="more-header">
                        <span class="title">{{ moreTitle(selectDay.date) }}</span>
                        <span class="close" @click.stop="showMore = false">x</span>
                    </div>
                    <div class="more-body">
                        <ul class="body-list">
                            <li
                                v-for="event in selectDay.events"
                                v-show="event.isShow"
                                class="body-item"
                                @click="eventClick"
                            >
                                {{event.title}}
                            </li>
                        </ul>
                    </div>
                </div>

                <slot name="body-card">

                </slot>

            </div>
        </div>
    </div>
</template>
<script type="text/babel">
// import langSets from './dataMap/langSets'
import dateFunc from './components/dateFunc'
import moment from 'moment';
import EventCard from './components/eventCard.vue';
import Sortable from 'sortablejs'

export default {
    props: {
        events: { // events will be displayed on calendar
            type: Array,
            default: []
        },
        locale: {
            type: String,
            default: 'en'
        },
        defaultView: {
            type: String,
            default: 'month'
        },
        firstDay: {
            type: Number | String,
            validator(val) {
                let res = parseInt(val);
                return res >= 0 && res <= 6
            },
            default: 0
        }
    },
    components: {
        'event-card': EventCard,
    },
    mounted() {
        this.currentView = this.defaultView;
        this.resetSortable();
        this.setDateRange();
    },
    data() {
        return {
            currentMonth: moment().startOf('month'),
            currentWeekOfMonth: 0,
            currentWeek: 0,
            currentView: 'week',
            isLismit: true,
            eventLimit: 999,
            showMore: false,
            morePos: {
                top: 0,
                left: 0
            },
            selectDay: {},
        }
    },
    computed: {
        currentDates() {
            return this.getCalendar()
        },
        title() {
            if (!this.currentMonth) return;

            if (this.currentView == 'month') {
                return this.currentMonth.locale(this.locale).format('MMMM YYYY');
            } else {
                let start    = dateFunc.getWeekViewStartDate(this.currentMonth,this.currentWeekOfMonth).locale(this.locale);
                let end      = start.clone().add(6,'day');
                let endMonth = start.format('MMM') === end.format('MMM') ? '' : end.format('MMM') + ' ';

                return start.format('MMM DD') + ' - ' + endMonth + end.format('DD, YYYY');
            }
        },
        isMonthView(){
            return this.currentView === 'month';
        },
        isWeekView(){
            return this.currentView === 'week';
        },
        isSameWeek(){
            if (this.isWeekView) {
                return this.isSameMonth && dateFunc.getCurrentWeekOfMonth(this.currentMonth,this.firstDay) == this.currentWeekOfMonth;
            }else{
                return this.isSameMonth;
            }
        },
        isSameMonth(){
            return moment().isSame(this.currentMonth, 'month');
        },
    },
    watch: {
        currentWeekOfMonth(currentWeekOfMonth){
            let start = dateFunc.getWeekViewStartDate(this.currentMonth,currentWeekOfMonth);
            this.currentWeek = start.week();
            this.resetSortable();
        },
        currentMonth(value){
            this.resetSortable();
        },
        currentView(currentView){
            this.setDateRange();
            this.resetSortable();
        },
    },
    methods: {
        setDateRange(){
            if(this.isMonthView){
                this.emitChangeMonth(this.currentMonth);
            }else{
                this.emitChangeWeek(dateFunc.getCurrentWeekOfMonth(this.currentMonth,this.firstDay));
            }
        },
        goToday() {
            if (this.isMonthView) {
                this.emitChangeMonth(moment().startOf('month'));
            }else{
                this.currentMonth = moment().startOf('month');
                this.emitChangeWeek(dateFunc.getCurrentWeekOfMonth(moment(),this.firstDay));
            }
        },
        goPrev() {
            (this.isMonthView) ? this.goPrevMonth() : this.goPrevWeek();
        },
        goNext() {
            (this.isMonthView) ? this.goNextMonth() : this.goNextWeek();
        },

        goPrevMonth(){
            let newMonth = moment(this.currentMonth).subtract(1, 'months').startOf('month');
            this.emitChangeMonth(newMonth);
        },
        goNextMonth(){
            let newMonth = moment(this.currentMonth).add(1, 'months').startOf('month');
            this.emitChangeMonth(newMonth);
        },
        goPrevWeek(){
            if (this.currentWeekOfMonth <= 0) {

                // there's room for refactoring
                let startOfWeek = dateFunc.getWeekViewStartDate(this.currentMonth,this.currentWeekOfMonth);
                let needToGo    = startOfWeek.subtract(1,'week');

                this.goPrevMonth();

                let monthStart = dateFunc.getMonthViewStartDate(this.currentMonth,this.firstDay);
                let weekIndex  = needToGo.diff(monthStart, 'week');

                this.emitChangeWeek(weekIndex);

            }else{
                this.emitChangeWeek(this.currentWeekOfMonth-1);
            }
        },
        goNextWeek(){
            if (this.currentWeekOfMonth >= 5) {

                // there's room for refactoring
                let startOfWeek = dateFunc.getWeekViewStartDate(this.currentMonth,this.currentWeekOfMonth);
                let needToGo    = startOfWeek.add(1,'week');

                this.goNextMonth();

                let monthStart = dateFunc.getMonthViewStartDate(this.currentMonth,this.firstDay);
                let weekIndex  = needToGo.diff(monthStart, 'week');

                this.emitChangeWeek(weekIndex);
            }else{
                this.emitChangeWeek(this.currentWeekOfMonth+1);
            }
        },

        destroySortable() {

        },
        resetSortable() {
            setTimeout(() => {
                this.destroySortable();
                this.setSortable(); // mayb this is not a good place to do stuff
            },300);
        },
        setSortable() {
            var el = document.querySelectorAll('.event-box:not([fc-sortable])');
            var vm = this;

            el.forEach(function(node){
                var sortable = Sortable.create(node,{
                    group: {
                        name: 'fc-events',
                        put: function(to, from){
                            return dateFunc.isFuture(moment(to.el.getAttribute('data-date'))); // prevent to put on past
                        },
                    },
                    draggable: '.event-item',
                    sort: false,
                    animation: 150,
                    onAdd: function (evt) {

                        var to    = moment(evt.to.getAttribute('data-date'));
                        var item  = evt.item.querySelector('div');
                        var id    = item.getAttribute('data-event-id');
                        var index = vm.events.findIndex(function (o) { return o.id == id; });

                        var event = vm.events[index];
                        var from  = moment(event.start);

                        var toDate = moment(to)
                                    .hour(from.format('HH'))
                                    .minute(from.format('mm'))
                                    .second(from.format('ss'))

                        item.setAttribute('start-date', toDate.format());

                        // event.start = toDate;

                        vm.$emit('eventDrop',event,toDate);
                    },
                });

                node.setAttribute('fc-sortable', true);
            });
        },

        emitChangeMonth(firstDayOfMonth) {
            this.currentMonth = firstDayOfMonth;

            let start = dateFunc.getMonthViewStartDate(firstDayOfMonth, this.firstDay);
            let end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay);

            this.$emit('changeDateRange', start, end, firstDayOfMonth)
        },
        emitChangeWeek(weekIndex) {
            this.currentWeekOfMonth = weekIndex;

            let start = dateFunc.getWeekViewStartDate(this.currentMonth,this.currentWeekOfMonth);
            let end   = start.clone().add(1,'week').subtract(1,'day');

            this.$emit('changeDateRange', start, end, start)
        },
        moreTitle(date) {
            if (!date) return '';
            return moment(date).format('ll');
        },
        getCalendar() {
            // calculate 2d-array of each month
            let monthViewStartDate = dateFunc.getMonthViewStartDate(this.currentMonth, this.firstDay);
            let calendar = [];

            for (let perWeek = 0; perWeek < 6; perWeek++) {

                if (this.isWeekView && perWeek != this.currentWeekOfMonth) {
                    monthViewStartDate.add(1, 'week');
                    continue;
                }

                let week = [];

                for (let perDay = 0; perDay < 7; perDay++) {
                    week.push({
                        monthDay: monthViewStartDate.date(),
                        isToday: monthViewStartDate.isSame(moment(), 'day'),
                        isCurMonth: monthViewStartDate.isSame(this.currentMonth, 'month'),
                        weekDay: perDay,
                        date: moment(monthViewStartDate),
                        events: this.slotEvents(monthViewStartDate)
                    });

                    monthViewStartDate.add(1, 'day');
                }

                calendar.push(week);
            }

            return calendar
        },
        slotEvents(date) {

            // find all events start from this date
            let cellIndexArr = [];
            let thisDayEvents = this.events.filter(day => {
                let st = day.end ? moment(day.start) : moment(day.start).startOf('day');
                let ed = moment(day.end ? day.end : st);

                return date.isBetween(st, ed, null, '[]');
            });

            // sort by time
            thisDayEvents.sort((a, b) => {
                return moment(a.start).format('X') - moment(b.start).format('X');
            });

            // mark cellIndex and place holder
            for (let i = 0; i < thisDayEvents.length; i++) {
                // thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || (i + 1); // we want to force to re build cellIndex
                thisDayEvents[i].cellIndex = (i + 1);
                thisDayEvents[i].isShow = true;
                if (thisDayEvents[i].cellIndex == i + 1 || i > 2) continue;

                thisDayEvents.splice(i, 0, {
                    title: 'holder',
                    cellIndex: i + 1,
                    start: date.format(),
                    end: date.format(),
                    isShow: false
                })
            }

            return thisDayEvents
        },
        selectThisDay(day, jsEvent) {
            this.selectDay = day;
            this.showMore = true;
            this.morePos = this.computePos(event.target);
            this.morePos.top -= 100;
            let events = day.events.filter(item => {
                return item.isShow == true
            });
            this.$emit('moreClick', day.date, events, jsEvent)
        },
        computePos(target) {
            let eventRect = target.getBoundingClientRect();
            let pageRect = this.$refs.dates.getBoundingClientRect();
            return {
                left: eventRect.left - pageRect.left,
                top: eventRect.top + eventRect.height - pageRect.top
            }
        },
        dayClick(day, jsEvent) {
            this.$emit('dayClick', day, jsEvent)
        },
        eventClick(event, jsEvent) {
            jsEvent.stopPropagation();
            this.$emit('eventClick', event, jsEvent);
        },
        log(evt) {
            console.log(evt);
        }
    },
    filters: {
        localeWeekDay(weekday, firstDay, locale) {
            firstDay = parseInt(firstDay);
            const localMoment = moment().locale(locale);
            return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7];
        }
    }
}
</script>
<style lang="scss">

.full-calendar-header {
    display: flex;
    align-items: center;
    .header-left, .header-right {
        flex: 1;
    }
    .header-center {
        flex: 3;
        text-align: center;
        .title {
            margin: 0 10px;
        }
        .prev-month, .next-month {
            cursor: pointer;
        }
    }
}
.currentWeekOfMonth {
    background: #fffad0;
}
.comp-full-calendar {
    // font-family: "elvetica neue", tahoma, "hiragino sans gb";
    padding: 20px;
    background: #fff;
    max-width: 960px;
    margin: 0 auto;
    ul, p {
        margin: 0;
        padding: 0;
    }
    .fc-button {

    }
}
.full-calendar-body {
    margin-top: 20px;
    .weeks {
        display: flex;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        border-left: 1px solid #e0e0e0;
        .week {
            flex: 1;
            text-align: center;
            border-right: 1px solid #e0e0e0;
        }
    }
    .dates {
        position: relative;
        .dates-events {
            position: relative;
            z-index: 1;
            width: 100%;
            .events-week {
                display: flex;
                border-left: 1px solid #e0e0e0;
                .events-day {
                    cursor: pointer;
                    flex: 1;
                    min-height: 112px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    border-right: 1px solid #e0e0e0;
                    border-bottom: 1px solid #e0e0e0;

                    display: flex;
                    flex-direction: column;
                    padding-left: 4px;

                    .day-number {
                        text-align: right;
                    }
                    &.today {
                        background-color: #fcf8e3;
                    }
                    &.not-cur-month {
                        .day-number {
                            color: rgba(0, 0, 0, .24);
                        }
                    }
                    .event-box {
                        flex: 1;
                        .event-item {
                            cursor: pointer;
                            font-size: 12px;
                            background-color: #C7E6FD;
                            margin-bottom: 2px;
                            color: rgba(0, 0, 0, .87);
                            padding: 0 0 0 4px;
                            height: 18px;
                            line-height: 18px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            &.is-start {

                            }
                            &.is-end {

                            }
                            &.is-opacity {
                                opacity: 0;
                            }
                        }
                        .more-link {
                            cursor: pointer; // text-align: right;
                            padding-left: 8px;
                            padding-right: 2px;
                            color: rgba(0, 0, 0, .38);
                            font-size: 14px;
                        }
                    }
                }
            }
        }
        .more-events {
            position: absolute;
            width: 150px;
            z-index: 2;
            border: 1px solid #eee;
            box-shadow: 0 2px 6px rgba(0, 0, 0, .15);
            .more-header {
                background-color: #eee;
                padding: 5px;
                display: flex;
                align-items: center;
                font-size: 14px;
                .title {
                    flex: 1;
                }
                .close {
                    margin-right: 2px;
                    cursor: pointer;
                    font-size: 16px;
                }
            }
            .more-body {
                height: 146px;
                overflow: hidden;
                .body-list {
                    height: 144px;
                    padding: 5px;
                    overflow: auto;
                    background-color: #fff;
                    .body-item {
                        cursor: pointer;
                        font-size: 12px;
                        background-color: #C7E6FD;
                        margin-bottom: 2px;
                        color: rgba(0, 0, 0, .87);
                        padding: 0 0 0 4px;
                        height: 18px;
                        line-height: 18px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
}
</style>
