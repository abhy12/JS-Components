import { PREFIX, COLLAPSE_ATTR, ACCORDION_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR, TRIGGER_ATTR, TRIGGER_SELECTOR, SELECT_TRIGGER_ACCORDION, isAccordionCollapsed, getRelativeAccordions, isAccordionsTransitioning, beforeAccordionTransition, afterAccordionTransitionFinish, TOGGLE_TYPE_ATTR, CONTAINER_SELECTOR, EXPENDED_CSS_CLASS, COLLAPSED_CSS_CLASS } from "./core";

export function initTrigger( trigger: HTMLElement, targetId: string, collapsed: boolean )  {
   trigger.setAttribute( TRIGGER_ATTR, targetId );
   trigger.setAttribute( 'aria-expanded', `${!collapsed}` );
   trigger.setAttribute( 'aria-controls', targetId );
   trigger.classList.add( collapsed ? COLLAPSED_CSS_CLASS : EXPENDED_CSS_CLASS );

   if( collapsed ) trigger.classList.add( 'collapsed' );
}

/**
 * get all the triggers relative to the accordion's wrapper but not inside nested wrapper
 */
export function getClosestTriggers( wrapperEl: HTMLElement, wrapperSelector: string = ACCORDION_ITEM_WRAPPER_SELECTOR, triggerSelector: string = TRIGGER_SELECTOR ): HTMLElement[] {
   let triggers: HTMLElement[] = Array.from( wrapperEl.querySelectorAll( triggerSelector ) );

   ///filter only those triggers which in an accordion wrapper not in nested wrapper
   triggers = triggers.filter( trigger => trigger.closest( wrapperSelector ) === wrapperEl );

   return triggers
}

///get closest triggers inside accordion item container and all over the DOM
export function getAllAssociateTriggers( accordion: HTMLElement, wrapperEl: HTMLElement, wrapperSelector: string = ACCORDION_ITEM_WRAPPER_SELECTOR, triggerSelector: string = TRIGGER_SELECTOR ): HTMLElement[] {
   const closestTriggers = getClosestTriggers( wrapperEl, wrapperSelector, triggerSelector );
   const associateTriggers = document.querySelectorAll( SELECT_TRIGGER_ACCORDION( accordion.id ) ) as NodeListOf<HTMLElement>;
   let triggers:HTMLElement[] = [];

   if( closestTriggers )  {
      closestTriggers.forEach( trigger => triggers.push( trigger ) );
   }

   if( associateTriggers.length > 0 )  {
      associateTriggers.forEach( trigger => triggers.push( trigger ) );
   }

   return triggers;
}

export function collapseAccordion( accordion: HTMLElement )  {
   let accordionHeight = accordion.getBoundingClientRect().height;

   beforeAccordionTransition( accordion );

   ///set height for transition
   accordion.style.height = accordionHeight + 'px';

   setTimeout( () =>  {
      accordion.style.height = '0';
   }, 5 );

   afterAccordionTransitionFinish( accordion, () => {
      accordion.style.display = 'none';
   });


   const wrapper = accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR );
   if( wrapper ) {
      wrapper.classList.add( COLLAPSED_CSS_CLASS );
      wrapper.classList.remove( EXPENDED_CSS_CLASS );
   }

   accordion.setAttribute( COLLAPSE_ATTR, "true" );

   updateTriggers( accordion.id, true );
}

export function expendAccordion( accordion: HTMLElement )  {
   let accordionHeight = accordion.getBoundingClientRect().height;

   beforeAccordionTransition( accordion );

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

   afterAccordionTransitionFinish( accordion );

   const wrapper = accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR );
   if( wrapper ) {
      wrapper.classList.add( EXPENDED_CSS_CLASS );
      wrapper.classList.remove( COLLAPSED_CSS_CLASS );
   }

   accordion.setAttribute( COLLAPSE_ATTR, "false" );

   updateTriggers( accordion.id, false );
}

export function toggleAccordion( accordion: HTMLElement )  {
   ///any relative accordions are collapsing or expending don't toggle any accordion
   if( isAccordionsTransitioning( accordion ) )  return

   let isCollapsed = isAccordionCollapsed( accordion );
   const toggleType = accordion.closest( CONTAINER_SELECTOR )?.getAttribute( TOGGLE_TYPE_ATTR ) === "toggle" ? "toggle" : "accordion";

   if( isCollapsed )  {
      expendAccordion( accordion );
   }
   else if( isCollapsed === false )  {
      collapseAccordion( accordion );
   }

   if( toggleType === "accordion" && isCollapsed )  {
      const relativeAccordions = getRelativeAccordions( accordion );
      if( relativeAccordions )  {
         for( let i = 0; i < relativeAccordions.length; i++ )  {
            if( relativeAccordions[i] === accordion )  continue

            ///collapse whichever accordion is expended
            if( !isAccordionCollapsed( relativeAccordions[i] ) )  {
               collapseAccordion( relativeAccordions[i] );
               ///breaking this because only one accordion can be expended at time
               ///so it's a good idea to break the loop
               break
            }
         }
      }
   }
}

export function updateTriggers( accordionId: string, isAccordionCollapsed: boolean )  {
   const triggers = document.querySelectorAll( SELECT_TRIGGER_ACCORDION( accordionId ) );

   triggers.forEach( ( trigger ) => {
      if( isAccordionCollapsed ) {
         trigger.setAttribute( 'aria-expanded', 'false' );
         trigger.classList.add( COLLAPSED_CSS_CLASS );
         trigger.classList.remove( EXPENDED_CSS_CLASS );
      }

      if( !isAccordionCollapsed ) {
         trigger.setAttribute( 'aria-expanded', 'true' );
         trigger.classList.remove( COLLAPSED_CSS_CLASS );
         trigger.classList.add( EXPENDED_CSS_CLASS );
      }
   });
}

export function accordionToggleEventHandler( e: Event )  {
   if( !( e.target instanceof HTMLElement ) )  return

   ///find the closest accordion trigger
   ///so if button has some nested element(s) it will find the trigger
   const trigger = e.target.closest( TRIGGER_SELECTOR );

   ///don't wanna repeate it :(
   if( !( trigger instanceof HTMLElement ) )  return

   const accordionId: null | string = trigger.getAttribute( TRIGGER_ATTR );

   if( !accordionId )  return

   const accordion = document.querySelector( `${ACCORDION_SELECTOR}#${accordionId}` );

   if( !( accordion instanceof HTMLElement ) || isAccordionsTransitioning( accordion ) )  return

   toggleAccordion( accordion );
}
