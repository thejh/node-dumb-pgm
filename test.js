var Image = require('./index')
  , fs = require('fs')

var img = Image.parse(fs.readFileSync(__dirname+'/test.pgm'))

for (var y=0; y<img.height; y++)
  for (var x=img.width-1; x>0; x--) {
    img.set(x, y, img.get(x, y) - img.get(x-1, y))
  }
fs.writeFileSync(__dirname+'/test-out.pgm', img.toBuffer())

function mod(n, m) {
  while (n<0) n+=m
  return n%m
}
