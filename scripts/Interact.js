/* 
* 提供与app的url交互函数
* Params: url
* Author: Kinice
*/ 

export default (url = '') => {
    let frame = document.createElement('iframe')

    frame.style.height = '0px'
    frame.style.width = '0px'
    frame.style.display = 'none'
    frame.setAttribute('src', url)

    document.body.appendChild(frame)

    setTimeout(() => {
        document.body.removeChild(frame)
    }, 50)
}
