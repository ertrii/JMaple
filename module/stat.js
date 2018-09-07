const Exp = [1, 15, 34, 57, 92, 135, 372, 560, 840, 1242, 1144, 1573, 2144, 2800, 3640, 4700, 5893, 7360, 9144, 11120, 13477, 16268, 19320, 22880, 27008, 31477, 36600, 42444, 48720, 55813, 63800, 86784, 98208, 110932, 124432, 139372, 155865, 173280, 192400, 213345];
class Stat{
    constructor(stat = {}){
        this.str = (stat.hasOwnProperty('str')) ? stat.str : 4
        this.dex = (stat.hasOwnProperty('dex')) ? stat.dex : 4
        this.int = (stat.hasOwnProperty('int')) ? stat.int : 4
        this.luk = (stat.hasOwnProperty('luk')) ? stat.luk : 4
        this.hp = (stat.hasOwnProperty('hp')) ? stat.hp : 50
        this.mp = (stat.hasOwnProperty('mp')) ? stat.mp : 50

        this.lv = (stat.hasOwnProperty('lv')) ? stat.lv : 1
        this.exp = (stat.hasOwnProperty('exp')) ? stat.exp : 0
        this.def = (stat.hasOwnProperty('def')) ? stat.def : 0
        this.att = (stat.hasOwnProperty('att')) ? stat.att : 0
        this.attM = (stat.hasOwnProperty('attM')) ? stat.attM : 0
        this.fame = 0
        this.refresh()
    }
    refresh(){
        while (this.exp >= Exp[this.lv]){
            this.exp -= Exp[this.lv];
            this.lv++
        }
    }
}