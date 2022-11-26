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
   ///collapse default data value can be anything
	const isCollapse = item.dataset.collapse === 'true' ? true : false;

   ///initialize container
   if( isCollapse )  {
      item.style.height = '0';
      item.style.display = 'none';
      item.classList.add( 'hidden' );
   } else if( !isCollapse ) {
      item.style.height = item.offsetHeight + 'px';
      item.classList.remove( 'hidden' );
   }

   ///adding collapse class to all the triggerer
   item.dataset.targetbtn?.split( ',' ).map( id => {
      const el = document.getElementById( id.replace( /^#/, '' ) ) as HTMLElement;

      if( !el )  return;

      let text: undefined | string = undefined;

      isCollapse && ( text = el.dataset.acccollapsetext );
      !isCollapse && ( text = el.dataset.accexpendtext );

      text !== undefined && ( el.innerText = text );

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
      if( !accordion )  return;
   }

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
     }, 0);

     accordion.dataset.collapse = 'false';
     accordion.classList.remove( 'hidden' );
   } else if( !isCollapse )  {

      accordion.style.height = '0';

      setTimeout( () => {
         accordion.style.display = 'none';
      }, accAnimationTime );

      accordion.dataset.collapse = 'true';
      accordion.classList.add( 'hidden' );      
   };

   //change collapse text of all triggerer if they have one
   accordion.dataset.targetbtn?.split( ',' ).map( ( id: string ) => {
      const el = document.getElementById( id.replace( /^#/, '' ) ) as HTMLElement;
      if( !el )  return;

      let text: undefined | string = undefined;

      if( isCollapse && ( text = el.dataset.accexpendtext ) )  el.classList.remove( 'collapsed' );
      if( !isCollapse && ( text = el.dataset.acccollapsetext ) ) el.classList.add( 'collapsed' );

      text !== undefined && ( el.innerText = text );
   });
});