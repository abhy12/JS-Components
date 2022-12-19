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
   slidesLength = slides.length;

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

   console.log( currentPercent );
   ///if the drag distance is grater than percentThreshold of the container
   if( currentPercent > percentThreshold )  {

      ///the slide going to the right
      if( translate < 0 )  {
         if( currentIndex >= ( slides.length - 1 ) ) return;
         currentIndex++;
      } 

      ///going to the left
      if( translate > 0 )  {
         if( currentIndex <= 0 ) return;
         currentIndex--;
      }

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
   // console.log( translate );
}

function pointerLeave()  {
   sliderWrapper.style.transitionDuration = '300ms';
   sliderWrapper.style.transform = `translateX(${-( currentIndex * sliderContainerWidth )}px)`;   
   setTimeout( () => {
      sliderWrapper.style.transitionDuration = '';
   }, 300 );
   isDragging = false;
   startingPoint = 0;
}

///slider events
const sliderEvents = {
   'mousedown': pointerDown,
   'mouseup': pointerLeave, 
   // 'mouseleave':  pointerLeave,
   'mousemove': pointerMove,
   // 'touchstart',
   // 'touchend', 
   // 'touchmove'
};

///add all the slider events
Object.keys( sliderEvents ).map( event => {
   //@ts-ignore
   sliderContainer.addEventListener( event, sliderEvents[event] );
});

function getPosition( e: MouseEvent | TouchEvent )  {
   return ( e instanceof MouseEvent ) ? e.clientX : e.touches[0].clientX;
}