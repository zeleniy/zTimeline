/**
 * @private
 * @class
 */
class Event {


  /**
   * @public
   * @constructor
   * @param {Timeline} timeline
   */
  constructor(timeline) {

    this._timeline = timeline;
    this._xScale = timeline._xScale;
    this._tooltip = undefined;
  }


  /**
   * @public
   * @static
   * @returns {Timeline}
   */
  static getInstance(timeline) {

    return new Event(timeline);
  }


  /**
   * Set data.
   * @public
   * @param {Object} data
   * @returns {Event}
   */
  setData(data) {

    this._data = data;
    return this;
  }


  /**
   * Render Event.
   * @public
   * @param {SVGElement} container
   * @returns {Event}
   */
  renderTo(container) {

    this._container = d3.select(container);

    this._container
      .on('mouseenter', function(d) {
        this._tooltip = ZTooltip.getInstance()
          .setContent(d.title)
          .showOn(this);
      }).on('mouseleave', function() {
        this._tooltip.remove();
      }).on('click', function(d) {

      });

    this._outerCircle = this._container
      .append('circle');

    this._innerCircle = this._container
      .append('circle');

    return this;
  }


  /**
   * Update Event.
   * @public
   * @returns {Event}
   */
  update() {

    return this;
  }


  /**
   * Resize Event.
   * @public
   * @returns {Event}
   */
  resize() {

    const x = this._xScale(new Date(this._data.date));
    const y = this.getY();

    this._outerCircle
      .attr('r', 10)
      .attr('cx', x)
      .attr('cy', y)
      .style('fill', 'steelblue');

    this._innerCircle
      .attr('r', 5)
      .attr('cx', x)
      .attr('cy', y)
      .style('fill', 'white');

    return this;
  }


  /**
   * Get Y coordinate.
   * @public
   * @returns {Number}
   */
  getY() {

    return this._timeline.getHeight() / 2;
  }
}