function getBody() {
    let ret = {}
    ret.timeOverridden = document.querySelector('#override').checked
    ret.match = parseInt(document.querySelector('#match').value);
    ret.status = document.querySelector('#waiting').checked ? "waiting" : "active";
    ret.robotsOverride =  document.querySelector('#robotoverride').checked;
    ret.red = document.querySelector('#red').value.split(',')
    ret.blue = document.querySelector('#blue').value.replaceAll(' ','').split(',')
    return ret;
}

function sendRequest() {
    let body = getBody()
    fetch('http://spore.us.to:3001/timelord',{
        method:'put',
        body:JSON.stringify(body),
    })
}