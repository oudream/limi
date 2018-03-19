// 表单数据
let form = {
  name: 'Harry',
  email: 'a',
  age: 23
}
// 提示信息
let words = {
  name: '名字为空',
  email: '邮箱为空',
  age: '年龄为空'
}

let testIf11 = function () {
  let dtNow = Date.now()

  for (let i = 0; i < 1000 * 1000; i++) {
    if (!form.name) {
      console.log(words.name)
      return false
    } else if (!form.email) {
      console.log(words.email)
      return false
    } else if (!form.age) {
      console.log(words.age)
      return false
    }
  }
  console.log('cast: ', Date.now() - dtNow)
}
testIf11()

let testIf12 = function () {
  let dtNow = Date.now()

  for (let i = 0; i < 1000 * 1000; i++) {
    try {
      if (!form.name) throw new Error(words.name)
      else if (!form.email) throw new Error(words.email)
      else if (!form.age) throw new Error(words.age)
    } catch (e) {
      console.log(e.message)
      return false
    }
  }
  console.log('cast: ', Date.now() - dtNow)
}
testIf12()
