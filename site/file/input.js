data = {
    autoLow:0,
    autoHigh:0,
    teleLow:0,
    teleHigh:0,
}

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