const sliderContainer = document.querySelector( '.jsc-slider-container' ) as HTMLElement;
const sliderWrapper = sliderContainer?.querySelector( '.jsc-slider-wrapper' ) as HTMLElement;
const slides = sliderContainer?.querySelectorAll( '.slide' ) as NodeListOf<HTMLElement>;

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
let startingPoint = 0,
   isDragging = false,
   currentIndex = 0,
   slidesLength = slides.length,
   makeSwipeHarder = 0;

const sliderContainerWidth = sliderContainer.getBoundingClientRect().width,
   percentThreshold = 5;

///prevent default behavior in slide like image dragging inside slider slide
sliderContainer.addEventListener( 'dragstart', ( e ) => {
   const target = e.target as HTMLElement;
   const currentTarget = e.currentTarget;

   if( !target.closest( '.slide' )?.classList.contains( 'slide' ) ) return;

   e.preventDefault();
});

function pointerDown( e: MouseEvent | TouchEvent )  {
   isDragging = true
   startingPoint= getPosition( e );
}

function pointerMove( e: MouseEvent | TouchEvent )  {
   if( !isDragging ) return;
  
   ///if positive then the slide going to left otherwise right
   const translate = getPosition( e ) - startingPoint;

   ///current percentage of drag
   const currentPercent = ( 100 * Math.abs( translate ) ) / sliderContainerWidth;

   if( currentIndex >= ( slides.length - 1 ) && translate < 0 ) {
      sliderWrapper.style.transform = `translateX(${( translate / 2.5 ) - ( currentIndex * sliderContainerWidth )}px)`;
      return;
   };

   if( currentIndex <= 0 && translate > 0 ) {
      sliderWrapper.style.transform = `translateX(${( translate / 2.5 ) + ( currentIndex * sliderContainerWidth )}px)`;
      return;
   }

   ///if the drag distance is grater than percentThreshold of the container
   if( currentPercent > percentThreshold )  {

      ///the slide going to the right
      if( translate < 0 )  currentIndex++;

      ///going to the left
      if( translate > 0 )  currentIndex--;

      sliderWrapper.style.transitionDuration = '300ms';
      sliderWrapper.style.transform = `translateX(${-( currentIndex * sliderContainerWidth )}px)`;
      setTimeout( () => {
         sliderWrapper.style.transitionDuration = '';
      }, 300 );

      startingPoint = 0;
      isDragging = false;
   } else {
      sliderWrapper.style.transform = `translateX(${translate - ( currentIndex * sliderContainerWidth )}px)`;
   }
}

function pointerLeave()  {
   sliderWrapper.style.transitionDuration = '300ms';
   sliderWrapper.style.transform = `translateX(${-( currentIndex * sliderContainerWidth )}px)`;   
   setTimeout( () => {
      sliderWrapper.style.transitionDuration = '';
   }, 300 );
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
Object.keys( sliderEvents ).map( event => {
   //@ts-ignore
   sliderContainer.addEventListener( event, sliderEvents[event] );
});

function getPosition( e: MouseEvent | TouchEvent )  {
   return ( e instanceof MouseEvent ) ? e.clientX : e.touches[0].clientX;
}