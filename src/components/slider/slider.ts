/**
 * TOOD
 * 
 * Optimize resize event
 * A11y
 * Vertical Slider
 */

interface JscSliderElement extends HTMLElement  {
   jscSlider?: JscSlider
}

///current pointer position
let currentPointerPosition = 0;

interface JscSliderArgs {
   container: string | HTMLElement,
   slidesPerView?: number,
   gap?: number,
   prevEl?: string | HTMLElement,
   nextEl?: string | HTMLElement,
   breakPoints?: {},
}

function getPointerPosition( e: MouseEvent | TouchEvent )  {
   return ( e instanceof MouseEvent ) ? e.clientX : e.touches[0].clientX;
}

class JscSlider  {
   ///core variables
   container: JscSliderElement;
   sliderWrapper: HTMLElement;
   slides: NodeListOf<HTMLElement>;
   sliderContainerWidth: number;

   ///state variables
   pointerStartingPosition = 0;
   isClicked = false;
   isPointerMoved = false;
   currentIndex = 0;
   slidesLength: number;
   totalSlidesPerView: number;
   dragTime = 0;
   isFirstMove = false;
   translate = 0;
   breakPointWidths: number[] = [];
   currentBreakPoint: number | null = null;
   currentActiveWidth: number = 0;

   ///can be change via args
   slidesPerView = 1;
   percentThreshold = 50;
   timeThreshold = 300;
   gap = 0;
   breakPoints:any | {} = {};

   constructor( args: JscSliderArgs )  {
      ///check if container arg is string
      if( typeof args.container === 'string' )  {
         args.container = document.querySelector( args.container ) as HTMLElement;
      }

      if( !( args.container instanceof HTMLElement ) )  return

      this.container = args.container;
      /** any expression after this */

      /**** will improve this in more efficient way ****/
      ///assign other arguments to global class variables

      if( args.slidesPerView && args.slidesPerView > 0 )  {
         this.slidesPerView = args.slidesPerView;
      }

      if( args.gap && args.gap > 0 )  this.gap = args.gap;

      let prevBtn: string | HTMLElement | undefined = args.prevEl;
      let nextBtn: string | HTMLElement | undefined = args.nextEl;

      if( typeof prevBtn === 'string' )  {
         prevBtn = this.container.querySelector( prevBtn ) ? this.container.querySelector( prevBtn ) as HTMLElement : document.querySelector( prevBtn ) as HTMLElement;
      }

      if( prevBtn instanceof HTMLElement )  {
         prevBtn.addEventListener( 'click', this.prevSlide.bind( this ) );
      }

      if( typeof nextBtn === 'string' )  {
         nextBtn = this.container.querySelector( nextBtn ) ? this.container.querySelector( nextBtn ) as HTMLElement : document.querySelector( nextBtn ) as HTMLElement;
      }

      if( nextBtn instanceof HTMLElement )  {
         nextBtn.addEventListener( 'click', this.nextSlide.bind( this ) );
      }

      if( typeof args.breakPoints === 'object' )  this.breakPoints = args.breakPoints;

      /** ******* */

      this._init();
   }

   _init()  {
      ///save slider container width
      this.sliderContainerWidth = this.container.getBoundingClientRect().width;
      this.sliderWrapper = this.container.querySelector( '.jsc-slider-wrapper' ) as HTMLElement;
      this.slides = this.container.querySelectorAll( '.slide' ) as NodeListOf<HTMLElement>;

      if( !this.sliderWrapper || !this.slides )  return

      ///https://developer.mozilla.org/en-US/docs/Glossary/Expando
      ///add current instance to the container element for futher use likely for event bubbling
      this.container.jscSlider = this; 

      /** initialize breakpoints */

      ///save all the default values to breakpoint with value of width "0"
      this.breakPoints[0] = {
         slidesPerView: this.slidesPerView,
         gap: this.gap
      }

      const breakPointWidths: number[] = [];
      ///add all the breakpoints keys which has value of number to the breakPointWidths
      Object.keys( this.breakPoints ).forEach( val => ( +val >= 0 ) ? breakPointWidths.push( +val ) : '' );
      this.breakPointWidths = breakPointWidths.sort();

      ///saving slides length
      this.slidesLength = this.slides.length;

      ///apply all the responsive options to the slides
      this._applyResponsiveness();

      /** end initialization of breakpoints */

      ///add all the slider events
      this.container.addEventListener( 'pointerdown', this._pointerDown.bind( this ) );
      this.container.addEventListener( 'pointerup', this._pointerLeave.bind( this ) );

      ///add event on resize
      window.onresize = () => this._onWindowResize();

      ///calculate slides dimensions
      this._calcSlidesDimensions();
   }

   /** All Event functions */

   _pointerDown( e: MouseEvent | TouchEvent )  {
      const target = e.target as HTMLElement;

      ///don't start moving slider if current target is not a slide, wrapper or container
      if( target !== this.container && target.closest( '.slide' )?.closest( '.jsc-slider-container' ) !== this.container && target.closest( '.jsc-slider-wrapper' ) !== this.sliderWrapper ) return

      ///prevent default behavior in slide like image dragging effect inside slide
      e.preventDefault();

      this.isClicked = true;
      this.pointerStartingPosition = getPointerPosition( e );
   }

   _pointerMove()  {
      if( !this.isClicked ) return

      if( !this.isFirstMove )  {
         this.isFirstMove = true;
         this.dragTime = new Date().getTime();
      }

      ///if positive then the slide going to previous slide otherwise next slide
      this.translate = currentPointerPosition - this.pointerStartingPosition;

      ///slider width plus gap
      const sliderWidthPlusGap = this.sliderContainerWidth + this.gap;

      ///if current slide is last slide and going to next slide decrease the translate value
      if( this.currentIndex >= ( this.totalSlidesPerView - 1 ) && this.translate < 0 )  {
         this.sliderWrapper.style.transform = `translateX(${( this.translate / 2.5 ) - ( this.currentIndex * sliderWidthPlusGap )}px)`;
         return
      }

      ///if current slide is first slide and going to previous slide decrease the translate value
      if( this.currentIndex <= 0 && this.translate > 0 )  {
         this.sliderWrapper.style.transform = `translateX(${( this.translate / 2.5 ) + ( this.currentIndex * sliderWidthPlusGap )}px)`;
         return
      }

      ///restore the slide previous position if slide not going to left or right either
      this.sliderWrapper.style.transform = `translateX(${this.translate - ( this.currentIndex * sliderWidthPlusGap )}px)`;
   }

   _pointerLeave()  {
      if( !this.isFirstMove )  {
         this.isClicked = false;
         return
      }

      ///current percentage of drag
      const currentDragPercent = ( 100 * Math.abs( this.translate ) ) / this.sliderContainerWidth;

      ///if the drag distance is greater than percentThreshold of the container
      ///or pointer leaving time minus the drag start time is lower than the time threshold
      ///increase or decrease the index based on the translate value
      if( this.isClicked && ( ( new Date().getTime() - this.dragTime ) < this.timeThreshold || currentDragPercent > this.percentThreshold ) )  {

         ///slide going to the right
         if( this.translate > 0 && this.currentIndex > 0  ) --this.currentIndex;

         ///slide going to the left
         if( this.translate < 0 && this.currentIndex < ( this.totalSlidesPerView - 1 ) ) ++this.currentIndex;
      }

      this._reset();
   }

   _onWindowResize()  {
      this._applyResponsiveness();
      this.sliderContainerWidth = this.container.getBoundingClientRect().width;
      this._reset();
   }

   /** End Event functions */

   /** Controls Functions */

   nextSlide()  {
      if( this.currentIndex >= ( this.totalSlidesPerView - 1 ) ) return false;
      this.currentIndex++;
      this._reset();
      return true;
   }

   prevSlide()  {
      if( this.currentIndex <= 0 ) return false;
      this.currentIndex--;
      this._reset();
      return true;
   }

   /** End Controls Functions */

   /** Utilities Functions */

   _applyResponsiveness()  {
      const windowWidth = window.innerWidth;
      const prevPerView = this.slidesPerView;

      this.breakPointWidths.forEach( width =>  {
         if( windowWidth < width )  return

         ///slidesPerView
         if( +( this.breakPoints[width].slidesPerView ) > 0 )  {
            ///not trying to add values
            this.slidesPerView = ( +this.breakPoints[width].slidesPerView );
         }

         ///gap
         if( +( this.breakPoints[width].gap ) > 0 )  {
            ///multiplying gap because i don't want "1" gap equal to "1px"
            ///i want to double the gap
            this.gap = ( +this.breakPoints[width].gap ) * 2;
         }
      });

      ///adjust slide index based on current slidesPerView
      if( this.currentIndex > 0 && prevPerView !== this.slidesPerView )  {
         if( this.slidesPerView < prevPerView )  {
            ///Suppose we have total of 6 slides and we want to find out the nearest index, 
            ///so the current value of slidesPreView = 3 and the currentIndex = 1 (2nd slide) 
            ///and we are changing slidesPreView to 1 so the currentIndex should be 3 (4th slide)
            ///prevSlidePreView x currentIndex = 3
            this.currentIndex = ( prevPerView * this.currentIndex ) / this.slidesPerView; 
         } else if( this.slidesPerView > prevPerView )  {
            ///prevView = 1, prevIndex = 4, currentView = 3
            ///prevIndex / currentView = 1.3333333
            ///round it to 1
            this.currentIndex = Math.floor( this.currentIndex / this.slidesPerView );
         }
      }

      this.totalSlidesPerView = this.slidesLength / this.slidesPerView;
   }

   _calcSlidesDimensions()  {
      let perViewWidth: number | null = null;

      if( this.slidesPerView > 1 )  {
         ///calculate slides per view gap
         perViewWidth = ( this.sliderContainerWidth - ( this.gap * ( this.slidesPerView - 1 ) ) ) / this.slidesPerView;
      }

      this.slides.forEach( ( slide, i ) =>  {
         if( perViewWidth !== null && perViewWidth )  {
            slide.style.width = perViewWidth + 'px';

         } else if( perViewWidth === null )  {
            ///if slidePerView is 1 no need to add any width to slide
            slide.style.width = '';
         }

         ///don't add left margin if this is first slide
         if( i === 0 ) return

         slide.style.marginLeft = this.gap + 'px';
      });
   }

   _reset()  {
      this.sliderWrapper.style.transitionDuration = "300ms";
      this.sliderWrapper.style.transform = `translateX(${-( this.currentIndex * ( this.sliderContainerWidth + this.gap ) )}px)`; 
      setTimeout( () => {
         this.sliderWrapper.style.transitionDuration = '';
      }, 300 );

      ///recalculate slides width
      this._calcSlidesDimensions();

      ///reset state variables
      this.isClicked = false;
      this.isPointerMoved = false;
      this.pointerStartingPosition = 0;
      this.isFirstMove = false;
      this.dragTime = 0;
      this.translate = 0;
   }

   /** End Utilities Functions */
}


///using IIFE so activeSlider variable can't be alter by anyone
(() =>  {
   ///current active slider
   let activeSlider: null | JscSliderElement = null;

   /** global events */

   document.addEventListener( 'pointermove', ( e ) =>  {
      const target = e.target as HTMLElement;
      let slider: null | JscSliderElement = null;
      currentPointerPosition = getPointerPosition( e );

      if( typeof target.closest === 'function' && activeSlider === null )  {
         slider = target?.closest( '.jsc-slider-container' ) as JscSliderElement;
      }

      if( activeSlider )  {
         slider = activeSlider;
      }

      if( slider && typeof slider.jscSlider !== 'undefined' )  {
         if( !activeSlider )  activeSlider = slider;

         slider.jscSlider._pointerMove();
      }
   });

   document.addEventListener( 'pointerup', () =>  {
      if( !activeSlider ) return

      activeSlider.jscSlider?._pointerLeave();

      activeSlider = null;
   });

   /** End global events */
})();