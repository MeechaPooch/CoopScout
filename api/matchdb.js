import fetch from 'node-fetch'

export class MatchDB {
    static saveTo = 'matchdb.json'

    matches = {}

    constructor() {
        setInterval(this.refreshData.bind(this),30 * 1000)
    }

    getCurrentTeams() {
        if(this.TIMELORD.robotsOverridden) {
            return this.TIMELORD.red.concat(this.TIMELORD.blue)
        }
        let currentMatch = this.getCurrentMatch().match
        return (
            currentMatch.alliances.blue.team_keys.map(key=>key.split('frc').join('')).concat(
                currentMatch.alliances.red.team_keys.map(key=>key.split('frc').join(''))
            )
        )
    }

    getCurrentMatch() { // todo: detect if we're in a match, after a match, or waiting for one to start
        if(this.TIMELORD.timeOverridden) {
            return {match:this.getMatch(this.TIMELORD.match),status:this.TIMELORD.status}
        }
        let lastMatch = null
        let now = Date.now()/1000
        let matchesSorted = Object.values(this.matches).sort((a,b)=>(a.predicted_time - b.predicted_time))
        for (let match of matchesSorted) {
            if(now < match.predicted_time) { // if we hit a match that happens after now
                if(now > match.predicted_time - CONFIG.secondsBefore) {
                    return {match, status:'waiting'}
                } else {
                    return {match:lastMatch, status:'active'}
                }
                break;
            }
            lastMatch = match
        }
        return {match:matchesSorted[matchesSorted.length-1],status:"active"};
    }

    getMatch(matchNum) {
        if(this.TIMELORD.robotsOverridden) {
            //match.alliances.blue.team_keys
            return {
                alliances:{
                    blue:{
                        team_keys:this.TIMELORD.blue.map(name=>'frc'+name),
                    },
                    red:{
                        team_keys:this.TIMELORD.red.map(name=>'frc'+name),
                    },
                }
            }
        }
        return this.matches[matchNum]
    }

    getTeamInfo(teamNum, matchNum) {
        let match = this.getMatch(matchNum)
        let onblue = match.alliances.blue.team_keys.includes('frc' + teamNum)
        let onred = match.alliances.red.team_keys.includes('frc' + teamNum)
        if(!onblue && !onred) {return null}
        else {return {color:onblue ? 'blue' : 'red'}}
    }

    refreshData() {
        return fetch(`https://www.thebluealliance.com/api/v3/event/${NOW.year}${NOW.event}/matches`,{headers:{
            "X-TBA-Auth-Key":"z6Y2VRevkgac8q9f9tReGE8K1iPvhSM4zJzRMfikF3WHyQhfzdr6uizUMS6QPWWA",
        }}).then(res=>res.json().then(json=>{
            json.forEach(match=>{
                this.matches[match.match_number] = match
            })
        })).catch(e=>{console.log(e)})
    }
}