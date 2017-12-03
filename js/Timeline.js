/**
 * @private
 * @class
 */
class Timeline {


  /**
   * @public
   * @constructor
   * @param {ZTimeline} zTimeline
   */
  constructor(zTimeline) {

    this._zTimeline = zTimeline;
    this._xScale = zTimeline._xScale;
  }


  /**
   * @public
   * @static
   * @returns {Timeline}
   */
  static getInstance(zTimeline) {

    return new Timeline(zTimeline);
  }


  /**
   * Set data.
   * @public
   * @param {Object} data
   * @returns {Timeline}
   */
  setData(data) {

    this._data = data;
    return this;
  }


  /**
   * Render timeline.
   * @public
   * @param {SVGElement} container
   * @returns {Timeline}
   */
  renderTo(container) {

    this._container = d3.select(container);

    this._title = this._container
      .append('text')
      .attr('class', 'title')
      .attr('dy', '-0.7em');

    this._backbone = this._container
      .append('rect')
      .attr('class', 'backbone')
      .style('fill', 'steelblue');

    this._eventsContainers = this._container
      .selectAll('.event')
      .data(this._data.events)
      .enter()
      .append('g')
      .attr('class', 'event');

    this._events = this._data.events.map(function(d, i) {
      return Event.getInstance(this)
        .setData(d)
        .renderTo(this._eventsContainers.nodes()[i])
    }.bind(this))

    return this;
  }


  /**
   * Update timeline.
   * @public
   * @returns {Timeline}
   */
  update() {

    this._title
      .style('fill', '#404040')
      .style('font-family', 'sans-serif')
      .text(this._data.name);

    this._events.forEach(event => event.update());

    return this;
  }


  /**
   * Resize timeline.
   * @public
   * @returns {Timeline}
   */
  resize() {

    this._backbone
      .attr('width', function(d) {
        return this._xScale(this.getMaxDate(d)) - this._xScale(this.getMinDate(d));
      }.bind(this))
      .attr('height', this.getHeight() - 38)
      .attr('x', function(d) {
        return this._xScale(this.getMinDate(d));
      }.bind(this))
      .attr('y', 19);

    this._title
      .attr('y', this.getHeight() / 2)

    this._events.forEach(event => event.resize());

    return this;
  }


  /**
   * Get timeline's container height.
   * @public
   * @returns {Number}
   */
  getHeight() {

    return this._zTimeline.getBandHeight();
  }


  /**
   * Get interval min date.
   * @public
   * @returns {Date}
   */
  getMaxDate(d) {

    return new Date(d.interval[1]);
  }


  /**
   * Get interval max date.
   * @public
   * @returns {Date}
   */
  getMinDate(d) {

    return new Date(d.interval[0]);
  }
}