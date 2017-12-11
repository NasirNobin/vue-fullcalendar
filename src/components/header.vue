<template>
    <div class="full-calendar-header">
        <div class="header-left">
            <slot name="header-left">
            </slot>
        </div>
        <div class="header-center">
            <span @click.stop="goPrev" class="prev-month">
                {{leftArrow}}
            </span>
            <span class="title">
                {{title}}
            </span>
            <span @click.stop="goNext" class="next-month">
                {{rightArrow}}
            </span>
        </div>
        <div class="header-right">
            <slot name="header-right">
            </slot>
        </div>
    </div>
</template>
<script type="text/babel">
import dateFunc from './dateFunc'
import moment from 'moment';
export default {
    props: {
        currentMonth: {},
        titleFormat: {},
        firstDay: {},
        monthNames: {},
        locale: {},
        currentWeekIndex: {
            required: true
        },
        currentView: {
            required: true
        },
    },
    data() {
        return {
            leftArrow: '<',
            rightArrow: '>'
        }
    },
    computed: {
        title() {
            if (!this.currentMonth) return;

            if (this.currentView == 'month') {
                return this.currentMonth.locale(this.locale).format('MMMM YYYY');
            } else {
                let start    = dateFunc.getWeekViewStartDate(this.currentMonth,this.firstDay,this.currentWeekIndex).locale(this.locale);
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
    },
    methods: {
        goPrev() {
            let newMonth = this.isMonthView ? this.goPrevMonth() : this.goPrevWeek();
        },
        goNext() {
            let newMonth = this.isMonthView ? this.goNextMonth() : this.goNextWeek();
        },

        goPrevMonth(){
            let newMonth = moment(this.currentMonth).subtract(1, 'months').startOf('month');
            this.$emit('change', newMonth);
        },
        goNextMonth(){
            let newMonth = moment(this.currentMonth).add(1, 'months').startOf('month');
            this.$emit('change', newMonth);
        },
        goPrevWeek(){
            if (this.currentWeekIndex <= 0) {

                let start = dateFunc.getWeekViewStartDate(this.currentMonth,this.firstDay,this.currentWeekIndex);

                console.log(start.week());
                console.log(start.month());
                console.log(start.subtract(1,'week').week());

                // this.goPrevMonth();
                // this.$emit('changeWeek', 5);
            }else{
                this.$emit('changeWeek', this.currentWeekIndex-1);
            }
        },
        goNextWeek(){
            if (this.currentWeekIndex >= 5) {
                this.goNextMonth();
                this.$emit('changeWeek', 0);
            }else{
                this.$emit('changeWeek', this.currentWeekIndex+1);
            }
        },
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
</style>
