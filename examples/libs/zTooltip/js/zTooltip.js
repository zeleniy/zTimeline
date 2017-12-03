/**
 * @public
 * @class
 */
class ZTooltip {


  /**
    * @public
    * @constructor
    * @param {Object} options
    * @param {'top'|'right'|'bottom'|'left'} options.position
    * @param {Object} options.offset
    * @param {Number} options.offset.x
    * @param {Number} options.offset.y
    */
  constructor(options) {

    this._config = new ZConfig(options);

    this._tip = d3.select('body')
      .append('div')
      .attr('class', 'z-tooltip')
      .style('display', 'none')
      .style('z-index', '99');
  }


  /**
   * @public
   * @static
   * @param {Object} options
   * @returns {ZTooltip}
   */
  static getInstance(options) {

    return new ZTooltip(options);
  }


  /**
   * Remove tooltip container.
   * @public
   * @returns {ZTooltip}
   */
  remove() {

    this._tip.remove();
    return this;
  }


  /**
   * @public
   * @param {String} content
   * @returns {ZTooltip}
   */
  setContent(content) {

    this._content = content;
    return this;
  }


  /**
   * @public
   * @param {HTMLElement|SVGElement} element
   * @returns {ZTooltip}
   */
  showOn(element) {

    this._tip.html(
      '<table>' +
        '<tbody>' +
          this._content +
        '</tbody>' +
      '</table>'
    ).style('display', 'block');

    const elementBox = element.getBoundingClientRect();
    const tooltipBox = this._tip.node().getBoundingClientRect();

    var x = elementBox.x + this.getScrollXOffset();
    var y = elementBox.y + this.getScrollYOffset();

    const xOffset = this._config.get('offset.x', 5);
    const yOffset = this._config.get('offset.y', 5);

    switch (this._config.get('position', 'top')) {
      case 'top': {
        x -= (tooltipBox.width - elementBox.width) / 2;
        y -= tooltipBox.height + yOffset;
      }; break;
      case 'right': {
        x += elementBox.width + xOffset;
        y -= (tooltipBox.height - elementBox.height) / 2;
      }; break;
      case 'bottom': {
        x -= (tooltipBox.width - elementBox.width) / 2;
        y += elementBox.height + yOffset;
      }; break;
      case 'left': {
        x -= tooltipBox.width + xOffset;
        y -= (tooltipBox.height - elementBox.height) / 2;
      }; break;
    };

    this._tip
      .style('left', x + 'px')
      .style('top', y + 'px');

    return this;
  }


  /**
   * Get document scroll offset from left.
   * @public
   * @returns {Number}
   */
  getScrollXOffset() {

    return (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0);
  }


  /**
   * Get document scroll offset from top.
   * @public
   * @returns {Number}
   */
  getScrollYOffset() {

    return (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);
  }
}