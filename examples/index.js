d3.json('events.json', function(error, data) {

  const timeline = ZTimeline.getInstance()
    .setData(data)
    .renderTo(document.getElementById('z-timeline'));
});