///you can change prefix if you want to
const PREFIX = 'jsc',
      ACCORDIONSELECTOR = `[data-${PREFIX}-accCon]:not([data-${PREFIX}-accCon='false'])`,
      accordionCon = document.querySelectorAll(ACCORDIONSELECTOR) as NodeListOf<HTMLElement>;
/**
 * TO DO
 * create function or class to create new accordion
 */
accordionCon.forEach( item => {
   const id = item.id;

   ///if initial state not provided of the accordion
	if( item.dataset.collapse === undefined || 
      ( item.dataset.collapse !== 'false' && item.dataset.collapse !== 'true' ) ) item.setAttribute( `data-collapse`, 'true' );
   
   ///not returning because it can be 
   if( id !== '' )  document.querySelector( `[data-${PREFIX}-target="${id}"]` )?.setAttribute( 'aria-controls', id );

   ///check to see if default accordion collapse data is false or otherwise 
   ///collapse default data value can be anything
   ///if it's false then the accordion is expended otherwise collapsed
	const isCollapse = item.dataset.collapse === 'false' ? false : true;

   ///initialize container
   if( isCollapse ) item.style.display = 'none';

   ///adding collapse class to all the triggerer
   const triggerer = document.querySelectorAll( `[data-${PREFIX}-target="${item.id}"]` ) as NodeListOf<HTMLElement>;

   triggerer.forEach( ( el: HTMLElement ) => {

      let text: undefined | string = undefined;

      isCollapse && ( text = el.dataset.acccollapsetext ) && ( el.setAttribute( 'aria-expanded', 'false' ) );
      !isCollapse && ( text = el.dataset.accexpendtext ) && ( el.setAttribute( 'aria-expanded', 'true' ) );

      text !== undefined && ( el.innerText = text );

      if( isCollapse && ( text = el.dataset.acccollapsetext ) ) {
         el.setAttribute( 'aria-expanded', 'false' );
         el.classList.add( 'collapsed' );
      }

      if( !isCollapse && ( text = el.dataset.accexpendtext ) )  {
         el.setAttribute( 'aria-expanded', 'true' );
         el.classList.remove( 'collapsed' );
      }
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
      let isCollapse = accordion.dataset.collapse === 'true' ? true : false;
      const accAnimationTime = +window.getComputedStyle( accordion ).getPropertyValue('transition-duration').replace( /s/, '' ) * 1000;
      let acHeight = accordion.offsetHeight;

      if( isCollapse )  {
         //it will change the whatever display the element has before
         accordion.style.display = '';
    
         ///to get the full height of the element
         accordion.style.height = 'auto';
    
         ///not using this method for now might be using this in future
         // accordion.setAttribute('style', 'height:auto !important');
    
         ///save the height of futher use
         acHeight = accordion.offsetHeight;
    
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
    
         isCollapse = false;

      } else if( !isCollapse )  {

         accordion.style.height = acHeight + 'px';

         setTimeout( () => {
            accordion.style.height = '0';
         }, 0 );

         setTimeout( () => {
            accordion.style.display = 'none';
            accordion.style.height = '';
         }, accAnimationTime );

         accordion.dataset.collapse = 'true';

         isCollapse = true;
      };

      const triggerer = document.querySelectorAll( `[data-${PREFIX}-target="${accordion.id}"]` ) as NodeListOf<HTMLElement>;

      triggerer.forEach( ( el: HTMLElement ) => {
   
         let text: undefined | string = undefined;
   
         if( isCollapse && ( text = el.dataset.acccollapsetext ) ) {
         el.setAttribute( 'aria-expanded', 'false' );
         el.classList.add( 'collapsed' );
         }

         if( !isCollapse && ( text = el.dataset.accexpendtext ) )  {
         el.setAttribute( 'aria-expanded', 'true' );
         el.classList.remove( 'collapsed' );
         }

         text !== undefined && ( el.innerText = text );
      });
   }
});