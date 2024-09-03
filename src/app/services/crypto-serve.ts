import { Injectable } from '@angular/core'
import * as crypt from 'crypto'

@Injectable({
  providedIn: 'root',
})
export class Crypt {
  private algorithm = 'aes-128-cbc'

  constructor() {}

  private _encrypt(buffer:any, _api_key:any, _iv:any) {
    const _key = Buffer.from(_api_key).toString('base64')
    const key = Buffer.from(_key, 'base64')
    const iv = Buffer.from(_iv, 'base64')

    const cipher = crypt.createCipheriv(this.algorithm, key, iv)
    return Buffer.concat([cipher.update(buffer), cipher.final()])
  }

  private _decrypt(buffer:any, _api_key:any, _iv:any) {
    const _key = Buffer.from(_api_key).toString('base64')
    const key = Buffer.from(_key, 'base64')
    const iv = Buffer.from(_iv, 'base64')

    const decipher = crypt.createDecipheriv(this.algorithm, key, iv)
    return Buffer.concat([decipher.update(buffer), decipher.final()])
  }

  encrypt(buffer:any, key:any, iv:any) {
    let encryptedData = this._encrypt(buffer, key, iv)
    return encryptedData.toString('base64')
  }

  decrypt(encrypted:any, key:any, iv:any) {
    let encryptedData = Buffer.from(encrypted, 'base64')
    // console.log(this._decrypt(encryptedData, key, iv).toString('utf8'))
    return this._decrypt(encryptedData, key, iv).toString('utf8')
  }

  encryptJson(data:any, key:any, iv:any) {
    data['isTranslated'] = localStorage.getItem('activeLanguage') == 'en' ? "0" : "1";
    return this.encrypt(JSON.stringify(data), key, iv)
  }

  decryptJson(data:any, key:any, iv:any) {
    return JSON.parse(this.decrypt(data, key, iv))
  }
}
