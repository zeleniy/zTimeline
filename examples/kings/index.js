/*
 * https://ru.wikipedia.org/wiki/Список_императоров_России
 */
const config = {
  axes: {
    x: {
      grid: {
        show: true
      },
      tooltip: {
        show: true
      },
      pointer: {
        show: true
      }
    },
    y: {
      zebra: true
    }
  },
  interval: {
    show: true,
    color: 'lightgrey',
  },
  spans: {
    tooltip: {
      show: true
    }
  }
};

d3.json('events.json', function(error, data) {

  const timeline = ZTimeline.getInstance(config)
    .setData(data)
    .renderTo(document.getElementById('z-timeline'));
});
