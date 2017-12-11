<template>
  <div>
    <full-calendar
    class="test-fc"
      :events="fcEvents"
      first-day='0'
      locale="en"
      @changeMonth="changeMonth"
      @eventClick="eventClick"
      @dayClick="dayClick"
      @moreClick="moreClick">

        <template slot="fc-event-card" scope="p">
          <p>{{ p.event.title }}</p>
        </template>

    </full-calendar>

  </div>
</template>
<script>
let demoEvents = [
    {
      id       : 1,
      title    : '111',
      start    : '2017-11-27',
      cssClass : 'family'
    },
    {
      id       : 2,
      title    : '222',
      start    : '2017-11-27',
      cssClass : 'family'
    },
    {
      id       : 3,
      title    : '333',
      start    : '2017-11-28',
      cssClass : 'family'
    },
    {
      id       : 4,
      title    : '444',
      start    : '2017-11-28',
      cssClass : 'family'
    },
    {
      id       : 5,
      title    : '555',
      start    : '2017-11-29',
      cssClass : 'family'
    },
    {
      id       : 6,
      title    : '666',
      start    : '2017-11-29',
      cssClass : 'family'
    },
    {
      id       : 7,
      title    : '777',
      start    : '2017-12-05',
      cssClass : 'family'
    },
    {
      id       : 8,
      title    : '888',
      start    : '2017-12-05',
      cssClass : 'family'
    },
    {
      id       : 18,
      title    : '1818',
      start    : '2017-12-05',
      cssClass : 'family'
    },
    {
      id       : 9,
      title    : '9999',
      start    : '2017-12-05',
      cssClass : 'family'
    },
    {
      id       : 10,
      title    : '1010',
      start    : '2017-12-05',
      cssClass : 'family'
    },
    {
      id       : 11,
      title    : '1111',
      start    : '2017-12-25',
      cssClass : 'family'
    }
  ];

export default {
	data () {
		return {
            name:'Test!',
            fcEvents : demoEvents
        }
	},
  methods : {
    'changeMonth' (start, end, current) {
      console.log('changeMonth', start.format('DD, MMM YYYY | '), end.format('DD, MMM YYYY | '), current.format('DD, MMM YYYY'))
    },
    'eventClick' (event, jsEvent, pos) {
       console.log('eventClick', event, jsEvent, pos)
    },
    'dayClick' (day, jsEvent) {
      console.log('dayClick', day, jsEvent)
    },
    'moreClick' (day, events, jsEvent) {
      console.log('moreCLick', day, events, jsEvent)
    }
  },
  components : {
    'full-calendar' : require('src/fullCalendar')
  }
}
</script>
<style lang='scss'>
  .app{
    color:green;
  }
</style>
