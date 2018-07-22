//import { log } from "util";

class N1012118{

    constructor(){        
        this.status = -1;
        this.map = 910060000;
        this.num = 5;
        this.maxp = 5;
    }     

    action(mode, type, selection) {
        if (mode == 1) {
            this.status++;
        } else {
        if (this.status <= 1) {
            this.cm.dispose()
            return;
        }
        this.status--;
        }
        if (this.status == 0) {

            // if (true) {
            //     this.cm.sendYesNo("Would you like to go in the special Spore Training Center?");
            //     this.status = 1;
            //     return
            // }

            var selStr = "Would you like to go into the Training Center? #HRaining#";
            for (var i = 0; i < this.num; i++) {
                selStr += "#L" + i + "#Training Center " + i + " (" + 7 + "/" + this.maxp + ")#l";
            }
            this.cm.sendSimple(selStr);

        } else if (this.status == 1) {

            if (selection < 0 || selection >= this.num) {
                this.cm.dispose();
            } else if (4 >= this.maxp) {
                this.cm.sendNext("This training center is full.");
                this.status = -1;
            } else {
                //cm.warp(map + selection, 0);
                console.log('warp 1');
            
                this.cm.dispose();
            }

        } else if (this.status == 2) {
            //cm.warp(910060100,0);
            console.log('warp 2 ' + mode);
            
            this.cm.dispose();
        }
    }
}