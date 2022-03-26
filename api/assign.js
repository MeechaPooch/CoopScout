export class Assigner {

    static saveTo = 'assigned.json'
 

assignedHistory = {}
assigned = {} // list of objects {teamId, scoutId}
priority = []

getAssignments() {
    if(NOW.match in this.assigned) {
        return this.assigned[NOW.match]
    } else {
        this.assigned[NOW.match] = []
        return this.assigned[NOW.match]
    }
}

getScoutAssignment(scoutId) {
    return this.getAssignments().find(pairing=>pairing.scoutId == scoutId);
}

assignScout(scoutId, teams) {
    let priority = this.priority;
    // check if scout id is already assigned
    let assignment = this.getScoutAssignment(scoutId)
    if(assignment) {return assignment}

    // remove teams that are already assigned list
    teams = teams.filter(team=>!this.getAssignments().find(pairing=>pairing.teamId == team));
    // order teams array by hierarchy
    teams.sort((a,b)=>(priority.indexOf(a) - priority.indexOf(b)))
    // handle if there are no more teams left
    if(teams.length == 0) { return null }
    // record assignment and return
    assignment = {teamId:teams[0],scoutId}
    this.getAssignments().push(assignment)
    return assignment;
}

// reassign(teams) {
//     let priority = this.priority;
//     let oldAssigned = this.getAssignments()
//     resetAssignments()
//     for(let pairing of oldAssigned) {
//         this.assignScout(pairing.scoutId)
//     }
// }

// TODO: only reassign BEFORE match is in progress
// remove scout team assignment and move the scout assigned to the LOWEST priority team to this one
unassign(scoutId,teams) {
    let priority = this.priority;
    // order teams array by hierarchy LOWEST priority to HIGHEST
    this.getAssignments().sort((a,b)=>(priority.indexOf(b.teamId) - priority.indexOf(a.teamId)))

    // get index to remove
    let index = this.getAssignments().findIndex(pairing=>pairing.scoutId == scoutId)
    if(index == -1) {return null} // return if no scout with scoutId is assigned
    this.getAssignments().splice(index,1)

    // reasign someone to it if its not the lowest priority team
    if(index != 0) {
        let toBeReassigned = this.getAssignments().splice(0,1)[0]
        this.assignScout(toBeReassigned.scoutId)
    }

}

}

