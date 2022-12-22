"use strict";
const sliderContainer = document.querySelector('.jsc-slider-container');
const sliderWrapper = sliderContainer === null || sliderContainer === void 0 ? void 0 : sliderContainer.querySelector('.jsc-slider-wrapper');
const slides = sliderContainer === null || sliderContainer === void 0 ? void 0 : sliderContainer.querySelectorAll('.slide');
/**
 * TOOD
 * Work on next and previous slide threshold timing
 * Work on gap
 * Mobile Support
 * A11y
 * Class Component
 * Vertical Slider
 */
///global variables
let startingPoint = 0, isDragging = false, currentIndex = 0, slidesLength = slides.length, makeSwipeHarder = 0;
const sliderContainerWidth = sliderContainer.getBoundingClientRect().width, percentThreshold = 5;
///prevent default behavior in slide like image dragging inside slider slide
sliderContainer.addEventListener('dragstart', (e) => {
    var _a;
    const target = e.target;
    const currentTarget = e.currentTarget;
    if (!((_a = target.closest('.slide')) === null || _a === void 0 ? void 0 : _a.classList.contains('slide')))
        return;
    e.preventDefault();
});
function pointerDown(e) {
    isDragging = true;
    startingPoint = getPosition(e);
}
function pointerMove(e) {
    if (!isDragging)
        return;
    ///if positive then the slide going to left otherwise right
    const translate = getPosition(e) - startingPoint;
    ///current percentage of drag
    const currentPercent = (100 * Math.abs(translate)) / sliderContainerWidth;
    if (currentIndex >= (slides.length - 1) && translate < 0) {
        if (Math.abs(translate) >= (sliderContainerWidth / 2))
            return;
        sliderWrapper.style.transform = `translateX(${((translate - (--makeSwipeHarder)) / 2) - (currentIndex * sliderContainerWidth)}px)`;
        return;
    }
    ;
    if (currentIndex <= 0 && translate > 0) {
        // const conWidth = sliderContainerWidth / 2;
        // const percentOfTranslate = ( getPosition( e ) * 100 ) / conWidth;
        // console.log( getPosition( e ), percentOfTranslate, ( getPosition( e ) / percentOfTranslate ) );
        // sliderWrapper.style.transform = `translateX(${ Math.abs( translate - ( ++makeSwipeHarder * 10 ) ) - ( currentIndex * sliderContainerWidth )}px)`;
        if (Math.abs(translate) >= (sliderContainerWidth / 2))
            return;
        sliderWrapper.style.transform = `translateX(${Math.abs(translate - (++makeSwipeHarder * 2)) - (currentIndex * sliderContainerWidth)}px)`;
        return;
    }
    ///if the drag distance is grater than percentThreshold of the container
    if (currentPercent > percentThreshold) {
        ///the slide going to the right
        if (translate < 0) {
            if (currentIndex >= (slides.length - 1))
                return;
            currentIndex++;
        }
        ///going to the left
        if (translate > 0) {
            if (currentIndex <= 0)
                return;
            currentIndex--;
        }
        sliderWrapper.style.transitionDuration = '300ms';
        sliderWrapper.style.transform = `translateX(${-(currentIndex * sliderContainerWidth)}px)`;
        setTimeout(() => {
            sliderWrapper.style.transitionDuration = '';
        }, 300);
        startingPoint = 0;
        isDragging = false;
    }
    else {
        sliderWrapper.style.transform = `translateX(${translate - (currentIndex * sliderContainerWidth)}px)`;
    }
    // console.log( translate );
}
function pointerLeave() {
    sliderWrapper.style.transitionDuration = '300ms';
    sliderWrapper.style.transform = `translateX(${-(currentIndex * sliderContainerWidth)}px)`;
    setTimeout(() => {
        sliderWrapper.style.transitionDuration = '';
    }, 300);
    isDragging = false;
    startingPoint = 0;
    makeSwipeHarder = 0;
}
///slider events
const sliderEvents = {
    'mousedown': pointerDown,
    'mouseup': pointerLeave,
    // 'mouseleave':  pointerLeave,
    'mousemove': pointerMove,
    'touchstart': pointerDown,
    'touchend': pointerLeave,
    'touchmove': pointerMove
};
///add all the slider events
Object.keys(sliderEvents).map(event => {
    //@ts-ignore
    sliderContainer.addEventListener(event, sliderEvents[event]);
});
function getPosition(e) {
    return (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
}
//# sourceMappingURL=slider.js.map