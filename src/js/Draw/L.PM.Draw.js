import SnapMixin from '../Mixins/Snapping';

const Draw = L.Class.extend({
  includes: [SnapMixin],
  options: {
    snappable: true,
    snapDistance: 20,
    tooltips: true,
    cursorMarker: true,
    finishOnDoubleClick: false,
    finishOn: null,
    allowSelfIntersection: true,
    templineStyle: {},
    hintlineStyle: {
      color: '#3388ff',
      dashArray: '5,5',
    },
    markerStyle: {
      draggable: true,
    },
  },
  setOptions(options) {
    L.Util.setOptions(this, options);
  },
  initialize(map) {
    // save the map
    this._map = map;

    // define all possible shapes that can be drawn
    this.shapes = ['Marker', 'CircleMarker', 'Line', 'Polygon', 'Rectangle', 'Circle', 'Cut'];

    // initiate drawing class for our shapes
    this.shapes.forEach(shape => {
      this[shape] = new L.PM.Draw[shape](this._map);
    });
  },
  setPathOptions(options) {
    this.options.pathOptions = options;
  },
  getShapes() {
    // if somebody wants to know what shapes are available
    return this.shapes;
  },
  enable(shape, options) {
    if (!shape) {
      throw new Error(
        `Error: Please pass a shape as a parameter. Possible shapes are: ${this.getShapes().join(
          ','
        )}`
      );
    }

    // disable drawing for all shapes
    this.disable();

    // enable draw for a shape
    this[shape].enable(options);
  },
  disable() {
    // there can only be one drawing mode active at a time on a map
    // so it doesn't matter which one should be disabled.
    // just disable all of them
    this.shapes.forEach(shape => {
      this[shape].disable();
    });
  },
  addControls() {
    // add control buttons for our shapes
    this.shapes.forEach(shape => {
      this[shape].addButton();
    });
  },
  getActiveShape(){
    // returns the active shape
    var enabledShape = undefined;
    this.shapes.forEach(shape => {
      if(this[shape]._enabled){
        enabledShape = shape;
      }
    });
    return enabledShape;
  },
  _setGlobalDrawMode() {
    // extended to all PM.Draw shapes
    if(this._shape === "Cut"){
      this._map.fire('pm:globalcutmodetoggled', {
        enabled: !!this._enabled,
        map: this._map,
      });
    }else {
      this._map.fire('pm:globaldrawmodetoggled', {
        enabled: this._enabled,
        shape: this._shape,
        map: this._map,
      });
    }
  },

});

export default Draw;
