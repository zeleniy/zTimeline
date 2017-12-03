const config = {
  axes: {
    x: {
      grid: {
        show: true
      }
    }
  }
};

d3.json('events.json', function(error, data) {

  const timeline = ZTimeline.getInstance(config)
    .setData(data)
    .renderTo(document.getElementById('z-timeline'));
});