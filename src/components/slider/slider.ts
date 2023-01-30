/**
 * TOOD
 * A11y
 * Vertical Slider
 */
interface JsSliderElement extends HTMLElement {
   jsSlide: JsSlider
}

let pointerPosition = 0;
let activeSlider: null | JsSliderElement = null;

interface JsSliderArgs {
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

class JsSlider {
   ///core variables
   container: HTMLElement;
   sliderWrapper: HTMLElement;
   slides: NodeListOf<HTMLElement>;
   sliderContainerWidth: number;

   ///state variables
   pointerStartingPosition = 0;
   isClicked = false;
   isPointerMoved = false;
   currentIndex = 0;
   slidesLength: number;
   dragTime = 0;
   isFirstMove = false;
   translate = 0;
   breakPointsIndex: number[] = [];
   currentBreakPoint: number | null = null;

   ///can be change via args
   defaultSlidesPerView: number = 1;
   defaultGap: number = 0;
   slidesPerView = 1;
   percentThreshold = 50;
   timeThreshold = 300;
   gap = 0;
   breakPoints:any | {} = {};

   constructor( args: JsSliderArgs ) {
      ///check if container arg is string
      if( typeof args.container === 'string' )  {
         args.container = document.querySelector( args.container ) as HTMLElement;
      }

      if( !( args.container instanceof HTMLElement ) )  return;

      this.container = args.container;
      /** any expression after this */

      /**** will improve this in more efficient way ****/
      ///assign other arguments to global class variables

      if( args.slidesPerView && args.slidesPerView > 0 )  {
         this.defaultSlidesPerView = args.slidesPerView;
      }

      if( args.gap && args.gap > 0 )  this.defaultGap = args.gap;

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

      if( !this.sliderWrapper || !this.slides ) return;

      //@ts-ignore
      ///add current instance to the container for futher use likely for event bubbling
      this.container.jsSlide = this; 

      /** initialize breakpoints */
      const breakPointsIndex: string[] = Object.keys( this.breakPoints );

      if( breakPointsIndex.length > 0 )  {
         this.breakPointsIndex = breakPointsIndex.map( point => +point ).filter( ( a ) => {
            if( a < 0 ) return false;
            return true;
         }).sort().reverse();
      }

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
      this.translate = pointerPosition - this.pointerStartingPosition;

      ///slider width plus gap
      const sliderWidthPlusGap = this.sliderContainerWidth + this.gap;

      ///if current slide is last slide and going to next slide decrease the translate value
      if( this.currentIndex >= ( this.slidesLength - 1 ) && this.translate < 0 ) {
         this.sliderWrapper.style.transform = `translateX(${( this.translate / 2.5 ) - ( this.currentIndex * sliderWidthPlusGap )}px)`;
         return;
      }

      ///if current slide is first slide and going to previous slide decrease the translate value
      if( this.currentIndex <= 0 && this.translate > 0 ) {
         this.sliderWrapper.style.transform = `translateX(${( this.translate / 2.5 ) + ( this.currentIndex * sliderWidthPlusGap )}px)`;
         return;
      }

      ///restore the slide previous position if slide not going to left or right either
      this.sliderWrapper.style.transform = `translateX(${this.translate - ( this.currentIndex * sliderWidthPlusGap )}px)`;
   }

   _pointerLeave()  {
      ///current percentage of drag
      const currentDragPercent = ( 100 * Math.abs( this.translate ) ) / this.sliderContainerWidth;

      ///if the drag distance is greater than percentThreshold of the container
      ///or pointer leaving time minus the drag start time is lower than the time threshold
      ///increase or decrease the index based on the translate value
      if( this.isClicked && ( ( new Date().getTime() - this.dragTime ) < this.timeThreshold || currentDragPercent > this.percentThreshold ) )  {

         ///slide going to the right
         if( this.translate > 0 && this.currentIndex > 0  ) --this.currentIndex;

         ///slide going to the left
         if( this.translate < 0 && this.currentIndex < ( this.slidesLength - 1 ) ) ++this.currentIndex;
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
      if( this.currentIndex >= ( this.slidesLength - 1 ) ) return false;
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
      if( this.breakPointsIndex.length > 0 )  {
         const windowWidth = window.innerWidth;
         let conMetTimes = 0;

         for( let i = 0; i < this.breakPointsIndex.length; i++ )  {
            const responsiveOptions = this.breakPoints[this.breakPointsIndex[i]];

            if( windowWidth <= this.breakPointsIndex[i] ) continue;

            if( typeof +( responsiveOptions.slidesPerView ) === "number" )  {
               if( +( responsiveOptions.slidesPerView ) !== this.slidesPerView )  {
                  this.slidesPerView = +( responsiveOptions.slidesPerView );

                  ///when slidePerView change return slide to closest index value
                  if( this.currentIndex > 0 )  {
                     this.currentIndex = Math.abs( Math.floor( this.slidesPerView / this.currentIndex ) );
                  }
               }
               conMetTimes++;
            }

            if( typeof +( responsiveOptions.gap ) === "number" )  {
               this.gap = +( responsiveOptions.gap ) * 2;
               conMetTimes++;
            }

            if( conMetTimes > 0 )  {
               this.currentBreakPoint = this.breakPointsIndex[i];
               break;
            }
         }

         if( conMetTimes === 0 )  {
            this.slidesPerView = this.defaultSlidesPerView;

            ///multiplying gap because i don't want "1" gap equal to "1px"
            ///i like to double the gap
            this.gap = this.defaultGap * 2;
         }
      }

      ///saving slides length
      this.slidesLength = this.slides.length / this.slidesPerView;
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
         if( i === 0 ) return;

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

const sliderContainer = document.querySelector( '.jsc-slider-container' ) as HTMLElement;
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


document.addEventListener( 'pointermove', ( e ) =>  {
   const target = e.target as HTMLElement;
   let slider: null | JsSliderElement = null;
   pointerPosition = getPointerPosition( e );

   if( typeof target.closest === 'function' && activeSlider === null )  {
      slider = target?.closest( '.jsc-slider-container' ) as JsSliderElement;
   }

   if( activeSlider )  {
      slider = activeSlider;
   }

   if( slider && typeof slider.jsSlide !== 'undefined' )  {
      if( !activeSlider )  activeSlider = slider;

      slider.jsSlide._pointerMove();
   }
});

document.addEventListener( 'pointerup', () =>  {
   if( !activeSlider ) return

   activeSlider.jsSlide._pointerLeave();

   activeSlider = null;
});