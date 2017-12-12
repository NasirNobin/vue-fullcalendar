<template>

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
        currentWeekOfMonth: {
            required: true
        },
        currentWeek: {
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

    },
    methods: {

    }
}
</script>
<style lang="scss">

</style>
