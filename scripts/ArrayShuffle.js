/*
* 数组乱序算法
* params: Array
* Author: Kinice
*/
// 在node里测试的
module.exports = ArrayShuffle

function ArrayShuffle(originalArray) {
	for(let i = 0; i < originalArray.length; i++) {
    let pointer = originalArray.length - i - 1
    let rand = Math.floor(Math.random() * pointer)
    let temp = originalArray[pointer]

    originalArray[pointer] = originalArray[rand]
    originalArray[rand] = temp
  }
  return originalArray
}

console.log(ArrayShuffle([1,2,3,4,5,6,7,8,9,0]))
