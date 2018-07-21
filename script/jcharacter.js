'use strict';

class JCharacter{
    constructor(data){
        this.nick   =   data.nick
        this.lv     =   (data.hasOwnProperty('lv'))     ? data.lv       : 1
        this.exp    =   (data.hasOwnProperty('exp'))    ? data.exp      : 0
        this.mesos  =   (data.hasOwnProperty('mesos'))  ? data.mesos    : 0
        this.nx     =   (data.hasOwnProperty('nx'))     ? data.nx       : 0
        this.hp     =   (data.hasOwnProperty('hp'))     ? data.hp       : 50
        this.mp     =   (data.hasOwnProperty('mp'))     ? data.mp       : 50
        this.sp     =   (data.hasOwnProperty('sp'))     ? data.sp       : 0
        this.ap     =   (data.hasOwnProperty('ap'))     ? data.ap       : 0
    }

    get cm(){
        let command = {
            openShop    :   shopid  => {
                console.log(shopid);                
            },
            haveItem    :   itemid  => {

            },
            gainItem    :   (itemid, ammount)   => {

            },
            changeJob   :   jobid   => {

            },
            getJob      :   jobid   => {

            },
            startQuest  :   questid => {

            },
            completeQuest   :   questid => {

            },
            forfeitQuest    :   questid => {

            },
            getMeso     :   () => {

            },
            gainMeso    :   ammount => {

            },
            gainLevel   :   ()  => {

            },
            teachSkill  :   (skillid, skilllevel, maxskilllevel) => {

            },
            get         :   stat    => {

            },
            modifyNX    :   ammount => {

            }

        }
        return command
    }
}