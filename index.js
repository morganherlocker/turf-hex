var polygon = require('turf-polygon');

module.exports = hexgrid;

//Creates a FeatureCollection of flat-topped
// hexagons aligned in an "odd-q" vertical grid as
// described on http://www.redblobgames.com/grids/hexagons/
function hexgrid(extents, size, done) {
  var xmin = extents[0];
  var ymin = extents[1];
  var xmax = extents[2];
  var ymax = extents[3];

  var fc = {
    type: 'FeatureCollection',
    features: []
  };

  var x_interval = 3/2 * size;
  var y_interval = Math.sqrt(3) * size;
  var x_count = (xmax - xmin) / x_interval;
  var y_count = (ymax - ymin) / y_interval;

  for (var x = 0; x <= x_count; x++) {
    for (var y = 0; y <= y_count; y++) {

      var center_x = x * x_interval + xmin;
      var center_y = y * y_interval + ymin;
      if (x % 2 === 1) {
        center_y -= y_interval/2;
      }
      fc.features.push(hexagon([center_x, center_y], size));
    }
  }

  done = done || function () {};
  done(null, fc);

  return fc;
}

//center is [x, y]
function hexagon(center, size) {
  var idx = [0,1,2,3,4,5];
  var angles = idx.map(function (i) {
    return 2 * Math.PI/6 * i;
  });

  var vertices = idx.reduce(function (verts, i) {
    var angle = angles[i];
    var x = center[0] + size * Math.cos(angle);
    var y = center[1] + size * Math.sin(angle);

    verts.push([x,y]);
    return verts;
  }, []);

  //first and last vertex must be the same
  vertices.push(vertices[0]);

  return polygon([vertices]);
}