export class Scoutdb {

    static saveTo = 'scoutdb.json'
    toJSON() {
        return {scouts:this.scouts}
    }
    static fromJSON(json) {
        let ret = new Scoutdb()
        ret.scouts = json.scouts
        return ret;
    }


    scouts = {}

    getScout(id) {
        return this.scouts[id]
    }

    newScout(name,slackId) {
        let scoutId = name.toLowerCase().split(' ').join('')
        do {scoutId+=Math.round(Math.random()*1000)} while(scoutId in scouts) 
        this.scouts[scoutId] = {name,slackId}
    }
}