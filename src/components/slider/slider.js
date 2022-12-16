"use strict";
const sliderContainer = document.querySelector('.jsc-slider-container');
const slides = sliderContainer === null || sliderContainer === void 0 ? void 0 : sliderContainer.querySelectorAll('.slide');
let isDragging = false, startPos = 0, currentTranslate = 0, animationID = 0, currentIndex = 0, prevTranslate = 0;
slides === null || slides === void 0 ? void 0 : slides.forEach((slide, i) => {
    slide.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
    //desktop
    slide.addEventListener('mousedown', dragStart.bind(null, i));
    slide.addEventListener('mouseup', dragStop);
    slide.addEventListener('mouseleave', dragStop);
    slide.addEventListener('mousemove', dragMove);
    //mobile
    slide.addEventListener('touchstart', dragStart.bind(null, i));
    slide.addEventListener('touchend', dragStop);
    slide.addEventListener('touchmove', dragMove);
});
function dragStart(i, e) {
    isDragging = true;
    currentIndex = i;
    // console.log( e.type );
    const position = getPosition(e);
    console.log(position);
    startPos = position;
    animationID = requestAnimationFrame(slideanimation);
}
;
function dragStop(e) {
    isDragging = false;
    cancelAnimationFrame(animationID);
}
;
function dragMove(e) {
    if (!isDragging)
        return;
    const currentPosition = getPosition(e);
    currentTranslate = prevTranslate + currentPosition - startPos;
    console.log(currentPosition);
}
;
function slideanimation() {
    sliderContainer.style.transform = `translateX(${currentTranslate}px)`;
    if (isDragging)
        requestAnimationFrame(slideanimation);
}
function getPosition(e) {
    return (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
}
//# sourceMappingURL=slider.js.map