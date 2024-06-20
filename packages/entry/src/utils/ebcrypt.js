/*
 * @Author: zuyiyang
 * @Date: 2023-11-21 10:16:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-12-04 15:33:01
 * @Description:
 */
import CryptoJS from 'crypto-js'
const key = CryptoJS.enc.Utf8.parse('8)a*&l:5agxhs2-*') //16位
const iv = CryptoJS.enc.Utf8.parse('abcdef0123456789')

/**
 * @description:
 * @param {string} word //需要加密的字符串
 * @return {string} //加密后的字符串
 */
export const encrypt = (word) => {
  let encrypted = ''
  if (typeof word == 'string') {
    const srcs = CryptoJS.enc.Utf8.parse(word)
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    encrypted = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  }
  return encrypted.toString()
}
/**
 * @description:
 * @param {string} word //需要解密的字符串
 * @return {string} //解密后的字符串
 */
export const decrypt = (word) => {
  let encrypted = ''
  if (typeof word == 'string') {
    encrypted = CryptoJS.AES.decrypt(word, key, {
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
  }
  return encrypted.toString(CryptoJS.enc.Utf8)
}
