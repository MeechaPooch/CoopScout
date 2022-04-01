API_URL = ''

STATE = {
    waiting:false,
    fillingout: false,
    clockedIn: true,
    justSubmitted: localStorage.getItem('lastMatch') ? localStorage.getItem('lastMatch') : -1, // match number
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    if(!result) {return null};
    return result[1];
}
SCOUT_INFO = {
    id: null,
    name:"???",
}
function getYaName() {
    SCOUT_INFO.id = localStorage.getItem('scoutId')
    if(!SCOUT_INFO.id || SCOUT_INFO.id == 'null') {
        SCOUT_INFO.id = new String(prompt('Enter your name (we will use it as your scout id)')).toLowerCase().split(' ').join('')
        if(SCOUT_INFO.id.length < 2) {getYaName(); return;}
        localStorage.setItem('scoutId',SCOUT_INFO.id) 
    }
}
getYaName()
setWaitingScreen('waiting')
setOffline(false)
setQRCode(false)

TEAM_INFO = {
    color:'blue',
    number:1540,
    name:"Flaming Chickens",
    match:10
}

function setWaiting(isWaiting) {
    // if(STATE.fillingout) {return}
    STATE.waiting = isWaiting;
    if(isWaiting) {
        document.getElementById('waiting').style.display = "flex"
        document.getElementById('displaying').style.display = "none"
        pageIndex = 1;
        setTransform(`${pageIndex*100}vw`)
    } else {
        document.getElementById('waiting').style.display = "none"
        document.getElementById('displaying').style.display = "flex"

    }
}
function setClockedIn(isIn) {
    if(isIn) {
        document.getElementById('clockedin').style.display = "flex"
        document.getElementById('clockedout').style.display = "none"
        setWaitingScreen('waiting')
        if(!STATE.clockedIn) {queryScoutData(true)}
    } else {
        document.getElementById('clockedin').style.display = "none"
        document.getElementById('clockedout').style.display = "flex"
    }
    STATE.clockedIn = isIn
}
function setWaitingScreen(screen) {
    if(screen == 'filled') {
        document.getElementById('takenup').style.display = "inline"
        document.getElementById('clockedout').style.display = "none"
        document.getElementById('clockedin').style.display = "none"
    } else if (screen=='waiting'){
        document.getElementById('clockedin').style.display = "flex"
        document.getElementById('clockedout').style.display = "none"
        document.getElementById('takenup').style.display = "none"
    }
}

OFFLINE = false;
function setOffline(isOffline) {
    OFFLINE = isOffline
    if(isOffline) {
        document.getElementById('offline').style.display = 'inline'
    } else {
        document.getElementById('offline').style.display = 'none'
    }
}

function displayInfo() {
    document.documentElement.style.setProperty('--alliance', 'var(--' + TEAM_INFO.color + ")");
    document.getElementById('teamNumber').innerText = TEAM_INFO.number
    document.getElementById('teamName').innerText = TEAM_INFO.name
    document.getElementById('allianceColor').innerText = TEAM_INFO.color.toUpperCase()
}

async function queryScoutData(override) {
    if((!STATE.clockedIn && !override) || STATE.fillingout) {return}
    let res;
    try{res = await fetch(`${API_URL}/assign?scoutId=${encodeURIComponent(SCOUT_INFO.id)}`);}
    catch(e) {setOffline(true);return;}
    setOffline(false)
    let json = await res.json();
    console.log(json)
    if(json.match == STATE.justSubmitted) {
        return;
    }
    if(json?.code == 'filled'){
        setWaitingScreen('filled')
    }
    else if(json?.err) {
        // if(!STATE.fillingout) {
            setWaiting(true)
        setWaitingScreen('waiting')

        // }
    } else {
        TEAM_INFO = json;
        setWaiting(false);
        displayInfo();
    }
}


// QR CODE 
let qrWidth = window.innerWidth * 80/100
var qrcode = new QRCode("qrcode",{
    width:qrWidth,
    height:qrWidth,
});
function setQRCode(data) {
    if(data) {
        urlData = Object.entries(data).sort((a,b)=>(a[0].localeCompare(b[0]))).map(entry=>encodeURIComponent(JSON.stringify(entry[1]))).join('/')
        qrcode.makeCode(`http://spore.us.to:3001/submit/${urlData}`)
        // qrcode.makeCode(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
        document.getElementById('qrcodeContainer').style.display = 'inline'
    } else {
        document.getElementById('qrcodeContainer').style.display = 'none'
    }
}

function reset() {
    setQRCode(false)
    resetFormData()
    STATE.fillingout = false;
    STATE.justSubmitted = TEAM_INFO.match
    localStorage.setItem('lastMatch',STATE.justSubmitted)
    setWaiting(true)
    setWaitingScreen('waiting')
}

async function submitScoutData() {
    let formdata = getFormData()
    formdata.timestamp = new Date().toLocaleString('en-us').replace(',','')
    formdata.scoutId = SCOUT_INFO.id
    formdata.matchNumber = TEAM_INFO.match
    formdata.teamNumber = TEAM_INFO.number

    try{
        await fetch('/submit',{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method:"POST",
        body:JSON.stringify(formdata),
    })} catch(e) {
        setQRCode(formdata)
        return;
    }
    reset()
}

setInterval(queryScoutData,5 * 1000)

setWaiting(true)
setClockedIn(false)

// setWaiting(false)
// setClockedIn(true)

