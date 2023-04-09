import { PREFIX, ACCORDIONSELECTOR } from "./core";

let toggleTimeoutId: ReturnType<typeof setTimeout>;

export function accordionToggle( accordion: HTMLElement )  {
   ///whether container is collapsed
   let isCollapsed = accordion.dataset.collapse === 'true' ? true : false;
   let accordionHeight = accordion.getBoundingClientRect().height;
   ///adding 60ms more for transition bug
   const transitionTime = 300 + 60;

   ///accordion contains "colexping" class that means it's still
   ///transitioning so don't need to do anything
   if( accordion.classList.contains( 'colexping' ) )  return

   ///add a class to accordion to let the "state" know that it's transitioning
   accordion.classList.add( 'colexping' );

   ///just a measure for unkown transition bugs won't happen
   ///when previous setTimeout is not happend already
   ///see below setTimeout for more
   clearTimeout( toggleTimeoutId );

   ///deducting 60ms for transition bug
   accordion.style.transition = `height ${transitionTime - 60}ms ease-in-out`;

   toggleTimeoutId = setTimeout( () =>  {
      accordion.style.transition = '';
   }, transitionTime );

   if( isCollapsed )  {
      //it will change the whatever display the element has before
      accordion.style.display = '';

      ///to get the full height of the element
      accordion.style.height = 'auto';

      ///not using this method for now might be using this in future
      // accordion.setAttribute('style', 'height:auto !important');

      ///update the height because if accordion is collapsed
      ///previous value has to be 0 and we need the current height
      ///of the accordion for further use
      accordionHeight = accordion.getBoundingClientRect().height;

      ///immediately change the element height to 0
      accordion.style.height = '0';

      ///wait just a little bit for animation to work properly
      setTimeout( () =>  {
         accordion.style.height = accordionHeight + 'px';
      }, 0 );

      ///after animation change inline height to nothing
      setTimeout( () =>  {
         accordion.style.height = '';
         accordion.classList.remove( 'colexping' );
      }, transitionTime );

      accordion.dataset.collapse = 'false';
      isCollapsed = false;

   } else if( !isCollapsed )  {
      ///set height for transition
      accordion.style.height = accordionHeight + 'px';

      setTimeout( () =>  {
         accordion.style.height = '0';
      }, 5 );

      setTimeout( () =>  {
         accordion.style.display = 'none';
         accordion.style.height = '';
         accordion.classList.remove( 'colexping' );
      }, transitionTime );

      accordion.dataset.collapse = 'true';
      isCollapsed = true;
   }

   updateTriggers( accordion.id, isCollapsed );
}

export function updateTriggers( accordionId: string, isAccordionCollapsed: boolean )  {
   const triggers = document.querySelectorAll( `[data-${PREFIX}-target="${accordionId}"]` ) as NodeListOf<HTMLElement>;

   triggers.forEach( ( trigger: HTMLElement ) =>  {
      let collapseOrExpendText: undefined | string = undefined;

      if( isAccordionCollapsed )  {
         collapseOrExpendText = trigger.dataset.collapsetext;
         trigger.setAttribute( 'aria-expanded', 'false' );
         trigger.classList.add( 'collapsed' );
      }

      if( !isAccordionCollapsed )  {
         collapseOrExpendText = trigger.dataset.expendtext
         trigger.setAttribute( 'aria-expanded', 'true' );
         trigger.classList.remove( 'collapsed' );
      }

      collapseOrExpendText !== undefined && ( trigger.innerText = collapseOrExpendText );
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

   if( trigger.dataset[`${PREFIX}Preventdefault`] !== "false" )  e.preventDefault();

   const accordion = document.querySelector( `${ACCORDIONSELECTOR}#${accordionId}` );

   if( !( accordion instanceof HTMLElement ) || accordion.getAttribute( `data-${PREFIX}-accCon` ) === 'false' || accordion.classList.contains( 'colexping' ) )  return

   accordionToggle( accordion );
}
