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

    var css = this._config.get('css', {});
    for (var i in css) {
      this._tip.style(i, css[i])
    }
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
   * @param {HTMLElement|SVGElement|Number} element
   * @param {Number} [y]
   * @returns {ZTooltip}
   */
  showOn(element, y) {

    if (arguments.length == 1) {
      this._showOnElement(element);
    } else {
      this._showByXY(element, y);
    }

    return this;
  }


  _showByXY(x, y) {

    this._tip.html(this._content)
      .style('display', 'block');

      const tooltipBox = this._tip.node().getBoundingClientRect();

      x += this.getScrollXOffset();
      y += this.getScrollYOffset();

      const xOffset = this._config.get('offset.x', 5);
      const yOffset = this._config.get('offset.y', 5);

      switch (this._config.get('position', 'top')) {
        case 'top': {
          x -= tooltipBox.width / 2;
          y -= tooltipBox.height + yOffset;
        }; break;
        case 'right': {
          x += xOffset;
          y -= tooltipBox.height / 2;
        }; break;
        case 'bottom': {
          x -= tooltipBox.width / 2;
          y += yOffset;
        }; break;
        case 'left': {
          x -= tooltipBox.width + xOffset;
          y -= tooltipBox.height / 2;
        }; break;
      };

      this._showTip(x, y);
  }


  _showOnElement(element) {

    this._tip.html(this._content)
      .style('display', 'block');

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

      this._showTip(x, y);
  }


  /**
   * @private
   * @param {Number} x
   * @param {Number} y
   */
  _showTip(x, y) {

    if (x < 0) {
      x = 0;
    }

    this._tip
      .style('left', x + 'px')
      .style('top', y + 'px');
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