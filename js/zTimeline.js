/**
 * @public
 * @class
 * @author Alexandr Zelenin <zeleniy.spb@gmail.com>
 */
class ZTimeline {


  /**
   * @public
   * @constructor
   * @param {Object} [options={}]
   * @param {Object} [options.axes]
   * @param {Object} [options.axes.x]
   * @param {Object} [options.axes.x.grid]
   * @param {Boolean} [options.axes.x.grid.show=true]
   */
  constructor(options) {

    this._config = new ZConfig(options);
    this._bandHeight = 50;
    this._xAxisHeight = 33;
    this._margin = {
      top: 10,
      right: 10,
      bottom: 0,
      left: 10
    };

    this._xScale = d3.scaleTime();
    this._xAxis = d3.axisBottom(this._xScale);
  }


  /**
   * @public
   * @static
   * @param {Object} [options={}]
   * @returns {ZTimeline}
   */
  static getInstance(options) {

    return new ZTimeline(options);
  }


  /**
   * @public
   * @param {Event}
   */
  setLinePointerTo(event) {

    this._eventTip = ZTooltip.getInstance()
      .setContent(event.getData().title)
      .showOn(event.getContainer());

    this._axisTip = ZTooltip.getInstance({ offset: { y : 0 } })
      .setContent(event.getData().date)
      .showOn(event.getCenter().x, this.getOuterHeight());

    if (this._config.get('axes.x.pointer.show', false)) {
      this._linePointer = this._canvas
        .append('line')
        .attr('class', 'pointer')
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .attr('x1', event.getX())
        .attr('y1', - this._margin.top)
        .attr('x2', event.getX())
        .attr('y2', this.getInnerHeight());
    }
  }


  /**
   * @public
   */
  resetLinePointer() {

    if (this._config.get('axes.x.pointer.show', false)) {
      this._linePointer.remove();
    }

    this._eventTip.remove();
    this._axisTip.remove();
  }


  /**
   * Get band height.
   * @public
   * @returns {Number}
   */
  getBandHeight() {

    return this._bandHeight;
  }


  /**
   * Set data.
   * @public
   * @param {Object} dataSet
   * @returns {ZTimeline}
   */
  setData(dataSet) {

    this._dataSet = dataSet;
    return this;
  }


  /**
   * Render chart.
   * @public
   * @param {HTMLElement} container
   * @returns {ZTimeline}
   */
  renderTo(container) {

    this._container = d3.select(container);

    this._div = this._container
      .append('div')
      .attr('class', 'z-timeline');

    this._title = this._div
      .append('div')
      .attr('class', this._dataSet.title ? 'title' : null);

    this._svg = this._div
      .append('svg')
      .attr('class', 'z-timeline');

    this._canvas = this._svg
      .append('g')
      .attr('class', 'canvas');

    this._xAxisContainer = this._canvas
      .append('g')
      .attr('class', 'axis x-axis');

    this._bandsContainer = this._canvas
      .append('g')
      .attr('class', 'bands-container');

    this._bands = this._bandsContainer
      .selectAll('g.band')
      .data(this._dataSet.data)
      .enter()
      .append('g')
      .attr('class', 'band')
      .attr('transform', function(d, i) {
        return 'translate(' + [0, i * this._bandHeight] + ')'
      }.bind(this));

    this._timelines = this._dataSet.data.map(function(d, i) {
      return Timeline.getInstance(this)
        .setData(d)
        .renderTo(this._bands.nodes()[i]);
    }.bind(this));

    return this.update();
  }


  /**
   * Update chart.
   * @public
   * @returns {ZTimeline}
   */
  update() {

    this._xScale
      .rangeRound([0, this.getInnerWidth()])
      .domain(this.getXDomain());

    this._title.text(this._dataSet.title)

    this._timelines.forEach(timeline => timeline.update())

    return this.resize();
  }


  /**
   * Resize chart.
   * @public
   * @returns {ZTimeline}
   */
  resize() {

    this._svg
      .attr('width', this.getOuterWidth())
      .attr('height', this.getInnerHeight() + this._xAxisHeight);

    this._canvas
      .attr('transform', 'translate(' + this._margin.left + ', ' + this._margin.top + ')');

    this._xAxis
      .tickSizeInner(this._config.get('axes.x.grid.show', true) ? - this.getOuterHeight() : 6)
      .tickPadding(6);

    this._xAxisContainer
      .attr('transform', 'translate(' + [0, this.getInnerHeight()] + ')')
      .call(this._xAxis);

    this._timelines.forEach(timeline => timeline.resize())

    return this;
  }


  /**
   * Get X axis domain.
   * @public
   * @returns {Date[]}
   */
  getXDomain() {

    const dateSet = this._dataSet.data.reduce(function(result, eventSet, index) {
      return result.concat(eventSet.interval)
    }, []).map(function(d) {
      return new Date(d);
    });

    return d3.extent(dateSet);
  }


  /**
   * Get chart outer width.
   * @public
   * @returns {Number}
   */
  getOuterWidth() {

    return this._container
      .node()
      .getBoundingClientRect()
      .width;
  }


  /**
   * Get chart inner width.
   * @public
   * @returns {Number}
   */
  getInnerWidth() {

    return this.getOuterWidth() - this._margin.left - this._margin.right;
  }


  /**
   * Get chart outer height.
   * @public
   * @returns {Number}
   */
  getOuterHeight() {

    return this._container
      .node()
      .getBoundingClientRect()
      .height;
  }


  /**
   * Get chart inner height.
   * @public
   * @returns {Number}
   */
  getInnerHeight() {

    return this._bandHeight * this._dataSet.data.length;
  }
}