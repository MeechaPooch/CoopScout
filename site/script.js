var teamNumber = '265'
let screenInfo = document.getElementById('screenInfo')   

let labels = ['auto','teleop','endgame']
function setPageLabel(index) {
    let label = labels[index]?.toUpperCase();

    screenInfo.innerText = `${teamNumber} | ${label} | 5s`   
}
setPageLabel(0)

let pageIndex = 0
let touchPrimed = false;
let isDragging = false;
let anchorX = 0;
let screenAnchorX = 0;
let pointerMoveX = 0
let swipePage = document.getElementById('page')

document.addEventListener('touchmove',(e)=>{
    // set anchors when first move happens, not just first touch (because animations may have changed)
    if(touchPrimed) {
        touchPrimed = false;
        screenAnchorX = swipePage.getBoundingClientRect().x
    }
    pointerMoveX = e.targetTouches[0].pageX - anchorX
    swipePage.style.transform = `translate(${screenAnchorX + pointerMoveX}px)`

    setPageLabel(-Math.round(
        (pageIndex * window.innerWidth + pointerMoveX*.9)/window.innerWidth
    ))
})
document.addEventListener('touchstart', (e) => {
    touchPrimed = true;
    isDragging = true;
    // set anchors initially (will happen again)
    anchorX = e.targetTouches[0].pageX;
    screenAnchorX = swipePage.getBoundingClientRect().x
    pointerMoveX = e.targetTouches[0].pageX - anchorX

    
    swipePage.style.transition = "0s"
    

})
document.addEventListener('touchend', (e) => {
    isDragging = false;
    // screenAnchorX += pointerMoveX;

    pageIndex = Math.min(Math.max(Math.round(
        (pageIndex * window.innerWidth + pointerMoveX*3)/window.innerWidth
    ),pageIndex-1),pageIndex+1)

    swipePage.style.transition = ".25s"
    swipePage.style.transform = `translate(${pageIndex*100}vw)`

    setPageLabel(-pageIndex)
})

