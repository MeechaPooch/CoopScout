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
    record(data) {
        data.defendIndexes = data.defendIndexes.toString()
        sheet.addRow(data)
    }
}