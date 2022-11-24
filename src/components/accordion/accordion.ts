///you can change prefix if you want to
const PREFIX = 'jsc',
      ACCORDIONSELECTOR = `[data-${PREFIX}-accCon='true']`,
      accordionCon = document.querySelectorAll(ACCORDIONSELECTOR) as NodeListOf<HTMLElement>;
/**
 * TO DO
 * add A11y
 * create function or class to create new accordion
 */
accordionCon.forEach( item => {
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
 
   item.dataset.targetbtn?.split( ',' ).map( id => {
      const el = document.querySelector( id ) as HTMLElement;

      if( !el )  return;

      if( isCollapse ) el.classList.add( 'collapsed' );
   });

});

///Event Bubbling for Accordion triggerer
document.body.addEventListener( 'click', function( e )  {
	const target = e.target as HTMLElement;
   
   // console.log( target.dataset );
   let accordion: any = null;

   if( target.dataset.accclose !== undefined ) accordion = target.closest( ACCORDIONSELECTOR );

   if( accordion === null )  {
      if( target.id === '' )  return;
      accordion = ( document.querySelector(`[data-targetBtn*='#${target.id}']${ACCORDIONSELECTOR}`) as HTMLElement );
   }

   ///is container collapsed
   const isCollapse = accordion.dataset.collapse === 'true' ? true : false;
   const accAnimationTime = +window.getComputedStyle( accordion ).getPropertyValue('transition-duration').replace( /s/, '' ) * 1000;

   ///expend and collapse text
   const collapseText = target.dataset?.acccollapsetext;
   const expendText = target.dataset?.accexpendtext;

   ///TODO below expression is bit a redundant will change later i have something in mind
   ///TODO if triggerer is inside close btn and is clicked then the other button which has
   ///collapse or expend text will not work fix that or think about if this good option to do that ( P.S so many things going in my head comment can hard to uderstand )
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

      ///add collapsed css class to triggerer
      ///might have some weird effect when multiple accrodion 
      ///has same target
      target.classList.add( 'collapsed' );

      //add collapse text
      if( expendText ) target.textContent = expendText;

   } else if( isCollapse )  {
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
      }, 0);

      accordion.dataset.collapse = 'false';

      target.classList.remove( 'collapsed' );

      //add collapse text
      if( collapseText ) target.textContent = collapseText;
   };
});