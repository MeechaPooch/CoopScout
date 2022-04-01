import { GoogleSpreadsheet } from "google-spreadsheet";
import { env } from './secrets/env.js'
import fs from 'fs'
console.log('loading google sheets...')
const google_client_secret = JSON.parse(fs.readFileSync('secrets/client_secret.json'))

let exampleData = {
    matchNumber:-1,
    timestamp:null,
    scoutId:null,
    teamNumber:-1,

    autoLow:0,
    autoHigh:0,
    teleLow:0,
    teleHigh:0,
    climbIndex:-1,
    defendIndexes: [],
    note:'',
}

const doc = await new GoogleSpreadsheet(env.sheet_id)
await doc.useServiceAccountAuth(google_client_secret)
let info = await doc.loadInfo()
let sheet = doc.sheetsByTitle['coopscout']
sheet.setHeaderRow(Object.keys(exampleData),0)
console.log('google sheets loaded.')

export class Sheets {
    static saveTo = 'sheets.json'
    static exampleData = exampleData

    alreadyAdded = {}
    errored = []

    record(data) {
        data.defendIndexes = data.defendIndexes.toString()
        if(this.recordAndTest(data)) {return false} // if youve already recorded this, dont record again
        return sheet.addRow(data)
            .catch(e=>{console.log(e); this.errored.push(data)})
    }

    recordAndTest(data) {
        let rep = "" + data.scoutId + data.teamNumber + data.matchNumber + data.note?.substr(0,5)
        if(this.alreadyAdded[rep]) {return true}
        this.alreadyAdded[rep] = true
        return false;
    }
}