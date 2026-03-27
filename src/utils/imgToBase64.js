// Image对象转base64
function imageToBase64(image) {
  let canvas = document.createElement('canvas')
  let width = image.width
  let height = image.height
  canvas.width = width
  canvas.height = height
  let context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/png')
}
// 回调方式
function urlToBase64(url, callback = null) {
  let image = new Image()
  image.setAttribute('crossOrigin', 'Anonymous')
  image.src = url + '?v=' + Math.random()
  image.onload = function() {
    let dataURL = imageToBase64(image)
    let file = base64toFile(dataURL)
    if (callback) {
      callback(file)
    }
  }
}

function base64toFile(dataurl, filename = 'file') {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  let file = new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
  return file
}
// Promise方式
export function urlToBase64Async(url) {
  return new Promise((resolve, reject) => {
    urlToBase64(url, (data) => {
      resolve(data)
    })
  })
}
