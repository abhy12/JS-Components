"use strict";
const sliderContainer = document.querySelector('.jsc-slider-container');
const sliderWrapper = sliderContainer === null || sliderContainer === void 0 ? void 0 : sliderContainer.querySelector('.jsc-slider-wrapper');
const slides = sliderContainer === null || sliderContainer === void 0 ? void 0 : sliderContainer.querySelectorAll('.slide');
/**
 * TOOD
 * Work on next and previous slide threshold timing
 * Work on gap
 * A11y
 * Class Component
 * Vertical Slider
 */
///global variables
let startingPoint = 0, isDragging = false, currentIndex = 0, slidesLength = slides.length, dragTime = 0, isFirstMove = false, translate = 0;
const sliderContainerWidth = sliderContainer.getBoundingClientRect().width, percentThreshold = 50, timeThreshold = 300;
///prevent default behavior in slide like image dragging effect inside slide
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
    if (!isFirstMove) {
        isFirstMove = true;
        dragTime = new Date().getTime();
    }
    ///if positive then the slide going to left otherwise right
    translate = getPosition(e) - startingPoint;
    ///current percentage of drag
    const currentPercent = (100 * Math.abs(translate)) / sliderContainerWidth;
    if (currentIndex >= (slides.length - 1) && translate < 0) {
        sliderWrapper.style.transform = `translateX(${(translate / 2.5) - (currentIndex * sliderContainerWidth)}px)`;
        return;
    }
    if (currentIndex <= 0 && translate > 0) {
        sliderWrapper.style.transform = `translateX(${(translate / 2.5) + (currentIndex * sliderContainerWidth)}px)`;
        return;
    }
    sliderWrapper.style.transform = `translateX(${translate - (currentIndex * sliderContainerWidth)}px)`;
}
function pointerLeave() {
    const currentPercent = (100 * Math.abs(translate)) / sliderContainerWidth;
    ///if the drag distance is greater than percentThreshold of the container
    ///or pointer leaving time minus the drag start time is lower than the time threshold
    ///increase or decrease the index based on the translate value
    if (isDragging && ((new Date().getTime() - dragTime) < timeThreshold || currentPercent > percentThreshold)) {
        ///slide going to the right
        if (translate > 0 && currentIndex > 0)
            --currentIndex;
        ///slide going to the left
        if (translate < 0 && currentIndex < (slidesLength - 1))
            ++currentIndex;
    }
    sliderWrapper.style.transitionDuration = '300ms';
    sliderWrapper.style.transform = `translateX(${-(currentIndex * sliderContainerWidth)}px)`;
    setTimeout(() => {
        sliderWrapper.style.transitionDuration = '';
    }, 300);
    ///reset
    isDragging = false;
    startingPoint = 0;
    isFirstMove = false;
    dragTime = 0;
    translate = 0;
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