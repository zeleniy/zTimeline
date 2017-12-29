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
   * @public
   * @returns {ZTimeline}
   */
  getZTimeline() {

    return this._zTimeline;
  }


  /**
   * Set data.
   * @public
   * @param {Object} data
   * @returns {Timeline}
   */
  setData(data) {

    this._config = new ZConfig(data);
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

    if (this._hasBackbone()) {
      this._backbone = this._container
        .append('rect')
        .attr('class', 'backbone')
        .style('fill', 'steelblue');
    }

    this._eventsContainers = this._container
      .selectAll('.event')
      .data(this._config.get('events'))
      .enter()
      .append('g')
      .attr('class', 'event');

    this._events = this._config.get('events').map(function(d, i) {
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
      .text(this._config.get('name'));

    this._events.forEach(event => event.update());

    return this;
  }


  /**
   * Resize timeline.
   * @public
   * @returns {Timeline}
   */
  resize() {

    if (this._hasBackbone()) {
      this._backbone
        .attr('width', function(d) {
//          console.log(this._config.get('name'), this._hasBackbone(), this._xScale(this.getMaxDate(d)) - this._xScale(this.getMinDate(d)))
          return this._xScale(this.getMaxDate(d)) - this._xScale(this.getMinDate(d));
        }.bind(this))
        .attr('height', this.getHeight() - 38)
        .attr('x', function(d) {
          return this._xScale(this.getMinDate(d));
        }.bind(this))
        .attr('y', 19);
    }

    this._title
      .attr('y', this.getHeight() / 2)

    this._events.forEach(event => event.resize());

    return this;
  }


  /**
   * @private
   * @returns {Boolean}
   */
  _hasBackbone() {

    return (this._config.is('interval', true) && this._config.get('events').length > 1) ||
      (Array.isArray(this._config.get('interval')) && this._config.get('interval').length > 1);
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

    if (this._config.is('interval', true)) {
      return d3.max(this._config.get('events', []), v => new Date(v.date));
    } else {
      return new Date(d.interval[1]);
    }
  }


  /**
   * Get interval max date.
   * @public
   * @returns {Date}
   */
  getMinDate(d) {

    if (this._config.is('interval', true)) {
      return d3.min(this._config.get('events', []), v => new Date(v.date));
    } else {
      return new Date(d.interval[0]);
    }
  }
}