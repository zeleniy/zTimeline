d3.json('events.json', function(error, data) {

  const timeline = ZTimeline.getInstance()
    .setEvents(data)
    .renderTo(document.getElementById('z-timeline'));
});