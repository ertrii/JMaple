import { MapleStoryIO } from '../types/MapleStoryIO'
import Wz from './wz'

export default class StringWz extends Wz {
  constructor() {
    super('/String')
  }
  private eqpDirs: MapleStoryIO.Directory[] = [
    this.createDir('Accessory', /1[0-1][1-4]([0-9]){4}$/),
    this.createDir('Cap', /100[0-9]{4}$/),
    this.createDir('Cape', /110[0-9]{4}/),
    this.createDir('Coat', /104[0-9]{4}/),
    this.createDir('Face', /2[0-1][0-8]([0-9]){2}$/),
    this.createDir('Glove', /108[0-9]{4}/),
    this.createDir('Hair', /3([0-1]|[3-4])[0-9]([0-9]){2}$/),
    this.createDir('Longcoat', /105[0-9]{4}/),
    this.createDir('Pants', /106[0-9]{4}/),
    this.createDir('PetEquip', /18[0-3]([0-9]){4}$/),
    this.createDir('Ring', /111[0-9]{4}/),
    this.createDir('Shield', /109[0-9]{4}/),
    this.createDir('Shoes', /107[0-9]{4}/),
    this.createDir('Taming', /19[0-1]([0-9]){4}$/),
    this.createDir('Weapon', /1([3-4]|[6-7])([0-9]){5}$/)
  ]
  private mapDirs: MapleStoryIO.Directory[] = [
    this.createDir('Episode1GL', /6770000[0-1][0-9]$/),
    this.createDir('HalloweenGL', /6820[0-1]0[0-9]{2}$/),
    this.createDir('MasteriaGL', /6[0-1]00[0-1][0-9]{4}$/),
    this.createDir('elin', /3[0|9]00[0-3][0-9]{4}$/),
    this.createDir('etc', /[6|8-9][0-3|5-9]([0-9]){7}$/),
    this.createDir('event', /683000[0-1]([0-9]){2}$/),
    this.createDir('jp', /8[0-1|8-9][0-1|9]0[0-9]{5}$/),
    this.createDir('maple', /([0-3]$|([1-6]0[0-1]([0-6]{2}|[0-6]{4}))$)/),
    this.createDir('ossyria', /2[0-8][0-9]{7}$/),
    this.createDir('singapore', /5[4-5][0-1][0-9]{6}$/),
    this.createDir('victoria', /1[0-9]{8}$/),
    this.createDir('weddingGL', /6[7-8][0-1]0[0-9]{5}$/)
  ]
  dirs: MapleStoryIO.Directory[] = [
    this.createDir('Cash.img', /5([0-6]|9)[0-9]([0-9]){4}$/),
    this.createDir('Consume.img', /2[0-4][0-9]([0-9]){4}$/),
    this.createDir('Eqp.img/Eqp', /[1-3]([0-9]){2}([0-9]{2}|[0-9]{4})$/, this.eqpDirs),
    this.createDir('Etc.img/Etc', /4[0-3]([0-9]){5}$/),
    this.createDir('Ins.img', /3[0|9][1|9]([0-9]){4}$/),
    this.createDir('Map.img', /3[0|9][1|9]([0-9]){4}$/, this.mapDirs)
  ]

  getPathByUId(uid: string) {
    const route = this.identify(this.dirs, uid)
    if (route === '') return ''
    return `${this.pathBase}/${route}/${uid}`
  }
}
