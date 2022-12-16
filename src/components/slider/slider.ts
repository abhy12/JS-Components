const sliderContainer = document.querySelector( '.jsc-slider-container' ) as HTMLElement;
const slides = sliderContainer?.querySelectorAll( '.slide' ) as NodeListOf<HTMLElement>;

let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    animationID = 0,
    currentIndex = 0,
    prevTranslate = 0

slides?.forEach( ( slide, i ) => {

   slide.addEventListener( 'dragstart', ( e ) => {
      e.preventDefault();
   });

   //desktop
   slide.addEventListener( 'mousedown', dragStart.bind( null, i ) );
   slide.addEventListener( 'mouseup', dragStop );
   slide.addEventListener( 'mouseleave', dragStop );
   slide.addEventListener( 'mousemove', dragMove );

   //mobile
   slide.addEventListener( 'touchstart',  dragStart.bind( null, i ) );
   slide.addEventListener( 'touchend', dragStop );
   slide.addEventListener( 'touchmove', dragMove );   
});

function dragStart( i: any, e: MouseEvent | TouchEvent )  {
   isDragging = true;
   currentIndex = i;
   // console.log( e.type );

   const position = getPosition( e );
   console.log( position );
   startPos = position

   animationID = requestAnimationFrame( slideanimation );
};

function dragStop( e: Event )  {
   isDragging = false;
   cancelAnimationFrame( animationID );
};

function dragMove( e: MouseEvent | TouchEvent )  {
   if( !isDragging ) return;
   
   const currentPosition = getPosition( e );
   currentTranslate = prevTranslate + currentPosition - startPos;
   console.log( currentPosition );
};

function slideanimation()  {
   sliderContainer.style.transform = `translateX(${currentTranslate}px)`;
   if( isDragging ) requestAnimationFrame( slideanimation );
}

function getPosition( e: MouseEvent | TouchEvent )  {
   return ( e instanceof MouseEvent ) ? e.clientX : e.touches[0].clientX;
}