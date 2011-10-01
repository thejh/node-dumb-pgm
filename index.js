module.exports = Image

function Image(buf, width, height, maxcolor) {
  this.buf = buf
  this.width = width
  this.height = height
  this.maxcolor = maxcolor
}

Image.prototype.set = function(x, y, value) {
  this.buf[y*this.width + x] = value
}

Image.prototype.get = function(x, y) {
  return this.buf[y*this.width + x]
}

Image.prototype.toBuffer = function() {
  var headers = 'P5\n'+this.width+' '+this.height+'\n'+this.maxcolor+'\n'
  return bufConcat(new Buffer(headers), this.buf)
}

Image.parse = function(b) {
  if (!bufEq(new Buffer('P5'), nextLine()))
    throw new Error('unsupported file format')
  var dimensions = nextLine().toString('utf8').split(' ').map(function(numstr) {
    return parseInt(numstr, 10)
  })
  var width = dimensions[0]
  if (width < 1)
    throw new Error('width musnt be smaller than 1')
  var height = dimensions[1]
  if (height < 1)
    throw new Error('height musnt be smaller than 1')
  var maxcolor = parseInt(nextLine().toString('utf8'), 10)
  if (maxcolor > 255)
    throw new Error('multi-byte colors arent supported')
  if (b.length !== width*height)
    throw new Error('file length is different from expected value')
  
  return new Image(b, width, height, maxcolor)
  
  function nextLine() {
    var newlineIndex = indexOf(b, char('\n'), true)
    var lineBuf = b.slice(0, newlineIndex)
    b = b.slice(newlineIndex+1)
    if (lineBuf[0] === char('#')) return nextLine()
    return lineBuf
  }
}


// === helpers ===
function bufEq(a, b) {
  if (a.length !== b.length) return false
  for (var i=0; i<a.length; i++)
    if (a[i] !== b[i]) return false
  return true
}

function indexOf(arraylike, target, needed) {
  for (var i=0; i<arraylike.length; i++)
    if (arraylike[i] === target)
      return i
  if (needed)
    throw new Error('needed thing not found')
  return -1
}

function char(str) {
  return str.charCodeAt(str)
}

function bufConcat(a, b) {
  var result = new Buffer(a.length + b.length)
  a.copy(result)
  b.copy(result, a.length)
  return result
}
