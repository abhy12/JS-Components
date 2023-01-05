/**
 * TOOD
 * Work on gap
 * A11y
 * Vertical Slider
 */

interface JsSliderArgs {
   container: string | HTMLElement,
   slidesPerView?: number,
   gap?: number,
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

   ///can be change via args
   slidesPerView = 1;
   percentThreshold = 50;
   timeThreshold = 300;
   gap = 0;

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
      ///check if container arg is string or htmlelement
      if( typeof args.container === 'string' )  {
         this.container = document.querySelector( args.container ) as HTMLElement;
      } else if( args.container instanceof HTMLElement )  {
         this.container = args.container;
      }

      if( !this.container )  return;
      /** any expression after this */

      /**** will improve this in more efficient way ****/

      ///assign other arguments to global class variables
      if( args.slidesPerView && args.slidesPerView > 0 )  {
         this.slidesPerView = args.slidesPerView;
      }

      if( args.gap && args.gap > 0 )  {
         ///multiplying gap for good user experience i guess
         this.gap = args.gap * 2;
      }

      /** ******* */

      this._init();
   }

   _init()  {
      ///save slider container width
      this.sliderContainerWidth = this.container.getBoundingClientRect().width;
      this.sliderWrapper = this.container.querySelector( '.jsc-slider-wrapper' ) as HTMLElement;
      this.slides = this.container.querySelectorAll( '.slide' ) as NodeListOf<HTMLElement>;

      if( !this.sliderWrapper || !this.slides ) return;

      this.slidesLength = this.slides.length / this.slidesPerView;

      ///add all the slider events
      Object.keys( this.sliderEvents ).map( event => {
         this.container.addEventListener( event, ( e ) => {
            // @ts-ignore
            this.sliderEvents[event].call( this, e )
         });
      });

      ///initalize slides per view and gap
      if( this.slidesPerView > 1 )  {
         const perViewWidth = this.sliderContainerWidth / this.slidesPerView;

         this.slides.forEach( ( slide, i ) =>  {
            slide.style.width = perViewWidth + 'px';

            if( i === 0 ) return;

            // slide.style.marginLeft = this.gap + 'px';
         });
      }
   }

   ///prevent default behavior in slide like image dragging effect inside slide
   _pointerDragStart( e: MouseEvent | TouchEvent )  {
      const target = e.target as HTMLElement;
      const currentTarget = e.currentTarget;

      if( !target.closest( '.slide' )?.classList.contains( 'slide' ) ) return;

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

      ///if positive then the slide going to left otherwise right
      this.translate = this._getPosition( e ) - this.startingPoint;

      if( this.currentIndex >= ( this.slidesLength - 1 ) && this.translate < 0 ) {
         this.sliderWrapper.style.transform = `translateX(${( this.translate / 2.5 ) - ( this.currentIndex * this.sliderContainerWidth )}px)`;
         return;
      }

      if( this.currentIndex <= 0 && this.translate > 0 ) {
         this.sliderWrapper.style.transform = `translateX(${( this.translate / 2.5 ) + ( this.currentIndex * this.sliderContainerWidth )}px)`;
         return;
      }

      this.sliderWrapper.style.transform = `translateX(${this.translate - ( this.currentIndex * this.sliderContainerWidth )}px)`;
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

      this.sliderWrapper.style.transitionDuration = '300ms';
      this.sliderWrapper.style.transform = `translateX(${-( this.currentIndex * this.sliderContainerWidth )}px)`; 
      setTimeout( () => {
         this.sliderWrapper.style.transitionDuration = '';
      }, 300 );

      ///reset
      this.isDragging = false;
      this.startingPoint = 0;
      this.isFirstMove = false;
      this.dragTime = 0;
      this.translate = 0;
   }

   _getPosition( e: MouseEvent | TouchEvent )  {
      return ( e instanceof MouseEvent ) ? e.clientX : e.touches[0].clientX;
   }
}

const sliderContainer = document.querySelector( '.jsc-slider-container' ) as HTMLElement;

const slider = new JsSlider({
   // container: sliderContainer,
   container: '.jsc-slider-container',
   slidesPerView: 2,
   gap: 20,
});