import fetch from "node-fetch"

export class TeamDB {

    static saveTo = 'teamdb.json'

    teams = {}

    constructor() {
        this.refreshData()
        setInterval(this.refreshData.bind(this),60 * 1000)
    }

    addTeam(number,name) {
        this.teams[number] = name
    }
    getTeam(number) {
        return this.teams[number]
    }

    refreshData() {
        fetch(`https://www.thebluealliance.com/api/v3/event/${NOW.year}${NOW.event}/teams`,{headers:{
            "X-TBA-Auth-Key":"z6Y2VRevkgac8q9f9tReGE8K1iPvhSM4zJzRMfikF3WHyQhfzdr6uizUMS6QPWWA",
        }}).then(res=>res.json().then(json=>{
            json.forEach(team=>{
                this.teams[team.team_number] = team;
            })
        }))
    }
}