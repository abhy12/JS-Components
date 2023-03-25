import { PREFIX, ACCORDIONSELECTOR } from "./utilities";
export let toggleTimeoutId: ReturnType<typeof setTimeout>;

export function accordionToggle( accordion: HTMLElement )  {
   ///whether container is collapsed
   let isCollapse = accordion.dataset.collapse === 'true' ? true : false;
   ///adding 60ms more for transition bug
   const transitionTime = 300 + 60;
   ///save the height of futher use
   let acHeight = accordion.offsetHeight;

   if( accordion.classList.contains( 'colexping' ) ) return
   ///add a class to accordion
   accordion.classList.add( 'colexping' );

   ///just a measure for unkown transition bugs won't happen
   ///when previous setTimeout is not happend already
   ///see below setTimeout for more
   clearTimeout( toggleTimeoutId );

   ///deducting 60ms for transition bug
   accordion.style.transition = `height ${transitionTime - 60}ms ease-in-out`;
   toggleTimeoutId = setTimeout( () => {
      accordion.style.transition = '';
   },
   transitionTime );

   if( isCollapse )  {
      //it will change the whatever display the element has before
      accordion.style.display = '';

      ///to get the full height of the element
      accordion.style.height = 'auto';

      ///not using this method for now might be using this in future
      // accordion.setAttribute('style', 'height:auto !important');

      ///update the height because if accordion is collapsed
      ///previous value has to be 0 and we need the current height
      ///of the accordion for further use
      acHeight = accordion.offsetHeight;

      ///immediately change the element height to 0
      accordion.style.height = '0';

      ///wait just a little bit for animation to work properly
      setTimeout( () =>  {
         accordion.style.height = acHeight + 'px';
      }, 0 );

      ///after animation change inline height to nothing
      setTimeout( () =>  {
         accordion.style.height = '';
         accordion.classList.remove( 'colexping' );
      }, transitionTime );

      accordion.dataset.collapse = 'false';

      isCollapse = false;

   } else if( !isCollapse )  {

      accordion.style.height = acHeight + 'px';

      setTimeout( () =>  {
         accordion.style.height = '0';
      }, 5 );

      setTimeout( () =>  {
         accordion.style.display = 'none';
         accordion.style.height = '';
         accordion.classList.remove( 'colexping' );
      }, transitionTime );

      accordion.dataset.collapse = 'true';

      isCollapse = true;
   }

   const triggerer = document.querySelectorAll( `[data-${PREFIX}-target="${accordion.id}"]` ) as NodeListOf<HTMLElement>;

   triggerer.forEach( ( el: HTMLElement ) =>  {

      let text: undefined | string = undefined;

      if( isCollapse )  {
         text = el.dataset.collapsetext;
         el.setAttribute( 'aria-expanded', 'false' );
         el.classList.add( 'collapsed' );
      }

      if( !isCollapse )  {
         text = el.dataset.expendtext
         el.setAttribute( 'aria-expanded', 'true' );
         el.classList.remove( 'collapsed' );
      }

      text !== undefined && ( el.innerText = text );
   });
}


export function accordionToggleEventHandler( e: Event )  {
   if( !( e.target instanceof HTMLElement ) )  return

   ///find the closest accordion trigger
   ///so if button has some nested element(s) it will find the trigger
   const trigger = e.target.closest( `[data-${PREFIX}-target]` );

   ///don't wanna repeate it :(
   if( !( trigger instanceof HTMLElement ) )  return

   const accordionId: undefined | string = trigger.dataset[`${PREFIX}Target`];

   if( !accordionId )  return

   const accordion = ( document.querySelector( `${ACCORDIONSELECTOR}#${accordionId}` ) as HTMLElement );

   if( !accordion || accordion.getAttribute( `data-${PREFIX}-accCon` ) === 'false' || accordion.classList.contains( 'colexping' ) ) return

   accordionToggle( accordion );
}
