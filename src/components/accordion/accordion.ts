const accordionCon = document.querySelectorAll('[data-jsc-accCon]') as NodeListOf<HTMLElement>;

/**
 * TO DO
 * add A11y
 * create function or class to create new accordion
 */
accordionCon.forEach( item => {
   const accAnimationTime = +window.getComputedStyle( item ).getPropertyValue('transition-duration').replace( /[s]/, '' ) * 1000;
   // console.log( accAnimationTime );

   ///initailze container
   if( item.dataset.collapse === 'true' )  {
      item.style.height = '0';
      item.style.display = 'none';
   } else if( item.dataset.collapse === 'false' ) {
      item.style.height = item.offsetHeight + 'px';
   }

   ///get the triggerers 
   const triggerBtns = item.dataset?.target?.split( ',' );

   ///check if any triggerers found
   if( triggerBtns && triggerBtns.length > 1 )  {

      ///add event listner to triggerer
      /**
       * TO DO
       * might use bubbling for this for performance
       */
      triggerBtns.map( btn => {
         document.querySelector( btn )?.addEventListener( 'click', function( e )  {
            e.preventDefault();
            
            if( item.dataset.collapse === 'false' )  {
               item.style.height = '0';

               setTimeout( () => {
                  item.style.display = 'none';
               },  accAnimationTime );

               item.dataset.collapse = 'true';

            } else if( item.dataset.collapse === 'true' )  {
               item.style.display = 'block';

               ///to get the full height of the element
               item.style.height = 'auto';

               ///not using this method for now might be using this in future
               // item.setAttribute('style', 'height:inline !important');

               ///save the height of futher use
               const acHeight = item.offsetHeight;

               ///immediately change the element height to 0
               item.style.height = '0';

               ///wait just a little bit for animation to work properly
               setTimeout( () => {
                  item.style.height = acHeight + 'px';
               }, 0);

               item.dataset.collapse = 'false';
            }
         });
      });
   }
});