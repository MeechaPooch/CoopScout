const defaultData = {
    autoLow:0,
    autoHigh:0,
    teleLow:0,
    teleHigh:0,

    climbIndex:-1,
    defendIndexes: [],
    note:null,
}
data = {}
function reset() {
    data = JSON.parse(JSON.stringify(defaultData))
    document.querySelectorAll('.checkboxBox').forEach(box=>{
        box.classList.remove('selected')
    })
    document.querySelector('#nodef').classList.add('selected')

    document.querySelectorAll('.inlineNum').forEach(num=>{
        num.innerHTML = '0'
    })
}
function getFormData() {
    data.note = document.getElementById('endnote').value
    
    // get defence indexes
    data.defendIndexes = []
    document.querySelectorAll('#teleop .checkboxBox').forEach(box=>{
        if(box.classList.contains('selected')) { data.defendIndexes.push(box.dataset.id) }
    })

    // get climb index
    document.querySelectorAll('#endgame .checkboxBox.exclusive').forEach(box=>{
        if(box.classList.contains('selected')) { data.climbIndex = box.dataset.id }
    })
    return data;
}
reset()


////// COUNTER //////
function incrCounter(label,ammount) {
    data[label] += ammount
    if(data[label]<0) {data[label]=0}
    document.querySelector('.inlineNum[data-type=' + label + ']').innerText=data[label]
}
///// CHECKBOX /////

function selectOption(box) {

    if(box.className.includes('exclusive')) {
        box.parentElement.querySelectorAll('.checkboxBox').forEach(boxbox=>{
            boxbox.classList.remove('selected')
        })
    }
    if(box.parentElement.id == 'teleop' && !box.className.includes('selected')) {
        document.querySelector('#nodef').classList.remove('selected')
    }

    box.classList.toggle('selected')
}

document.querySelectorAll('.checkboxBox').forEach(boxbox=>{
    boxbox.onclick = ()=>{selectOption(boxbox)}
})