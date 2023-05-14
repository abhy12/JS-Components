import { assignNewUniqueIdToElement } from "./utilities";

///// CORE /////
export const PREFIX: string = "jsc";
export const EXTRA_TIME_FOR_TRANSITION = 60; //ms
export const TRANSITION_TIME = 300 + EXTRA_TIME_FOR_TRANSITION; //ms
export const TRANSITION_STATE_CLASSNAME = 'colexping';

//// ATTRIBUTE AND SELECTOR /////
export const DEP_ACCORDION_SELECTOR: string = `[data-${PREFIX}-acccon]`; ///@deprecated
export const CONTAINER_ATTR: string = `data-${PREFIX}-accordion-container`;
export const CONTAINER_SELECTOR: string = `[${CONTAINER_ATTR}]`;
export const ACCORDION_ITEM_WRAPPER_ATTR: string = `data-${PREFIX}-accordion-item`;
export const ACCORDION_ITEM_WRAPPER_SELECTOR: string = `[${ACCORDION_ITEM_WRAPPER_ATTR}]`;
export const ACCORDION_ATTR: string = `data-${PREFIX}-accordion`;
export const ACCORDION_SELECTOR: string = `[${ACCORDION_ATTR}]`;
export const TRIGGER_ATTR: string = `data-${PREFIX}-target`;
export const TRIGGER_SELECTOR: string = `[${TRIGGER_ATTR}]`;
export const COLLAPSE_ATTR: string = "data-collapse";
export const TOGGLE_TYPE_ATTR = `data-accordion-${PREFIX}-type`;

export function SELECT_TRIGGER_ACCORDION( selector: string ): string  {
   return `[${TRIGGER_ATTR}="${selector}"]`;
}

export function initAccordion( accordion: HTMLElement, initCollapse: boolean = true )  {
   ///user can overwrite this with "important" css rule
   accordion.style.overflow = "hidden";

   ///set new id if the container don't have one
   ///for assigning this id to trigger target
   if( accordion.id === '' )  {
      assignNewUniqueIdToElement( accordion );
   }

   ///if accordion has this attribute and it's set to false then don't need to do anything
   ///accordion still be initilized but it will not work, user will have to use
   ///method "enable" or setting it's attribute value to anything other than 'false'.
   if( accordion.getAttribute( ACCORDION_ATTR ) !== "false" )  {
      ///doing this because if any developer will see this attribute in a DOM
      ///they will be curious that what will the "false" will do
      accordion.setAttribute( ACCORDION_ATTR, "true" );
   }

   accordion.setAttribute( "data-collapse", initCollapse + "" );

   ///hide the element if initial collapse is true
   if( initCollapse )  accordion.style.display = "none";
}

export function getRelativeAccordions( accordion: HTMLElement ): NodeListOf<HTMLElement> | null  {
   ///find closest container
   const accordionClosesetContainer = accordion.closest( CONTAINER_SELECTOR ) as HTMLElement | null;

   if( accordionClosesetContainer )  {
      return accordionClosesetContainer.querySelectorAll( `:scope > ${ACCORDION_ITEM_WRAPPER_SELECTOR} > ${ACCORDION_SELECTOR}` );
   } else {
      return null
   }
}

/**
 * returns true or false whether accordion is collapsed or not
 */
export function isAccordionCollapsed( accordion: HTMLElement ): boolean  {
   return accordion.dataset.collapse === 'true' ? true : false;
}

export function beforeAccordionTransition( accordion: HTMLElement, callBackFunc?: Function )  {
   if( typeof callBackFunc === 'function' )  callBackFunc();

   ///add a class to accordion to let the "state" know that it's transitioning
   accordion.classList.add( TRANSITION_STATE_CLASSNAME );

   ///deducting for transition bug
   accordion.style.transition = `height ${TRANSITION_TIME - EXTRA_TIME_FOR_TRANSITION}ms ease-in-out`;
}

export function afterAccordionTransitionFinish( accordion: HTMLElement, callBackFunc?: Function )  {
   setTimeout( () =>  {
      if( typeof callBackFunc === 'function' )  callBackFunc();
      accordion.style.transition = '';
      accordion.style.height = '';
      accordion.classList.remove( TRANSITION_STATE_CLASSNAME );
   }, TRANSITION_TIME );
}

export function isAccordionsTransitioning( accordion: HTMLElement ): boolean  {
   const relativeAccordions = getRelativeAccordions( accordion );
   if( relativeAccordions )  {
      for( let i = 0; i < relativeAccordions.length; i++ )  {
         if( relativeAccordions[i].classList.contains( TRANSITION_STATE_CLASSNAME ) )  return true
      }
   }

   return false
}
