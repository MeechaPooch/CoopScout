import fetch from 'node-fetch'
import { Assigner } from './assign.js'
import { Scoutdb } from './scoutdb.js'
import { FileSave } from './filesave.js'
import { TeamDB } from './teamdb.js'
import { MatchDB } from './matchdb.js'
import express from 'express'
import { Now } from './now.js'
import { Config } from './config.js'


let NOW = new Now()
let CONFIG = new Config()
Object.prototype.NOW = NOW
Object.prototype.CONFIG = CONFIG
FileSave.useDir('storage')
let assigner = FileSave.load(Assigner)
let scoutdb = FileSave.load(Scoutdb)
let teamdb = FileSave.load(TeamDB)
let matchdb = FileSave.load(MatchDB)
FileSave.startSaving(1)

function recalcNow() {
    NOW.match = matchdb.getCurrentMatch().match.match_number
}
recalcNow()

assigner.priority = ['1540','2412']
console.log()

const app = express()
const port = 3002



// info: {teamNum, teamName, allianceColor, matchNum}
// requester encodes their scoutId in url query
app.get('/teamInfo',(req,res)=>{
    recalcNow()
    let scoutId = req.query.scoutId
    if(!scoutId) {res.send({err:'please encode scout id in url query'}); return;}
    let scoutInfo = assigner.assignScout(scoutId,matchdb.getCurrentTeams())
    if(!scoutInfo) {res.send({err:'all teams are already scouted'}); return;}
    let matchInfo = matchdb.getTeamInfo(scoutInfo.teamId,NOW.match)
    let teamInfo = teamdb.getTeam(scoutInfo.teamId)
    let retInfo = {color:matchInfo.color, number:teamInfo.team_number,name:teamInfo.nickname,match:NOW.match}
    res.send(retInfo)
})
app.listen(port,()=>{console.log('api listening...')})