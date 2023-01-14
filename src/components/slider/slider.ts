/**
 * TOOD
 * Responsive
 * Controls
 * A11y
 * Vertical Slider
 */

interface JsSliderArgs {
   container: string | HTMLElement,
   slidesPerView?: number,
   gap?: number,
   prevEl?: string | HTMLElement,
   nextEl?: string | HTMLElement,
   breakPoints?: {},
}

class JsSlider {
   ///core variables
   container: HTMLElement;
   sliderWrapper: HTMLElement;
   slides: NodeListOf<HTMLElement>;
   sliderContainerWidth: number;

   ///state variables
   startingPoint = 0;
   isDragging = false;
   currentIndex = 0;
   slidesLength: number;
   dragTime = 0;
   isFirstMove = false;
   translate = 0;
   breakPointsIndex: [];
   currentBreakPoint: number | null = null;

   ///can be change via args
   slidesPerView = 1;
   percentThreshold = 50;
   timeThreshold = 300;
   gap = 0;
   breakPoints:any | {} = {}

   ///slider events
   sliderEvents = {
      'mousedown': this._pointerDown,
      'mouseup': this._pointerLeave, 
      // 'mouseleave':  this._pointerLeave,
      'mousemove': this._pointerMove,
      'touchstart': this._pointerDown,
      'touchend': this._pointerLeave, 
      'touchmove': this._pointerMove,
      'dragstart': this._pointerDragStart,
   }

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

      if( !this.sliderWrapper || !this.slides ) return;

      /** initalize breakpoints */
      const breakPoints: string[] = Object.keys( this.breakPoints ).sort().reverse();

      for( let i = 0; i < breakPoints.length; i++ ) {
         if( !( +breakPoints[i] ) ) continue;
         const responsive = this.breakPoints[breakPoints[i]];
         let conMetTimes = 0;

         if( typeof +( responsive.slidesPerView ) === 'number' )  {
            this.slidesPerView = +( responsive.slidesPerView );
            conMetTimes++;
         }

         if( typeof +( responsive.gap ) === 'number' )  {
            this.gap = +( responsive.gap );
            conMetTimes++;
         }

         if( conMetTimes > 0 ) {
            this.currentBreakPoint = +breakPoints[i];
            break;
         }
      }

      /** end initialization of breakpoints */

      this.slidesLength = this.slides.length / this.slidesPerView;

      ///add all the slider events
      Object.keys( this.sliderEvents ).map( event => {
         // @ts-ignore
         this.container.addEventListener( event, ( e ) => this.sliderEvents[event].call( this, e ) );
      });

      ///add event on resize
      window.onresize = () => this._onWindowResize();

      /** initalize slides gap **/

      ///multiplying gap because i don't want "1" gap
      ///equal to "1px", i like to double the gap
      this.gap*= 2;

      this._calcSlidesDimensions()

      /** End initialization of slides gap **/
   }

   ///prevent default behavior in slide like image dragging effect inside slide
   _pointerDragStart( e: MouseEvent | TouchEvent )  {
      const target = e.target as HTMLElement;

      if( !target.closest( '.slide' ) ) return;

      e.preventDefault();
   }

   _pointerDown( e: MouseEvent | TouchEvent )  {
      this.isDragging = true
      this.startingPoint = this._getPosition( e );
   }

   _pointerMove( e: MouseEvent | TouchEvent )  {
      if( !this.isDragging ) return;

      if( !this.isFirstMove )  {
         this.isFirstMove = true;
         this.dragTime = new Date().getTime();
      }

      ///if positive then the slide going to previous slide otherwise next slide
      this.translate = this._getPosition( e ) - this.startingPoint;

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
      const currentPercent = ( 100 * Math.abs( this.translate ) ) / this.sliderContainerWidth;

      ///if the drag distance is greater than percentThreshold of the container
      ///or pointer leaving time minus the drag start time is lower than the time threshold
      ///increase or decrease the index based on the translate value
      if( this.isDragging && ( ( new Date().getTime() - this.dragTime ) < this.timeThreshold || currentPercent > this.percentThreshold ) )  {

         ///slide going to the right
         if( this.translate > 0 && this.currentIndex > 0  ) --this.currentIndex;

         ///slide going to the left
         if( this.translate < 0 && this.currentIndex < ( this.slidesLength - 1 ) ) ++this.currentIndex;
      }

      this._reset();
   }

   _reset( transitionDuration: number = 300 )  {
      this.sliderWrapper.style.transitionDuration = `${transitionDuration}ms`;
      this.sliderWrapper.style.transform = `translateX(${-( this.currentIndex * ( this.sliderContainerWidth + this.gap ) )}px)`; 
      setTimeout( () => {
         this.sliderWrapper.style.transitionDuration = '';
      }, transitionDuration );

      ///recalculate slides width
      this._calcSlidesDimensions();

      ///reset state variables
      this.isDragging = false;
      this.startingPoint = 0;
      this.isFirstMove = false;
      this.dragTime = 0;
      this.translate = 0;
   }

   _getPosition( e: MouseEvent | TouchEvent )  {
      return ( e instanceof MouseEvent ) ? e.clientX : e.touches[0].clientX;
   }

   _onWindowResize()  {
      this.sliderContainerWidth = this.container.getBoundingClientRect().width;
      this._reset( 100 );
   }

   _calcSlidesDimensions()  {
      let perViewWidth: number | null;

      if( this.slidesPerView > 1 )  {
         ///calculate slides per view gap
         perViewWidth = ( this.sliderContainerWidth - ( this.gap * ( this.slidesPerView - 1 ) ) ) / this.slidesPerView;
      }

      this.slides.forEach( ( slide, i ) =>  {
         if( perViewWidth !== null && perViewWidth )  {
            slide.style.width = perViewWidth + 'px';
         }

         if( i === 0 ) return;

         slide.style.marginLeft = this.gap + 'px';
      });
   }

   nextSlide()  {
      if( this.currentIndex >= ( this.slidesLength - 1 ) ) return;
      this.currentIndex++;
      this._reset();
   }

   prevSlide()  {
      if( this.currentIndex <= 0 ) return;
      this.currentIndex--;
      this._reset();
   }
}

const sliderContainer = document.querySelector( '.jsc-slider-container' ) as HTMLElement;

const slider = new JsSlider({
   // container: sliderContainer,
   container: '.jsc-slider-container',
   slidesPerView: 2,
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