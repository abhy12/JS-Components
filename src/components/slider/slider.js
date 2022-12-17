"use strict";
const sliderContainer = document.querySelector('.jsc-slider-container');
const sliderWrapper = sliderContainer === null || sliderContainer === void 0 ? void 0 : sliderContainer.querySelector('.jsc-slider-wrapper');
const slides = sliderContainer === null || sliderContainer === void 0 ? void 0 : sliderContainer.querySelectorAll('.slide');
// let isDragging = false,
//     startPos = 0,
//     currentTranslate = 0,
//     animationID = 0,
//     currentIndex = 0,
//     prevTranslate = 0
// slides?.forEach( ( slide, i ) => {
//    slide.addEventListener( 'dragstart', ( e ) => {
//       e.preventDefault();
//    });
//    //desktop
//    slide.addEventListener( 'mousedown', dragStart.bind( null, i ) );
//    slide.addEventListener( 'mouseup', dragStop );
//    slide.addEventListener( 'mouseleave', dragStop );
//    slide.addEventListener( 'mousemove', dragMove );
//    //mobile
//    slide.addEventListener( 'touchstart',  dragStart.bind( null, i ) );
//    slide.addEventListener( 'touchend', dragStop );
//    slide.addEventListener( 'touchmove', dragMove );   
// });
// function dragStart( i: any, e: MouseEvent | TouchEvent )  {
//    isDragging = true;
//    currentIndex = i;
//    // console.log( e.type );
//    const position = getPosition( e );
//    console.log( position );
//    startPos = position
//    animationID = requestAnimationFrame( slideanimation );
// };
// function dragStop( e: Event )  {
//    isDragging = false;
//    cancelAnimationFrame( animationID );
// };
// function dragMove( e: MouseEvent | TouchEvent )  {
//    if( !isDragging ) return;
//    const currentPosition = getPosition( e );
//    currentTranslate = prevTranslate + currentPosition - startPos;
//    console.log( currentPosition );
// };
// function slideanimation()  {
//    sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
//    if( isDragging ) requestAnimationFrame( slideanimation );
// }
const sliderEvents = {
    'mousedown': clickDown,
    'mouseup': clickLeave,
    // 'mouseleave':  clickLeave, 
    'mousemove': clickMove,
    // 'touchstart',
    // 'touchend', 
    // 'touchmove'
};
///
let startingPoint = 0, isDragging = false, currentIndex = 1, slidesLength = slides.length;
const sliderContainerWidth = sliderContainer.offsetWidth;
console.log(sliderContainerWidth / 10);
sliderContainer.addEventListener('dragstart', (e) => {
    var _a;
    const target = e.target;
    const currentTarget = e.currentTarget;
    if (!((_a = target.closest('.slide')) === null || _a === void 0 ? void 0 : _a.classList.contains('slide')))
        return;
    e.preventDefault();
});
// slides.forEach( slide => slide.addEventListener( 'dragstart', ( e ) => e.preventDefault() ) )
function clickDown(e) {
    isDragging = true;
    startingPoint = getPosition(e);
    // console.log(  );
}
function clickMove(e) {
    if (!isDragging)
        return;
    const translate = getPosition(e) - startingPoint;
    ///if positive going to left otherwise right
    ///if the drag distance is 10% of the container
    if (Math.abs(translate) > (sliderContainerWidth / 10)) {
        ///going to the right
        if (translate < 0) {
            console.log('less', sliderContainerWidth * currentIndex);
            sliderWrapper.style.transitionDuration = '300ms';
            sliderWrapper.style.transform = `translateX(-${sliderContainerWidth * currentIndex}px)`;
            setTimeout(() => {
                sliderWrapper.style.transitionDuration = '';
            }, 300);
            currentIndex++;
            startingPoint = 0;
            // console.log( sliderContainer.removeEventListener( 'mousemove', clickMove, false ) );
            return;
        }
        else if (translate < 0) {
            currentIndex--;
        }
    }
    console.log(translate);
    sliderWrapper.style.transform = `translateX(${translate * currentIndex}px)`;
    // if( Math.abs(translate) > ( sliderContainerWidth / 10 ) )  {
    //    sliderWrapper.style.transform = `translateX(-${sliderContainerWidth}px)`;
    // } else {
    //    sliderWrapper.style.transform = `translateX(${translate}px)`;
    // }
    // console.log( translate );
}
function clickLeave() {
    isDragging = false;
    startingPoint = 0;
}
Object.keys(sliderEvents).map(event => {
    //@ts-ignore
    sliderContainer.addEventListener(event, sliderEvents[event]);
});
function getPosition(e) {
    return (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
}
//# sourceMappingURL=slider.js.map