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
       * TODO
       * might use bubbling for this for performance
       */
      triggerBtns.map( btn => {
         document.querySelector( btn )?.addEventListener( 'click', function( e:Event )  {
            e.preventDefault();
            const btn = e.target as HTMLButtonElement;

            ///expend and collapse text
            const collapseText = btn.dataset?.acccollapsetext;
            const expendText = btn.dataset?.accexpendtext;

            if( item.dataset.collapse === 'false' )  {
               item.style.height = '0';

               setTimeout( () => {
                  item.style.display = 'none';
               }, accAnimationTime );

               item.dataset.collapse = 'true';

               //add collapse text
               if( collapseText ) {
                  btn.textContent = collapseText;
               }

            } else if( item.dataset.collapse === 'true' )  {
               //it will change the whatever display the element has before
               item.style.display = '';

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

               //add collapse text
               if( expendText ) {
                  btn.textContent = expendText;
               }
            }
         });
      });
   }
});

///TODO add event bubbling if it's not too complicated
// document.body.addEventListener( 'click', function( e )  {
//    console.log( e );
// });