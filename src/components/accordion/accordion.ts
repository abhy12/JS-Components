///you can change prefix if you want to
const PREFIX = 'jsc',
      ISACCORDION = `[data-${PREFIX}-accCon='true']`,
      accordionCon = document.querySelectorAll(`[data-${PREFIX}-accCon='true']`) as NodeListOf<HTMLElement>;
/**
 * TO DO
 * add A11y
 * create function or class to create new accordion
 */
accordionCon.forEach( item => {
   const accAnimationTime = +window.getComputedStyle( item ).getPropertyValue('transition-duration').replace( /s/, '' ) * 1000;
   // console.log( accAnimationTime );

   ///if initial state not provided of the accrodion container
	if( item.dataset.collapse === undefined )  item.setAttribute( `data-collapse`, 'false' );

   ///check to see is container collapse
	const isCollapse = item.dataset.collapse === 'true' ? true : false;

   ///initialize container
   if( isCollapse )  {
      item.style.height = '0';
      item.style.display = 'none';
   } else if( !isCollapse ) {
      item.style.height = item.offsetHeight + 'px';
   }

   ///get the triggerers 
   const triggerBtns = item.dataset.targetbtn?.split( ',' );

   ///check if any triggerers found
   if( triggerBtns && triggerBtns.length > 0 )  {

      ///add event listner to triggerer
      /**
       * TODO
       * might use bubbling for this for performance
       */
      // triggerBtns.map( btn => {
		// 	const btnEl = document.querySelector( btn ) as HTMLButtonElement;
		// 	if( !btnEl ) return;
			
		// 	///expend and collapse text
		// 	const collapseText = btnEl.dataset?.acccollapsetext;
		// 	const expendText = btnEl.dataset?.accexpendtext;

		// 	///change the expend or collapse text
		// 	if( isCollapse && expendText )  {
		// 		btnEl.textContent = expendText;
		// 	} else if( !isCollapse && collapseText )  {
		// 		btnEl.textContent = collapseText;
		// 	}

      //    btnEl.addEventListener( 'click', function( e:Event )  {
      //       e.preventDefault();
      //       const btn = e.target as HTMLButtonElement;

      //       ///check to see is container collapse
		// 		const isCollapse = item.dataset.collapse === 'true' ? true : false;

      //       if( !isCollapse )  {
      //          item.style.height = '0';

      //          setTimeout( () => {
      //             item.style.display = 'none';
      //          }, accAnimationTime );

      //          item.dataset.collapse = 'true';

      //          //add collapse text
      //          if( expendText ) btn.textContent = expendText;

      //       } else if( isCollapse )  {
      //          //it will change the whatever display the element has before
      //          item.style.display = '';

      //          ///to get the full height of the element
      //          // item.style.height = 'auto';

      //          ///not using this method for now might be using this in future
      //          item.setAttribute('style', 'height:auto !important');

      //          ///save the height of futher use
      //          const acHeight = item.offsetHeight;

      //          ///immediately change the element height to 0
      //          item.style.height = '0';

      //          ///wait just a little bit for animation to work properly
      //          setTimeout( () => {
      //             item.style.height = acHeight + 'px';
      //          }, 0);

      //          item.dataset.collapse = 'false';

      //          //add collapse text
      //          if( collapseText ) btn.textContent = collapseText;

      //       }
      //    });
      // });
   }
});

///TODO add event bubbling if it's not too complicated
document.body.addEventListener( 'click', function( e )  {
	const target = e.target as HTMLElement;
   
	if( target.id === '' ) return;
      
	target.id.split( ' ' ).map( att => {
      let accordion: any = null;
      ///not breaking the loop beause assuming target has 
      ///multiple accordion targeted to

      ///TODO some tasks are repetitive in loop fix that
      if( accordion = ( document.querySelector(`[data-targetBtn*='#${att}']${ISACCORDION}`) as HTMLElement ) )  {
         ///check to see is container collapse
			const isCollapse = accordion.dataset.collapse === 'true' ? true : false;
         const accAnimationTime = +window.getComputedStyle( accordion ).getPropertyValue('transition-duration').replace( /s/, '' ) * 1000;

         ///expend and collapse text
			const collapseText = target.dataset?.acccollapsetext;
			const expendText = target.dataset?.accexpendtext;

         ///change the expend or collapse text
			if( isCollapse && expendText )  {
				target.textContent = expendText;
			} else if( !isCollapse && collapseText )  {
				target.textContent = collapseText;
			}

         if( !isCollapse )  {
            accordion.style.height = '0';

            setTimeout( () => {
               accordion.style.display = 'none';
            }, accAnimationTime );

            accordion.dataset.collapse = 'true';

            //add collapse text
            if( expendText ) target.textContent = expendText;

         } else if( isCollapse )  {
            //it will change the whatever display the element has before
            accordion.style.display = '';

            ///to get the full height of the element
            // accordion.style.height = 'auto';

            ///not using this method for now might be using this in future
            accordion.setAttribute('style', 'height:auto !important');

            ///save the height of futher use
            const acHeight = accordion.offsetHeight;

            ///immediately change the element height to 0
            accordion.style.height = '0';

            ///wait just a little bit for animation to work properly
            setTimeout( () => {
               accordion.style.height = acHeight + 'px';
            }, 0);

            accordion.dataset.collapse = 'false';

            //add collapse text
            if( collapseText ) target.textContent = collapseText;

         }
      };
	});

	}
);