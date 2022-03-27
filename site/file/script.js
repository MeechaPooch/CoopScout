TEAM_INFO = {
    color:'blue',
    number:1540,
    name:"Flaming Chickens",
    match:0
}
let screenInfo = document.getElementById('screenInfo')  
// document.getElementById('welcome').innerHTML = 'CoopScout<br>'+new Date().getFullYear() 

let labels = ['auto','teleop','endgame']
let durations = ['15s','45s','30s']
function setPageLabel(index) {
    let label = labels[index]?.toUpperCase();
    let duration = durations[index]
    if(!label) {return}

    if(index == 2) {
        screenInfo.style.fontSize = "8vw"
    }  else {
        screenInfo.style.fontSize = "9vw"
    }
    screenInfo.innerText = `${TEAM_INFO.number} | ${label} | ${duration}`
   
}
setPageLabel(0)

let pageIndex = 1
let touchPrimed = false;
let isDragging = false;
let anchorX = 0;
let screenAnchorX = 0;
let pointerMoveX = 0
let swipePage = document.getElementById('page');
let swipingUp = false;

setTransform(`${pageIndex*100}vw`)

// document.body.addEventListener('touchmove', function(e) { 
//     e.preventDefault(); 
// });
// document.querySelectorAll('.surface').forEach(surface=>surface.addEventListener('scroll',(e)=>{
//     isScrolling = true;
// }))

function setTransform(amm) {
    let vwAmm = parseFloat(amm)
    if(amm.includes('px')) {
        vwAmm = 100 * parseFloat(amm) / window.innerWidth
    }
   
  
    if(pageIndex<1 && typeof STATE == 'object') { STATE.fillingout = true}
    if(vwAmm < -300) {
        swipePage.style.transform = `translate(-300vw)`
    } else {
        swipePage.style.transform = `translate(${amm})`
    }
    if(parseFloat(amm) >= 0){
        screenInfo.style.transform = `translate(${amm})`
    } else {
      

        if(vwAmm < -200) {
            screenInfo.style.transform = `translate(${200 + vwAmm}vw)`
        } else {
            screenInfo.style.transform = `translate(${0})`
        }
    }
}

document.addEventListener('touchmove',(e)=>{
    if(STATE.waiting) {return}

    if(touchPrimed) {
        touchPrimed = false;
        screenAnchorX = swipePage.getBoundingClientRect().x
    }
    if(!swipeSlopeDetermined) {
        let swipeSlope = Math.abs((e.changedTouches[0].clientY - touchStartY) /
        (e.changedTouches[0].clientX - touchStartX))
        if((e.changedTouches[0].clientY - touchStartY)!=0 || (e.changedTouches[0].clientX - touchStartX)!=0) {
            swipingUp = swipeSlope > 1
            swipeSlopeDetermined = true
        }
    }

    if(swipingUp) {
        // setTransform(`${pageIndex*100}vw`)
        pointerMoveX = 0;
    } else {
        // set anchors when first move happens, not just first touch (because animations may have changed)
       
        pointerMoveX = e.targetTouches[0].pageX - anchorX
        setTransform(`${screenAnchorX + pointerMoveX}px`)

        setPageLabel(-Math.round(
            (pageIndex * window.innerWidth + pointerMoveX*.9)/window.innerWidth
        ))
    }
})
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {

    if(STATE.waiting) {return}


    touchStartX = e.changedTouches[0].clientX
    touchStartY = e.changedTouches[0].clientY
    touchPrimed = true;
    swipeSlopeDetermined = false
    isDragging = true;
    // set anchors initially (will happen again)
    anchorX = e.targetTouches[0].pageX;
    screenAnchorX = swipePage.getBoundingClientRect().x
    pointerMoveX = e.targetTouches[0].pageX - anchorX

    
    swipePage.style.transition = "0s"
    screenInfo.style.transition = "0s"
    

})
document.addEventListener('touchend', (e) => {
    if(STATE.waiting) {return}


    isDragging = false;
    // screenAnchorX += pointerMoveX;

    pageIndex = Math.min(Math.max(Math.round(
        (pageIndex * window.innerWidth + pointerMoveX*3)/window.innerWidth
    ),pageIndex-1),pageIndex+1)
    if(pageIndex > 1) {pageIndex = 1}
    if(pageIndex < -3) {pageIndex = -3}

    screenInfo.style.transition = "0"
    setPageLabel(-pageIndex)

    swipePage.style.transition = ".25s"
    screenInfo.style.transition = ".25s"

    setTransform(`${pageIndex*100}vw`)


    
})
function forceRedraw(element){

    if (!element) { return; }

    var n = document.createTextNode(' ');
    var disp = element.style.display;  // don't worry about previous display style

    element.appendChild(n);
    element.style.display = 'none';

    setTimeout(function(){
        element.style.display = disp;
        n.parentNode.removeChild(n);
    },20); // you can play with this timeout to make it as short as possible
}