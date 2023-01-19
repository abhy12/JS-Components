"use strict";
/**
 * TOOD
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
        this.breakPointsIndex = [];
        this.currentBreakPoint = null;
        ///can be change via args
        this.defaultSlidesPerView = 1;
        this.defaultGap = 0;
        this.slidesPerView = 1;
        this.percentThreshold = 50;
        this.timeThreshold = 300;
        this.gap = 0;
        this.breakPoints = {};
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
            this.defaultSlidesPerView = args.slidesPerView;
        }
        if (args.gap && args.gap > 0)
            this.defaultGap = args.gap;
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
        if (typeof args.breakPoints === 'object')
            this.breakPoints = args.breakPoints;
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
        /** initialize breakpoints */
        const breakPointsIndex = Object.keys(this.breakPoints);
        if (breakPointsIndex.length > 0) {
            this.breakPointsIndex = breakPointsIndex.map(point => +point).filter((a) => {
                if (a < 0)
                    return false;
                return true;
            }).sort().reverse();
        }
        ///apply all the responsive options to the slides
        this._applyResponsiveness();
        /** end initialization of breakpoints */
        ///add all the slider events
        this.container.addEventListener('pointerdown', this._pointerDown.bind(this));
        this.container.addEventListener('pointerdown', this._pointerDragStart.bind(this));
        this.container.addEventListener('pointerup', this._pointerLeave.bind(this));
        this.container.addEventListener('pointermove', this._pointerMove.bind(this));
        ///add event on resize
        window.onresize = () => this._onWindowResize();
        ///calculate slides dimensions
        this._calcSlidesDimensions();
    }
    /** All Event functions */
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
        const pointerPosition = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
        // console.log( pointerPosition, this.sliderContainerWidth );
        if (pointerPosition >= this.sliderContainerWidth) {
            this._pointerLeave();
            return;
        }
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
        const currentDragPercent = (100 * Math.abs(this.translate)) / this.sliderContainerWidth;
        ///if the drag distance is greater than percentThreshold of the container
        ///or pointer leaving time minus the drag start time is lower than the time threshold
        ///increase or decrease the index based on the translate value
        if (this.isDragging && ((new Date().getTime() - this.dragTime) < this.timeThreshold || currentDragPercent > this.percentThreshold)) {
            ///slide going to the right
            if (this.translate > 0 && this.currentIndex > 0)
                --this.currentIndex;
            ///slide going to the left
            if (this.translate < 0 && this.currentIndex < (this.slidesLength - 1))
                ++this.currentIndex;
        }
        this._reset();
    }
    _onWindowResize() {
        this._applyResponsiveness();
        this.sliderContainerWidth = this.container.getBoundingClientRect().width;
        this._reset(100);
    }
    /** End Event functions */
    /** Controls Functions */
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
    /** End Controls Functions */
    /** Utilities Functions */
    _getPosition(e) {
        return (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
    }
    _applyResponsiveness() {
        if (this.breakPointsIndex.length > 0) {
            const windowWidth = window.innerWidth;
            let conMetTimes = 0;
            for (let i = 0; i < this.breakPointsIndex.length; i++) {
                const responsiveOptions = this.breakPoints[this.breakPointsIndex[i]];
                if (windowWidth <= this.breakPointsIndex[i])
                    continue;
                if (typeof +(responsiveOptions.slidesPerView) === "number") {
                    if (+(responsiveOptions.slidesPerView) !== this.slidesPerView) {
                        this.slidesPerView = +(responsiveOptions.slidesPerView);
                        ///when slidePerView change return slide to closest index value
                        if (this.currentIndex > 0) {
                            this.currentIndex = Math.abs(Math.floor(this.slidesPerView / this.currentIndex));
                        }
                    }
                    conMetTimes++;
                }
                if (typeof +(responsiveOptions.gap) === "number") {
                    this.gap = +(responsiveOptions.gap) * 2;
                    conMetTimes++;
                }
                if (conMetTimes > 0) {
                    this.currentBreakPoint = this.breakPointsIndex[i];
                    break;
                }
            }
            if (conMetTimes === 0) {
                this.slidesPerView = this.defaultSlidesPerView;
                ///multiplying gap because i don't want "1" gap equal to "1px"
                ///i like to double the gap
                this.gap = this.defaultGap * 2;
            }
        }
        ///saving slides length
        this.slidesLength = this.slides.length / this.slidesPerView;
    }
    _calcSlidesDimensions() {
        let perViewWidth = null;
        if (this.slidesPerView > 1) {
            ///calculate slides per view gap
            perViewWidth = (this.sliderContainerWidth - (this.gap * (this.slidesPerView - 1))) / this.slidesPerView;
        }
        this.slides.forEach((slide, i) => {
            if (perViewWidth !== null && perViewWidth) {
                slide.style.width = perViewWidth + 'px';
            }
            else if (perViewWidth === null) {
                ///if slidePerView is 1 no need to add any width to slide
                slide.style.width = '';
            }
            ///don't add left margin if this is first slide
            if (i === 0)
                return;
            slide.style.marginLeft = this.gap + 'px';
        });
    }
    _reset(transitionDuration = 300) {
        this.sliderWrapper.style.transitionDuration = `${transitionDuration}ms`;
        this.sliderWrapper.style.transform = `translateX(${-(this.currentIndex * (this.sliderContainerWidth + this.gap))}px)`;
        setTimeout(() => {
            this.sliderWrapper.style.transitionDuration = '';
        }, transitionDuration);
        ///recalculate slides width
        this._calcSlidesDimensions();
        ///reset state variables
        this.isDragging = false;
        this.startingPoint = 0;
        this.isFirstMove = false;
        this.dragTime = 0;
        this.translate = 0;
    }
}
const sliderContainer = document.querySelector('.jsc-slider-container');
const slider = new JsSlider({
    // container: sliderContainer,
    container: '.jsc-slider-container',
    slidesPerView: 1,
    gap: 5,
    prevEl: '.prev',
    nextEl: '.next',
    breakPoints: {
        480: {
            slidesPerView: 2,
            gap: 10,
        },
        768: {
            slidesPerView: 3,
            gap: 15,
        },
    }
});
//# sourceMappingURL=slider.js.map