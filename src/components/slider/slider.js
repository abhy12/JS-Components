"use strict";
/**
 * TOOD
 *
 * A11y
 * Vertical Slider
 */
///resize observer of slider
const __JscSliderResizeObserver = new ResizeObserver((entries => {
    entries.forEach(entry => {
        const target = entry.target;
        if (target.jscSlider instanceof JscSlider) {
            target.jscSlider._resize();
        }
    });
}));
///current pointer position
let __JscCurrentPointerPosition = 0;
function getPointerPosition(e) {
    return (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
}
class JscSlider {
    constructor(args) {
        ///state variables
        this.pointerStartingPosition = 0;
        this.isClicked = false;
        this.isPointerMoved = false;
        this.currentIndex = 0;
        this.dragTime = 0;
        this.isFirstMove = false;
        this.translate = 0;
        this.breakPointWidths = [];
        this.currentBreakPoint = null;
        this.currentActiveWidth = 0;
        this._isTransitioning = false;
        this._transitionTimeoutId = 0;
        this._tempIndex = 0;
        this._pausePointer = 0;
        ///can be change via args
        this.slidesPerView = 1;
        this.percentThreshold = 50;
        this.timeThreshold = 300;
        this.gap = 0;
        this.breakPoints = {};
        ///check if container arg is string and valid DOM query
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
        if (args.gap && args.gap > 0)
            this.gap = args.gap;
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
        ///https://developer.mozilla.org/en-US/docs/Glossary/Expando
        ///add current instance to the container element for futher use likely for event bubbling
        this.container.jscSlider = this;
        /** initialize breakpoints */
        ///save all the default values to breakpoint with value of width "0"
        this.breakPoints[0] = {
            slidesPerView: this.slidesPerView,
            gap: this.gap
        };
        const breakPointWidths = [];
        ///add all the breakpoints keys which has value of number to the breakPointWidths
        Object.keys(this.breakPoints).forEach(val => (+val >= 0) ? breakPointWidths.push(+val) : '');
        this.breakPointWidths = breakPointWidths.sort();
        ///saving slides length
        this.slidesLength = this.slides.length;
        ///apply all the responsive options to the slides
        this._applyResponsiveness();
        /** end initialization of breakpoints */
        ///add all the slider events
        this.container.addEventListener('pointerdown', this._pointerDown.bind(this));
        this.container.addEventListener('pointerup', this._pointerLeave.bind(this));
        ///add resize observer
        __JscSliderResizeObserver.observe(this.container);
        ///calculate slides dimensions
        this._calcSlidesDimensions();
    }
    /** All Event functions */
    _pointerDown(e) {
        var _a;
        const target = e.target;
        ///don't start moving slider if current target is not a slide, wrapper or container
        if (target !== this.container && ((_a = target.closest('.slide')) === null || _a === void 0 ? void 0 : _a.closest('.jsc-slider-container')) !== this.container
            && target.closest('.jsc-slider-wrapper') !== this.sliderWrapper)
            return;
        ///prevent default behavior in slide like image dragging effect inside slide
        e.preventDefault();
        this.pointerStartingPosition = getPointerPosition(e);
        this.isClicked = true;
        if (this._isTransitioning) {
            clearTimeout(this._transitionTimeoutId);
            this._isTransitioning = false;
            this._tempIndex = this.currentIndex;
            this.sliderWrapper.style.transitionDuration = '';
            this._pausePointer = ((this.currentIndex) * (this.sliderContainerWidth + this.gap)) + this.sliderWrapper.getBoundingClientRect().left;
            this._pointerMove();
        }
    }
    _pointerMove() {
        if (!this.isClicked)
            return;
        if (!this.isFirstMove) {
            this.isFirstMove = true;
            this.dragTime = new Date().getTime();
        }
        ///if positive then going to previous slide otherwise to the next slide
        this.translate = (__JscCurrentPointerPosition - this.pointerStartingPosition) + (this._pausePointer);
        ///slider width plus gap
        const sliderWidthPlusGap = this.sliderContainerWidth + this.gap;
        ///if current slide is last slide and going to next slide decrease the translate value
        if (this.currentIndex >= (this.totalSlidesPerView - 1) && this.translate < 0) {
            this.sliderWrapper.style.transform = `translateX(${(this.translate / 2.5) - (this.currentIndex * sliderWidthPlusGap)}px)`;
            return;
        }
        ///if current slide is first slide and going to previous slide decrease the translate value
        if (this.currentIndex <= 0 && this.translate > 0) {
            this.sliderWrapper.style.transform = `translateX(${(this.translate / 2.5) + (this.currentIndex * sliderWidthPlusGap)}px)`;
            return;
        }
        ///move the slider
        this.sliderWrapper.style.transform = `translateX(${this.translate - (this.currentIndex * sliderWidthPlusGap)}px)`;
    }
    _pointerLeave() {
        ///if the slider was clicked without moving
        ///then we don't have to do anything after that
        if (!this.isFirstMove) {
            this.isClicked = false;
            return;
        }
        ///current percentage of drag
        const currentDragPercent = (100 * Math.abs(this.translate)) / this.sliderContainerWidth;
        ///if the drag distance is greater than percentThreshold of the container
        ///or currentTime - dragStartTime is lower than the time threshold
        ///increase or decrease the index based on the translate value
        if (this.isClicked && ((new Date().getTime() - this.dragTime) < this.timeThreshold || currentDragPercent > this.percentThreshold)) {
            ///going to previous slide
            if (this.translate > 0 && this.currentIndex > 0)
                this.prevSlide();
            ///going to next slide
            if (this.translate < 0 && this.currentIndex < (this.totalSlidesPerView - 1))
                this.nextSlide();
        }
        this._reset();
    }
    _resize() {
        this._applyResponsiveness();
        this.sliderContainerWidth = this.container.getBoundingClientRect().width;
        this._reset();
    }
    /** End Event functions */
    /** Controls Functions */
    nextSlide() {
        if (this.currentIndex >= (this.totalSlidesPerView - 1))
            return false;
        this._tempIndex = this.currentIndex + 1;
        clearTimeout(this._transitionTimeoutId);
        this._transitionTimeoutId = setTimeout(() => {
            this.currentIndex++;
        }, 200);
        this._reset();
        return true;
    }
    prevSlide() {
        if (this.currentIndex <= 0)
            return false;
        this._tempIndex = this.currentIndex - 1;
        clearTimeout(this._transitionTimeoutId);
        this._transitionTimeoutId = setTimeout(() => {
            this.currentIndex--;
        }, 200);
        this._reset();
        return true;
    }
    /** End Controls Functions */
    /** Utilities Functions */
    _applyResponsiveness() {
        const windowWidth = window.innerWidth;
        const prevPerView = this.slidesPerView;
        this.breakPointWidths.forEach(width => {
            if (width > windowWidth)
                return;
            ///slidesPerView
            if (+(this.breakPoints[width].slidesPerView) > 0) {
                ///not trying to add values
                this.slidesPerView = (+this.breakPoints[width].slidesPerView);
            }
            ///gap
            if (+(this.breakPoints[width].gap) > 0) {
                ///multiplying gap because i don't want "1" gap equal to "1px"
                ///i want to double the gap
                this.gap = (+this.breakPoints[width].gap) * 2;
            }
        });
        ///adjust slide index based on current slidesPerView
        if (this.currentIndex > 0 && prevPerView !== this.slidesPerView) {
            if (this.slidesPerView < prevPerView) {
                ///Suppose we have total of 6 slides and we want to find out the nearest index,
                ///so the current value of slidesPreView = 3 and the currentIndex = 1 (2nd slide)
                ///and we are changing slidesPreView to 1 so the currentIndex should be 3 (4th slide)
                ///prevSlidePreView x currentIndex = 3
                this.currentIndex = (prevPerView * this.currentIndex) / this.slidesPerView;
            }
            else if (this.slidesPerView > prevPerView) {
                ///prevView = 1, prevIndex = 4, currentView = 3
                ///prevIndex / currentView = 1.3333333
                ///round it to 1
                this.currentIndex = Math.floor(this.currentIndex / this.slidesPerView);
            }
        }
        this.totalSlidesPerView = this.slidesLength / this.slidesPerView;
    }
    _calcSlidesDimensions() {
        let slideWidth = null;
        if (this.slidesPerView > 1) {
            ///calculate slide width
            slideWidth = (this.sliderContainerWidth - (this.gap * (this.slidesPerView - 1))) / this.slidesPerView;
        }
        this.slides.forEach((slide, i) => {
            if (slideWidth)
                slide.style.width = slideWidth + 'px';
            ///have to do this because the previous slidePerView slide width can be
            ///different, so we have to remove the previous width it
            if (slideWidth === null) {
                ///if slidePerView is 1 no need to add any width to slide
                slide.style.width = '';
            }
            ///don't add left margin if this is first slide
            if (i === 0)
                return;
            slide.style.marginLeft = this.gap + 'px';
        });
    }
    _reset() {
        this.sliderWrapper.style.transitionDuration = "300ms";
        ///restore slide position
        ///using tempIndex for mimicking translate
        this.sliderWrapper.style.transform = `translateX(${-(this._tempIndex * (this.sliderContainerWidth + this.gap))}px)`;
        this._isTransitioning = true;
        setTimeout(() => {
            this.sliderWrapper.style.transitionDuration = '';
        }, 300);
        setTimeout(() => {
            this._isTransitioning = false;
        }, 200);
        ///recalculate slides width
        this._calcSlidesDimensions();
        ///reset state variables
        this.isClicked = false;
        this.isPointerMoved = false;
        this.pointerStartingPosition = 0;
        this.isFirstMove = false;
        this.dragTime = 0;
        this.translate = 0;
        this._pausePointer = 0;
    }
}
///using IIFE so activeSlider variable can't be alter by anyone
(() => {
    ///current active slider
    let activeSlider = null;
    /** global events */
    document.addEventListener('pointermove', (e) => {
        const target = e.target;
        __JscCurrentPointerPosition = getPointerPosition(e);
        ///checking if the target is not a HTMLdocument because HTMLdocument don't have any nearset element
        ///so there is no point of assigning new activeSlider, same goes to if the previous activeSlider
        ///is equal to current target slider container
        if (target instanceof HTMLElement) {
            const closestSlider = target.closest('.jsc-slider-container');
            if (closestSlider !== activeSlider)
                activeSlider = closestSlider;
        }
        ///if slider isClicked is false then don't move current activeSlider
        if (!activeSlider || !(activeSlider.jscSlider instanceof JscSlider) || !activeSlider.jscSlider.isClicked) {
            activeSlider = null;
            return;
        }
        ///move slider
        activeSlider.jscSlider._pointerMove();
    });
    function sliderLeave(e, isBlurEvent = false) {
        const target = e.target;
        if (activeSlider === null || !(activeSlider.jscSlider instanceof JscSlider))
            return;
        ///if closest element is equal to current active slider don't need to reset the slider.
        ///Doing this because if the pointer pointing at the slider gap which is margin then this event
        ///will occur so which means slider is still moving so there is no need to rest the slider
        ///P.S don't need to worry about how slider will actually leave when the closest slider is activeSlider
        ///because it's directly implamented in the slider class itself
        if (!isBlurEvent && !(target instanceof HTMLElement && (target.closest('.jsc-slider-container') !== activeSlider)))
            return;
        activeSlider.jscSlider._pointerLeave();
        activeSlider = null;
    }
    ///pointer leave events
    document.addEventListener('pointerup', sliderLeave);
    document.addEventListener('pointerout', sliderLeave);
    ///this event will happen when browser tab changes
    document.addEventListener('visibilitychange', (e) => {
        sliderLeave(e, true);
    });
    /** End global events */
})();
//# sourceMappingURL=slider.js.map