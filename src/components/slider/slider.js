"use strict";
/**
 * TOOD
 * Responsive
 * Controls
 * A11y
 * Vertical Slider
 */
class JsSlider {
    constructor(args) {
        ///state variables
        this.startingPoint = 0;
        this.isDragging = false;
        this.currentIndex = 0;
        this.dragTime = 0;
        this.isFirstMove = false;
        this.translate = 0;
        ///can be change via args
        this.slidesPerView = 1;
        this.percentThreshold = 50;
        this.timeThreshold = 300;
        this.gap = 0;
        ///slider events
        this.sliderEvents = {
            'mousedown': this._pointerDown,
            'mouseup': this._pointerLeave,
            // 'mouseleave':  this._pointerLeave,
            'mousemove': this._pointerMove,
            'touchstart': this._pointerDown,
            'touchend': this._pointerLeave,
            'touchmove': this._pointerMove,
            'dragstart': this._pointerDragStart,
        };
        ///check if container arg is string
        if (typeof args.container === 'string') {
            args.container = document.querySelector(args.container);
        }
        if (!(args.container instanceof HTMLElement))
            return;
        this.container = args.container;
        /** any expression after this */
        /**** will improve this in more efficient way ****/
        ///assign other arguments to global class variables
        if (args.slidesPerView && args.slidesPerView > 0) {
            this.slidesPerView = args.slidesPerView;
        }
        if (args.gap && args.gap > 0) {
            ///multiplying gap because i don't want "1" gap
            ///equal to "1px", i like to double the gap
            this.gap = args.gap * 2;
        }
        let prevBtn = args.prevEl;
        let nextBtn = args.nextEl;
        if (typeof prevBtn === 'string') {
            prevBtn = this.container.querySelector(prevBtn) ? this.container.querySelector(prevBtn) : document.querySelector(prevBtn);
        }
        if (prevBtn instanceof HTMLElement) {
            prevBtn.addEventListener('click', this.prevSlide.bind(this));
        }
        if (typeof nextBtn === 'string') {
            nextBtn = this.container.querySelector(nextBtn) ? this.container.querySelector(nextBtn) : document.querySelector(nextBtn);
        }
        if (nextBtn instanceof HTMLElement) {
            nextBtn.addEventListener('click', this.nextSlide.bind(this));
        }
        /** ******* */
        this._init();
    }
    _init() {
        ///save slider container width
        this.sliderContainerWidth = this.container.getBoundingClientRect().width;
        this.sliderWrapper = this.container.querySelector('.jsc-slider-wrapper');
        this.slides = this.container.querySelectorAll('.slide');
        if (!this.sliderWrapper || !this.slides)
            return;
        this.slidesLength = this.slides.length / this.slidesPerView;
        ///add all the slider events
        Object.keys(this.sliderEvents).map(event => {
            this.container.addEventListener(event, (e) => {
                // @ts-ignore
                this.sliderEvents[event].call(this, e);
            });
        });
        ///add event on resize
        window.onresize = () => this._onWindowResize();
        /** initalize slides gap **/
        let perViewWidth;
        if (this.slidesPerView > 1) {
            ///calculate slides per view gap
            perViewWidth = (this.sliderContainerWidth - (this.gap * (this.slidesPerView - 1))) / this.slidesPerView;
        }
        this.slides.forEach((slide, i) => {
            if (perViewWidth !== null && perViewWidth) {
                slide.style.width = perViewWidth + 'px';
            }
            if (i === 0)
                return;
            slide.style.marginLeft = this.gap + 'px';
        });
        /** End initalize slides gap **/
    }
    ///prevent default behavior in slide like image dragging effect inside slide
    _pointerDragStart(e) {
        const target = e.target;
        if (!target.closest('.slide'))
            return;
        e.preventDefault();
    }
    _pointerDown(e) {
        this.isDragging = true;
        this.startingPoint = this._getPosition(e);
    }
    _pointerMove(e) {
        if (!this.isDragging)
            return;
        if (!this.isFirstMove) {
            this.isFirstMove = true;
            this.dragTime = new Date().getTime();
        }
        ///if positive then the slide going to previous slide otherwise next slide
        this.translate = this._getPosition(e) - this.startingPoint;
        ///slider width plus gap
        const sliderWidthPlusGap = this.sliderContainerWidth + this.gap;
        ///if current slide is last slide and going to next slide decrease the translate value
        if (this.currentIndex >= (this.slidesLength - 1) && this.translate < 0) {
            this.sliderWrapper.style.transform = `translateX(${(this.translate / 2.5) - (this.currentIndex * sliderWidthPlusGap)}px)`;
            return;
        }
        ///if current slide is first slide and going to previous slide decrease the translate value
        if (this.currentIndex <= 0 && this.translate > 0) {
            this.sliderWrapper.style.transform = `translateX(${(this.translate / 2.5) + (this.currentIndex * sliderWidthPlusGap)}px)`;
            return;
        }
        ///restore the slide previous position if slide not going to left or right either
        this.sliderWrapper.style.transform = `translateX(${this.translate - (this.currentIndex * sliderWidthPlusGap)}px)`;
    }
    _pointerLeave() {
        ///current percentage of drag
        const currentPercent = (100 * Math.abs(this.translate)) / this.sliderContainerWidth;
        ///if the drag distance is greater than percentThreshold of the container
        ///or pointer leaving time minus the drag start time is lower than the time threshold
        ///increase or decrease the index based on the translate value
        if (this.isDragging && ((new Date().getTime() - this.dragTime) < this.timeThreshold || currentPercent > this.percentThreshold)) {
            ///slide going to the right
            if (this.translate > 0 && this.currentIndex > 0)
                --this.currentIndex;
            ///slide going to the left
            if (this.translate < 0 && this.currentIndex < (this.slidesLength - 1))
                ++this.currentIndex;
        }
        this._reset();
    }
    _reset(duration = 300) {
        this.sliderWrapper.style.transitionDuration = `${duration}ms`;
        this.sliderWrapper.style.transform = `translateX(${-(this.currentIndex * (this.sliderContainerWidth + this.gap))}px)`;
        setTimeout(() => {
            this.sliderWrapper.style.transitionDuration = '';
        }, duration);
        ///reset state variables
        this.isDragging = false;
        this.startingPoint = 0;
        this.isFirstMove = false;
        this.dragTime = 0;
        this.translate = 0;
    }
    _getPosition(e) {
        return (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
    }
    _onWindowResize() {
        this.sliderContainerWidth = this.container.getBoundingClientRect().width;
        this._reset(100);
    }
    nextSlide() {
        if (this.currentIndex >= (this.slidesLength - 1))
            return;
        this.currentIndex++;
        this._reset();
    }
    prevSlide() {
        if (this.currentIndex <= 0)
            return;
        this.currentIndex--;
        this._reset();
    }
}
const sliderContainer = document.querySelector('.jsc-slider-container');
const slider = new JsSlider({
    // container: sliderContainer,
    container: '.jsc-slider-container',
    slidesPerView: 1,
    gap: 15,
    prevEl: '.prev',
    nextEl: '.next',
});
//# sourceMappingURL=slider.js.map