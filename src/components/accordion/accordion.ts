///you can change prefix if you want to
const PREFIX = 'jsc',
      ACCORDIONSELECTOR = `[data-${PREFIX}-accCon]:not([data-${PREFIX}-accCon='false'])`,
      accordionCon = document.querySelectorAll(ACCORDIONSELECTOR) as NodeListOf<HTMLElement>;
/**
 * TO DO
 * add A11y
 * create function or class to create new accordion
 * think about if multiple target can be allowed
 */
accordionCon.forEach( item => {
   ///if initial state not provided of the accrodion container
	if( item.dataset.collapse === undefined || item.dataset.collapse === '' ) item.setAttribute( `data-collapse`, 'true' );

   ///check to see if default accrodion collapse data is false or otherwise 
   ///collapse default data value can be anything
   ///if it's false then the accrodion is expended otherwise collapsed
	const isCollapse = item.dataset.collapse === 'false' ? false : true;
   const accAnimationTime = +window.getComputedStyle( item ).getPropertyValue('transition-duration').replace( /s/, '' ) * 1000;

   ///initialize container
   if( isCollapse ) item.style.display = 'none';

   ///adding collapse class to all the triggerer
   item.id?.split( ' ' ).map( id => {
      if( id === '' ) return;

      const el = document.querySelector( `[data-${PREFIX}-target="${id}"]` ) as HTMLElement;

      if( !el )  return;

      let text: undefined | string = undefined;

      isCollapse && ( text = el.dataset.acccollapsetext ) && ( el.setAttribute( 'aria-expanded', 'false' ) );
      !isCollapse && ( text = el.dataset.accexpendtext ) && ( el.setAttribute( 'aria-expanded', 'true' ) );

      text !== undefined && ( el.innerText = text );

      if( isCollapse ) el.classList.add( 'collapsed' );
   });
});

///Event Bubbling for Accordion triggerer
document.body.addEventListener( 'click', function( e )  {
	const target = e.target as HTMLElement;
   let acID: any = undefined;

   if( acID = target.dataset[`${PREFIX}Target`] ) {
      const accordion = ( document.querySelector( `${ACCORDIONSELECTOR}#${acID}` ) as HTMLElement );

      if( !accordion ) return;

      ///is container collapsed
      const isCollapse = accordion.dataset.collapse === 'true' ? true : false;
      const accAnimationTime = +window.getComputedStyle( accordion ).getPropertyValue('transition-duration').replace( /s/, '' ) * 1000;

      if( isCollapse )  {
         //it will change the whatever display the element has before
         accordion.style.display = '';
    
         ///to get the full height of the element
         accordion.style.height = 'auto';
    
         ///not using this method for now might be using this in future
         // accordion.setAttribute('style', 'height:auto !important');
    
         ///save the height of futher use
         const acHeight = accordion.offsetHeight;
    
         ///immediately change the element height to 0
         accordion.style.height = '0';
    
         ///wait just a little bit for animation to work properly
         setTimeout( () => {
            accordion.style.height = acHeight + 'px';
         }, 0 );

         ///after animation change inline height to nothing
         setTimeout( () => {
            accordion.style.height = '';
         }, accAnimationTime );
    
         accordion.dataset.collapse = 'false';
    
      } else if( !isCollapse )  {
         ///save the height of futher use
         const acHeight = accordion.offsetHeight;

         accordion.style.height = acHeight + 'px';

         setTimeout( () => {
            accordion.style.height = '0';
         }, 0 );

         setTimeout( () => {
            accordion.style.display = 'none';
         }, accAnimationTime );

         accordion.dataset.collapse = 'true';
      };

      let text: undefined | string = undefined;

      if( isCollapse && ( text = target.dataset.accexpendtext ) )  {
         target.setAttribute( 'aria-expanded', 'true');
         target.classList.remove( 'collapsed' );
      }

      if( !isCollapse && ( text = target.dataset.acccollapsetext ) ) {
         target.setAttribute( 'aria-expanded', 'false');
         target.classList.add( 'collapsed' );
      }

      text !== undefined && ( target.innerText = text );
   }
});