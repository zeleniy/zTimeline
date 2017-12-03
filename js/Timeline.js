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
   * @static
   * @returns {Timeline}
   */
  static getInstance(zTimeline) {

    return new Timeline(zTimeline);
  }


  /**
   * Set data.
   * @param {Object} data
   * @returns {Timeline}
   */
  setData(data) {

    this._data = data;
    return this;
  }


  /**
   * Render timeline.
   * @param {SVGElement} container
   * @returns {Timeline}
   */
  renderTo(container) {

    this._container = d3.select(container);

    this._backbone = this._container
      .append('rect')
      .attr('class', 'backbone');

    this._events = this._container
      .selectAll('.event')
      .data(this._data.events)
      .enter()
      .append('circle')
      .attr('class', 'event');

    return this;
  }


  /**
   * Update timeline.
   * @returns {Timeline}
   */
  update() {

    return this;
  }


  /**
   * Resize timeline.
   * @returns {Timeline}
   */
  resize() {

    this._backbone
      .attr('width', function(d) {
        return this._xScale(this.getMaxDate(d)) - this._xScale(this.getMinDate(d));
      }.bind(this))
      .attr('height', this.getHeight() - 36)
      .attr('x', function(d) {
        return this._xScale(this.getMinDate(d));
      }.bind(this))
      .attr('y', 18);

    this._events
      .attr('r', 10)
      .attr('cx', d => this._xScale(new Date(d.date)))
      .attr('cy', this.getHeight() / 2);

    return this;
  }


  /**
   * Get timeline's container height.
   * @returns {Number}
   */
  getHeight() {

    return this._zTimeline.getBandHeight();
  }


  /**
   * Get interval min date.
   * @returns {Date}
   */
  getMaxDate(d) {

    return new Date(d.interval[1]);
  }


  /**
   * Get interval max date.
   * @returns {Date}
   */
  getMinDate(d) {

    return new Date(d.interval[0]);
  }
}