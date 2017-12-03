/**
 * @public
 * @class
 * @author Alexandr Zelenin <zeleniy.spb@gmail.com>
 */
class ZTimeline {


  /**
   * @public
   * @constructor
   */
  constructor() {

    this._bandHeight = 50;
    this._xAxisHeight = 33;
    this._margin = {
      top: 10,
      right: 10,
      bottom: 0,
      left: 100
    };

    this._xScale = d3.scaleTime();
    this._xAxis = d3.axisBottom(this._xScale);

    this._yScale = d3.scaleBand();
    this._yAxis = d3.axisLeft(this._yScale);
  }


  /**
   * @static
   * @returns {ZTimeline}
   */
  static getInstance() {

    return new ZTimeline();
  }


  getBandHeight() {

    return this._bandHeight;
  }


  /**
   * Set data.
   * @param {Object[]} data
   * @returns {ZTimeline}
   */
  setData(data) {

    this._data = data;
    return this;
  }


  /**
   * @public
   * @param {HTMLElement} container
   * @returns {ZTimeline}
   */
  renderTo(container) {

    this._container = d3.select(container);

    this._svg = this._container
      .append('svg');

    this._canvas = this._svg
      .append('g')
      .attr('class', 'canvas');

    this._xAxisContainer = this._canvas
      .append('g')
      .attr('class', 'axis x-axis');

    this._yAxisContainer = this._canvas
      .append('g')
      .attr('class', 'axis y-axis');

    this._bandsContainer = this._canvas
      .append('g')
      .attr('class', 'bands-container');

    this._bands = this._bandsContainer
      .selectAll('g.band')
      .data(this._data)
      .enter()
      .append('g')
      .attr('class', 'band')
      .attr('transform', function(d, i) {
        return 'translate(' + [0, i * this._bandHeight] + ')'
      }.bind(this));

    this._timelines = this._data.map(function(d, i) {
      return Timeline.getInstance(this)
        .setData(d)
        .renderTo(this._bands.nodes()[i]);
    }.bind(this));

    return this.update();
  }


  /**
   * Update chart
   * @returns ZTimeline
   */
  update() {

    this._xScale
      .rangeRound([0, this.getInnerWidth()])
      .domain(this.getXDomain());

    this._yScale
      .rangeRound([0, this.getInnerHeight()])
      .domain(this.getYDomain());

    this._timelines.forEach(timeline => timeline.update())

    return this.resize();
  }


  /**
   * Resize chart.
   * @returns ZTimeline
   */
  resize() {

    this._svg
      .attr('width', '100%')
      .attr('height', this.getOuterHeight())
      .attr('class', 'z-timeline');

    this._canvas
      .attr('transform', 'translate(' + this._margin.left + ', ' + this._margin.top + ')');

    this._xAxisContainer
      .attr('transform', 'translate(' + [0, this.getInnerHeight()] + ')')
      .call(this._xAxis);

    this._yAxisContainer
      .call(this._yAxis);

    this._timelines.forEach(timeline => timeline.resize())

    return this;
  }


  /**
   * Get X axis domain.
   * @returns {Date[]}
   */
  getXDomain() {

    const dateSet = this._data.reduce(function(result, eventSet, index) {
      return result.concat(eventSet.interval)
    }, []).map(function(d) {
      return new Date(d);
    });

    return d3.extent(dateSet);
  }


  /**
   * Get Y axis domain.
   * @returns {String[]}
   */
  getYDomain() {

    return this._data.map(d => d.name);
  }


  /**
   * Get chart outer width.
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
   * @returns {Number}
   */
  getInnerWidth() {

    return this.getOuterWidth() - this._margin.left - this._margin.right;
  }


  /**
   * Get chart outer height.
   * @returns {Number}
   */
  getOuterHeight() {

    return this.getInnerHeight() + this._xAxisHeight;
  }


  /**
   * Get chart inner height.
   * @returns {Number}
   */
  getInnerHeight() {

    return this._bandHeight * this._data.length;
  }
}