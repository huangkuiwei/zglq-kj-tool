import CryptoJS from 'crypto-js'
const key = CryptoJS.enc.Utf8.parse('bw2022039windows');
const iv = CryptoJS.enc.Utf8.parse('bw2022039windows');
/**
 * 加密
 * @param o
 * @returns {string|*}
 */
export function encrypt(o) {
  if (typeof(o) === "string") {
    if (o) {
      var srcs = CryptoJS.enc.Utf8.parse(o);
      return CryptoJS.AES.encrypt(srcs, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();
    }
  } else if (typeof(o) === "object") {
    for (var _o in o) {
      if (o[_o]) {
        var srcs = CryptoJS.enc.Utf8.parse(o[_o]);
        o[_o] = CryptoJS.AES.encrypt(srcs, key, {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }).toString();
      }
    };
  }
  return o;
}
/**
 * 解密
 * @param str
 * @returns {string}
 * @constructor
 */
export function decrypt(str) {
  // console.log('str',str);
  const decrypt = CryptoJS.AES.decrypt({
    // ciphertext:str,  //原字符串
    // ciphertext: CryptoJS.enc.Hex.parse(str) // hex 编码解密
    ciphertext: CryptoJS.enc.Base64.parse(str) // base64 编码解密
  }, key, {
    keySize: 128 / 8,
    mode: CryptoJS.mode.CBC, // CBC模式
    padding: CryptoJS.pad.Pkcs7, // pkcs7padding 填充方式
    iv: iv
  });
  return decrypt.toString(CryptoJS.enc.Utf8)
}
