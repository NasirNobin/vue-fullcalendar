<template>
  <div>
    <full-calendar
    class="test-fc"
      :events="fcEvents"
      first-day='0'
      locale="en"
      @changeDateRange="changeDateRange"
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
    },
    {
      id       : 2,
      title    : '222',
      start    : '2017-11-27',
    },
    {
      id       : 3,
      title    : '333',
      start    : '2017-11-28',
    },
    {
      id       : 4,
      title    : '444',
      start    : '2017-11-28',
    },
    {
      id       : 5,
      title    : '555',
      start    : '2017-11-29',
    },
    {
      id       : 6,
      title    : '666',
      start    : '2017-11-29',
    },
    {
      id       : 7,
      title    : '777',
      start    : '2017-12-05',
    },
    {
      id       : 8,
      title    : '888',
      start    : '2017-12-05',
    },
    {
      id       : 18,
      title    : '1818',
      start    : '2017-12-05',
    },
    // {
    //   id       : 77,
    //   title    : '777',
    //   start    : '2017-12-05',
    // },
    // {
    //   id       : 78,
    //   title    : '888',
    //   start    : '2017-12-05',
    // },
    // {
    //   id       : 78,
    //   title    : '1818',
    //   start    : '2017-12-05',
    // },
    // {
    //   id       : 79,
    //   title    : '9999',
    //   start    : '2017-12-05',
    // },
    {
      id       : 10,
      title    : '1010',
      start    : '2017-12-05',
    },
    {
      id       : 11,
      title    : '1111',
      start    : '2017-12-25',
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
    'changeDateRange' (start, end, current) {
      console.log('changeDateRange', start.format('DD, MMM YYYY | '), end.format('DD, MMM YYYY | '), current.format('DD, MMM YYYY'))
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
