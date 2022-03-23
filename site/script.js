var teamNumber = '265'
let screenInfo = document.getElementById('screenInfo')   

let labels = ['auto','teleop','endgame']
function setPageLabel(index) {
    let label = labels[index]?.toUpperCase();
    if(!label) {return}

    screenInfo.innerText = `${teamNumber} | ${label} | 0s`   
}
setPageLabel(0)

let pageIndex = 0
let touchPrimed = false;
let isDragging = false;
let isScrolling = false;
let anchorX = 0;
let screenAnchorX = 0;
let pointerMoveX = 0
let swipePage = document.getElementById('page');
let swipingUp = false;

// document.body.addEventListener('touchmove', function(e) { 
//     e.preventDefault(); 
// });
document.querySelectorAll('.surface').forEach(surface=>surface.addEventListener('scroll',(e)=>{
    isScrolling = true;
}))

function setTransform(amm) {
    swipePage.style.transform = `translate(${amm})`
    if(parseFloat(amm) >= 0){
        screenInfo.style.transform = `translate(${amm})`
    }
}

document.addEventListener('touchmove',(e)=>{
    
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

    if( 
        swipingUp
        /*&& isScrolling && Math.abs(pointerMoveX) < window.innerWidth/10*/) {
        setTransform(`${pageIndex*100}vw`)
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

    touchStartX = e.changedTouches[0].clientX
    touchStartY = e.changedTouches[0].clientY
    touchPrimed = true;
    swipeSlopeDetermined = false
    isDragging = true;
    isScrolling = false;
    // set anchors initially (will happen again)
    anchorX = e.targetTouches[0].pageX;
    screenAnchorX = swipePage.getBoundingClientRect().x
    pointerMoveX = e.targetTouches[0].pageX - anchorX

    
    swipePage.style.transition = "0s"
    screenInfo.style.transition = "0s"
    

})
document.addEventListener('touchend', (e) => {
    isScrolling = false;
    isDragging = false;
    // screenAnchorX += pointerMoveX;

    pageIndex = Math.min(Math.max(Math.round(
        (pageIndex * window.innerWidth + pointerMoveX*3)/window.innerWidth
    ),pageIndex-1),pageIndex+1)

    swipePage.style.transition = ".25s"
    screenInfo.style.transition = ".25s"
    setTransform(`${pageIndex*100}vw`)

    setPageLabel(-pageIndex)

    
})