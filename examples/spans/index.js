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
    color: 'rgba(0, 0, 255, 0.15)',
    height: '50%'
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