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

    this._outerR = 10;
    this._innerR = 5;
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


  getData() {

    return this._data;
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
      .on('mouseenter', this._mouseEnterEventHandler.bind(this))
      .on('mouseleave', this._mouseLeaveEventHandler.bind(this))
      .on('click', function(d) {

      });

    this._outerCircle = this._container
      .append('circle');

    this._innerCircle = this._container
      .append('circle');

    return this;
  }


  /**
   * Get container.
   * @public
   * @returns {SVGElement}
   */
  getContainer() {

    return this._container.node();
  }


  /**
   * Get dimensions box.
   * @public
   * @returns {Object}
   */
  getBox() {

    return this.getContainer().getBoundingClientRect();
  }


  /**
   * Get center coordinates.
   * @public
   * @return {Object}
   */
  getCenter() {

    const box = this.getBox();

    return {
      x: box.left + box.width / 2,
      y: box.top + box.height / 2
    };
  }


  /**
   * @private
   */
  _mouseEnterEventHandler() {

    this._timeline
      .getZTimeline()
      .setLinePointerTo(this);
  }


  /**
   * @private
   */
  _mouseLeaveEventHandler() {

    this._timeline
      .getZTimeline()
      .resetLinePointer();
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

    const x = this.getX();
    const y = this.getY();

    this._outerCircle
      .attr('r', this._outerR)
      .attr('cx', x)
      .attr('cy', y)
      .style('fill', 'steelblue');

    this._innerCircle
      .attr('r', this._innerR)
      .attr('cx', x)
      .attr('cy', y)
      .style('fill', 'white');

    return this;
  }


  /**
   * Get X coordinate.
   * @public
   * @returns {Number}
   */
  getX() {

    return this._xScale(new Date(this._data.date));
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