var fs = require('fs')
var zlib = require('zlib')
var buf = new Buffer(1024)

var testFs1 = function () {
  console.log('准备打开已存在的文件！')
  fs.open('f:/000.txt', 'r+', function (err, fd) {
    if (err) {
      return console.error(err)
    }
    console.log('文件打开成功！')
    console.log('准备读取文件：')

    fs.read(fd, buf, 0, buf.length, iPos, function (err, bytes) {
      if (err) {
        console.log(err)
      }

      console.log('xx')

      console.log(bytes + '  字节被读取')

      // 仅输出读取的字节
      if (bytes > 0) {
        console.log(buf.slice(0, bytes).toString())
        iPos += bytes
      }
    })

    console.log(iPos)
  })
}
// testFs1();

var testFs2 = function () {
  console.log('压缩文件')
  const r = fs.createReadStream('/test/001.txt')
  const z = zlib.createGzip()
  const w = fs.createWriteStream('/test/001.txt.gz')
  r.pipe(z).pipe(w)
}
// testFs2();
// setImmediate

var testFs3 = function () {
  var buf = Buffer.allocUnsafe(100)
  buf[0] = 0x30
  buf[2] = 0x32
  buf[4] = 0x34
}
// testFs3();

var testFs4 = function () {
  fs.stat('f:/000.txt', (err, stats) => {
    if (err) throw err
    console.log(`stats: ${JSON.stringify(stats)}`)
  })
}
// testFs4();

var testFs5 = function () {
  var readstream = fs.createReadStream('f:/000.txt')
  readstream.on('error', (err) => {
    console.log(err.message)
  })
  readstream.on('data', function (chunk) {
    console.log('read', chunk.length)
  })
  readstream.on('end', function () {
    console.log('end')
  })
}
// testFs5();

var testFs6 = function () {
  const readable = fs.createReadStream('f:/000.txt')
  var iCount = 0
  readable.on('error', (err) => {
    console.log(err.message)
  })
  readable.on('readable', () => {
    var chunk
    while ((chunk = readable.read(1024)) !== null) {
      console.log(`Received ${chunk.length} bytes of data. iCount ${++iCount} ${chunk.constructor.name} ${chunk instanceof Buffer}`)
    }
  })
  readable.on('end', function () {
    console.log('Received end')
  })
}
// testFs6();

var testFs7 = function () {
  var fs = require('fs')
  var data = 'www.hello.com i@y.com'

// 创建一个可以写入的流，写入到文件 output.txt 中
  var writerStream = fs.createWriteStream('f:/output.txt')

// 使用 utf8 编码写入数据
  writerStream.write(data, 'UTF8')

// 标记文件末尾
  writerStream.end()

// 处理流事件 --> data, end, and error
  writerStream.on('finish', function () {
    console.log('写入完成。')
  })

  writerStream.on('error', function (err) {
    console.log(err.stack)
  })

  console.log('程序执行完毕')
}
testFs7()

var testFs8 = function () {
  var fs = require('fs')
  var data = ''

// 创建可读流
  var readerStream = fs.createReadStream('f:/input.txt')

// 设置编码为 utf8。
  readerStream.setEncoding('UTF8')

// 处理流事件 --> data, end, and error
  readerStream.on('data', function (chunk) {
    data += chunk
  })

  readerStream.on('end', function () {
    console.log(data)
  })

  readerStream.on('error', function (err) {
    console.log(err.stack)
  })

  console.log('程序执行完毕')
}
testFs8()

var testFs9 = function () {
  var fs = require('fs')

// 创建一个可读流
  var readerStream = fs.createReadStream('input.txt')

// 创建一个可写流
  var writerStream = fs.createWriteStream('output.txt')

// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
  readerStream.pipe(writerStream)

  console.log('程序执行完毕')
}
testFs9()

var testFs10 = function () {
  var sFilePath = 'z:/000.txt'
  fs.open(sFilePath, 'a+', function (err, fd) {
    if (err) return
    var iPosition = 0
    for (var i = 0; i < 1000 * 10; i++) {
      var data = new Buffer([i % 0xFF])
      fs.writeSync(fd, data, 0, 1, iPosition)
      iPosition++
    }
    fs.close(fd, function (err) {
      if (err) return
    })
  })
}
test1()
