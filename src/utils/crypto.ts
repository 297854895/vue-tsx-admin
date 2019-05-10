import CryptoJS from 'crypto-js'
import cryptoKey from '@/config/cryptoKey'

export default {
  encrypt(str: string): string {
    return CryptoJS.AES.encrypt(str, cryptoKey).toString()
  },
  decrypt(str: string): string {
    return CryptoJS.AES.decrypt(str, cryptoKey).toString(CryptoJS.enc.Utf8)
  }
}
