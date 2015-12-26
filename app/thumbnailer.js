// returns a function that calculates lanczos weight
function lanczosCreate(lobes) {
  return function(x) {
    if (x > lobes)
      return 0;
    x *= Math.PI;
    if (Math.abs(x) < 1e-16)
      return 1;
    var xx = x / lobes;
    return Math.sin(x) * Math.sin(xx) / x / xx;
  };
}


// elem: canvas element, img: image element, sx: scaled width, lobes: kernel radius
function thumbnailer(elem, img, sx, lobes) {
  var options = {};
  options.canvas = elem;
  elem.width = img.width;
  elem.height = img.height;
  elem.style.display = "none";
  options.ctx = elem.getContext("2d");
  options.ctx.drawImage(img, 0, 0);
  options.img = img;
  options.src = options.ctx.getImageData(0, 0, img.width, img.height);
  options.dest = {
    width : sx,
    height : Math.round(img.height * sx / img.width),
  };
  options.dest.data = new Array(options.dest.width * options.dest.height * 3);
  options.lanczos = lanczosCreate(lobes);
  options.ratio = img.width / sx;
  options.rcp_ratio = 2 / options.ratio;
  options.range2 = Math.ceil(options.ratio * lobes / 2);
  options.cacheLanc = {};
  options.center = {};
  options.icenter = {};
  process1(options, 0);
}

function process1(options, u) {
  options.center.x = (u + 0.5) * options.ratio;
  options.icenter.x = Math.floor(options.center.x);
  for (var v = 0; v < options.dest.height; v++) {
    options.center.y = (v + 0.5) * options.ratio;
    options.icenter.y = Math.floor(options.center.y);
    var a, r, g, b;
    a = r = g = b = 0;
    for (var i = options.icenter.x - options.range2; i <= options.icenter.x + options.range2; i++) {
      if (i < 0 || i >= options.src.width)
        continue;
      var f_x = Math.floor(1000 * Math.abs(i - options.center.x));
      if (!options.cacheLanc[f_x])
        options.cacheLanc[f_x] = {};
      for (var j = options.icenter.y - options.range2; j <= options.icenter.y + options.range2; j++) {
        if (j < 0 || j >= options.src.height)
          continue;
        var f_y = Math.floor(1000 * Math.abs(j - options.center.y));
        if (options.cacheLanc[f_x][f_y] == undefined)
          options.cacheLanc[f_x][f_y] = options.lanczos(Math.sqrt(Math.pow(f_x * options.rcp_ratio, 2)
              + Math.pow(f_y * options.rcp_ratio, 2)) / 1000);
        var weight = options.cacheLanc[f_x][f_y];
        if (weight > 0) {
          var idx = (j * options.src.width + i) * 4;
          a += weight;
          r += weight * options.src.data[idx];
          g += weight * options.src.data[idx + 1];
          b += weight * options.src.data[idx + 2];
        }
      }
    }
    var idx = (v * options.dest.width + u) * 3;
    options.dest.data[idx] = r / a;
    options.dest.data[idx + 1] = g / a;
    options.dest.data[idx + 2] = b / a;
  }

  if (++u < options.dest.width)
    process1(options, u);
  else
    process2(options);
};

function process2(options) {
  options.canvas.width = options.dest.width;
  options.canvas.height = options.dest.height;
  options.ctx.drawImage(options.img, 0, 0, options.dest.width, options.dest.height);
  options.src = options.ctx.getImageData(0, 0, options.dest.width, options.dest.height);
  var idx, idx2;
  for (var i = 0; i < options.dest.width; i++) {
    for (var j = 0; j < options.dest.height; j++) {
      idx = (j * options.dest.width + i) * 3;
      idx2 = (j * options.dest.width + i) * 4;
      options.src.data[idx2] = options.dest.data[idx];
      options.src.data[idx2 + 1] = options.dest.data[idx + 1];
      options.src.data[idx2 + 2] = options.dest.data[idx + 2];
    }
  }
  options.ctx.putImageData(options.src, 0, 0);
  options.canvas.style.display = "block";
};

module.exports = thumbnailer;
