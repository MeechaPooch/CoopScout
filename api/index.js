import fetch from 'node-fetch'
import { Assigner } from './assign.js'
import { Scoutdb } from './scoutdb.js'
import { FileSave } from './filesave.js'
import { TeamDB } from './teamdb.js'
import { MatchDB } from './matchdb.js'
import express from 'express'
import cors from 'cors'
import { Now } from './now.js'
import { Config } from './config.js'
import { TimeLord } from './timelord.js'
import { SiteServer } from './siteserver.js'
import { Sheets, Priority } from "./sheets.js";


FileSave.useDir('storage')
let NOW = new Now()
let CONFIG = new Config()
let sheets = await FileSave.load(Sheets)
let priority = await FileSave.load(Priority)
let timelord = await FileSave.load(TimeLord)
Object.prototype.NOW = NOW
Object.prototype.CONFIG = CONFIG
Object.prototype.TIMELORD = timelord
let assigner = await FileSave.load(Assigner)
let scoutdb = await FileSave.load(Scoutdb)
let teamdb = await FileSave.load(TeamDB)
let matchdb = await FileSave.load(MatchDB)
FileSave.startSaving(1)

function recalcNow() {
    if(timelord.timeOverridden) {
        NOW.match = timelord.match
        NOW.status = timelord.status
    } else {
        NOW.match = matchdb.getCurrentMatch().match.match_number
        NOW.status = matchdb.getCurrentMatch().status
    }
}
recalcNow()

// Periodically update priority list
setInterval(async ()=>{assigner.priority = await priority.refreshPriority()},10000);


const app = express()
const port = 3001
app.use(cors('*'))
app.use(express.json())
let siteServer = new SiteServer()
siteServer.bindApi(app)
timelord.bindApi(app)


// info: {teamNum, teamName, allianceColor, matchNum}
// requester encodes their scoutId in url query
app.get('/assign',(req,res)=>{
    recalcNow()
    let scoutId = req.query.scoutId
    if(!scoutId) {res.send({err:'please encode scout id in url query'}); return;}
    if(NOW.status == 'active' && !assigner.getScoutAssignment(scoutId)) {res.send({active:true,err:'match is currently active'});return;}
    let scoutInfo = assigner.assignScout(scoutId,matchdb.getCurrentTeams())
    if(!scoutInfo) {res.send({code:'filled',err:'all teams are already scouted'}); return;}
    let matchInfo = matchdb.getTeamInfo(scoutInfo.teamId,NOW.match)
    let teamInfo = teamdb.getTeam(scoutInfo.teamId)
    let retInfo = {
        color:matchInfo.color,
        number:teamInfo.team_number,
        name:teamInfo.nickname,
        match:NOW.match
    }
    res.send(retInfo)
})
app.get('/qrAssign',(req,res)=>{
    recalcNow()
    let scoutId = req.query.scoutId
    if(!scoutId) {res.send({err:'please encode scout id in url query'}); return;}
    if(NOW.status == 'active' && !assigner.getScoutAssignment(scoutId)) {res.send({active:true,err:'match is currently active'});return;}
    let scoutInfo = assigner.assignScout(scoutId,matchdb.getCurrentTeams())
    if(!scoutInfo) {res.send({code:'filled',err:'all teams are already scouted'}); return;}
    let matchInfo = matchdb.getTeamInfo(scoutInfo.teamId,NOW.match)
    let teamInfo = teamdb.getTeam(scoutInfo.teamId)
    let retInfo = {
        color:matchInfo.color,
        number:teamInfo.team_number,
        name:teamInfo.nickname,
        match:NOW.match
    }
    let html = FileSave.readFile('./../site/assignment.html').toString()
    html = html.replace('$[color]',retInfo.color)
    html = html.replace('$[teamnumber]',retInfo.number)
    html = html.replace('$[matchnumber]',retInfo.match)
    res.send(html)
})


app.post('/leave',(req,res)=>{ // Todo: auto assigning
    let scoutId = req.query.scoutId
    res.end()
})
app.post('/submit',(req,res)=>{
    let formdata = req.body
    console.log(formdata)
    sheets.record(formdata)
    let scoutId = req.query.scoutId
    res.end()
})

let submitGetRoute = '/submit/:' + Object.keys(Sheets.exampleData).sort().join('/:')
app.get(submitGetRoute,(req,res)=>{
    let formdata = {}
    Object.entries(req.params).forEach(entry=>{
        formdata[entry[0]] = JSON.parse(decodeURIComponent(entry[1]))
    })
    if(!formdata.teamNumber) {
        formdata.teamNumber = assigner.getScoutAssignment(formdata.scoutId).teamId
        console.log('TEAM NUMBER RETRIEVED!')
    }
    console.log(formdata)
    let recorded = sheets.record(formdata)
    let scoutId = req.query.scoutId

    res.sendFile(recorded ? 'recorded.html' : 'duplicate.html',{root:'../site'})
})
app.listen(port,()=>{console.log('api listening...')})