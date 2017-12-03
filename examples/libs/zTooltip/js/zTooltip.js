/**
 * @public
 * @class
 */
class ZTooltip {


  /**
    * @public
    */
  constructor(position = 'top') {

    this._position = position;
    this._yOffset = 5;
    this._xOffset = 5;

    this._tip = d3.select('body')
      .append('div')
      .attr('class', 'z-tooltip')
      .style('display', 'none')
      .style('z-index', '99');
  }


  /**
   * @public
   * @static
   */
  static getInstance(position = 'top') {

    return new ZTooltip(position);
  }


  /**
   * Remove tooltip container.
   * @public
   */
  remove() {

    this._tip.remove();
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

    var x = elementBox.x;
    var y = elementBox.y;

    switch (this._position) {
      case 'top': {
        x -= (tooltipBox.width - elementBox.width) / 2;
        y -= tooltipBox.height + this._yOffset;
      }; break;
      case 'right': {
        
      }; break;
      case 'bottom': {
        
      }; break;
      case 'left': {
        
      }; break;
    };

    this._tip
    .style('left', x + 'px')
    .style('top', y + 'px');

    return this;
  }
}