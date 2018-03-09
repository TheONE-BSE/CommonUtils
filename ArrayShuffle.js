/*
* 数组乱序算法
* params: Array 
*/
module.exports = function (originalArray) {
	for(let i = 0; i < originalArray.length; i++) {
        let pointer = originalArray.length - i - 1
        let rand = Math.floor(Math.random() * pointer)
        let temp = originalArray[pointer]

        originalArray[pointer] = originalArray[rand]
        originalArray[rand] = temp
    }
    return originalArray
}
