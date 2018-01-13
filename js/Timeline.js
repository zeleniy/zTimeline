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
      .append('g')
      .attr('class', 'events')
      .selectAll('.event')
      .data(this._config.get('events', []))
      .enter()
      .append('g')
      .attr('class', 'event');

    this._events = this._config.get('events', [])
      .map(function(d, i) {
        return Event.getInstance(this)
          .setData(d)
          .renderTo(this._eventsContainers.nodes()[i])
      }.bind(this));

    const self = this;
    this._spans = this._container
      .append('g')
      .attr('class', 'spans')
      .selectAll('.span')
      .data(this._config.get('spans', []))
      .enter()
      .append('rect')
      .attr('class', 'span')
      .style('fill', function(d, i) {
        return d.color || d3.schemeCategory10[i % d3.schemeCategory10.length];
      }).on('mouseenter', function(d) {
        self._spanMouseEnterEventHandler(this, d);
      }).on('mouseout', function(d) {
        self._spanMouseOutEventHandler(this, d);
      });

    return this;
  }


  /**
   * @private
   * @param {Element} element
   * @param {Object} data
   */
  _spanMouseEnterEventHandler(element, d) {

    const container = d3.select(document.createElement("div"));

    container.append('div')
      .style('font-weight', 'bolder')
      .text(d.name);

    container.append('div')
      .text(d.range[0] + ' – ' + d.range[1]);

    this._spanTip = ZTooltip.getInstance()
      .setContent(container.html())
      .showOn(element);
  }


  /**
   * @private
   * @param {Element} element
   * @param {Object} data
   */
  _spanMouseOutEventHandler(element, d) {

    this._spanTip.remove();
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
          return this._xScale(this.getMaxDate()) - this._xScale(this.getMinDate());
        }.bind(this))
        .attr('height', this.getHeight() - 38)
        .attr('x', function(d) {
          return this._xScale(this.getMinDate());
        }.bind(this))
        .attr('y', 19);
    }

    this._title
      .attr('y', this.getHeight() / 2)

    this._events.forEach(event => event.resize());

    this._spans
      .attr('width', function(d) {
        return this._xScale(new Date(d.range[1])) - this._xScale(new Date(d.range[0]));
      }.bind(this))
      .attr('height', this.getHeight() - 38)
      .attr('x', function(d) {
        return this._xScale(new Date(d.range[0]));
      }.bind(this))
      .attr('y', 19);

    return this;
  }


  /**
   * @private
   * @returns {Boolean}
   */
  _hasBackbone() {

    return (this._config.is('interval', true) && this._config.get('events', []).length > 1) ||
      (this._config.is('interval', true) && this._config.get('spans', []).length > 0) ||
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
   * @public
   * @static
   * @param {Object} data
   * @returns {Date[]}
   */
  static getInterval(data) {

    var interval = [];

    if (Array.isArray(data.interval)) {
      interval = interval.concat(data.interval);
    }

    if (Array.isArray(data.events)) {
      interval = interval.concat(data.events.map(e => e.date));
    }

    if (Array.isArray(data.spans)) {
      interval = interval.concat(data.spans.reduce((r, s) => r.concat([s.range[0], s.range[1]]), []));
    }

    return d3.extent(interval, d => new Date(d));
  }


  /**
   * Get interval min date.
   * @public
   * @returns {Date}
   */
  getMaxDate() {

    return Timeline.getInterval(this._config.getOptions())[1];
  }


  /**
   * Get interval max date.
   * @public
   * @returns {Date}
   */
  getMinDate() {

    return Timeline.getInterval(this._config.getOptions())[0];
  }
}