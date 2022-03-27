import fs from 'fs'

function sleep(millis) {return new Promise(res=>setTimeout(res,millis))}

export class FileSave {
    static dir = '.'
    static interval = 10
    static useDir(dir) {
        FileSave.dir = dir;
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    }

    static saveObjs = []

    static load(constructor) {
        let path = this.dir + '/' + constructor.saveTo;
        let ret;
        if(fs.existsSync(path)) {
            try{
            let json = JSON.parse(fs.readFileSync(path))
            if(typeof constructor.fromJSON == 'function') {
                ret = constructor.fromJSON(json)
            } else {
                ret = new constructor()
                Object.entries(json).forEach(entry=>{
                    ret[entry[0]] = entry[1];
                })
            }
        } catch(e) {
            console.log(e);
            ret = new constructor()
        }
        } else {
            ret = new constructor()
        }
        this.saveObjs.push(ret)
        return ret;
    }

    static save(obj) {
        let path = this.dir + '/' + obj.constructor.saveTo;
        let toSave = JSON.stringify(obj)
        return new Promise(res=>fs.writeFile(path,toSave,null,res))
    }

    static saveAll() {
        return Promise.all(this.saveObjs.map(obj=>this.save(obj)))
   }

   static async startSaving(interval) {
       this.interval = interval;
        while(true) {
            await FileSave.saveAll();
            await sleep(FileSave.interval * 1000);
        }
   }
}