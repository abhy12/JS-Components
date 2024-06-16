import { assignNewUniqueIdToElement, isHTMLElement } from "./utilities";
import { findAccordionTriggers, initTrigger } from "./trigger";

///// CORE /////
export const PREFIX: string = "jsc";
export const EXTRA_TIME_FOR_TRANSITION = 60; //ms
export const TRANSITION_TIME = 300; //ms
export const TRANSITION_STATE_CLASSNAME = 'colexping';
export const INIT_CLASSNAME = `${PREFIX}-initialized`;

//// ATTRIBUTE AND SELECTOR /////
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
export const DURATION_ATTR = `data-${PREFIX}-duration`;
export const DURATION_CSS_VAR = `--${PREFIX}-ac-duration`;
export const EXPENDED_CSS_CLASS = 'expended';
export const COLLAPSED_CSS_CLASS = 'collapsed';
export const DATA_WRAPPER_SELECTOR_ATTR = `data-${PREFIX}-wrapper-selector`;
export const DATA_ACCORDION_SELECTOR_ATTR = `data-${PREFIX}-accordion-selector`;
export const DATA_TRIGGER_SELECTOR_ATTR = `data-${PREFIX}-trigger-selector`;

export function isContainer( element: Element ) {
   return element.getAttribute( CONTAINER_ATTR ) !== null
}

export function SELECT_TRIGGER_ACCORDION( selector: string ): string  {
   return `[${TRIGGER_ATTR}="${selector}"]`;
}

/**
 * @param wrapperEl - accordion wrapper element
 * @param wrapperSelector - wrapper css selector
 * @param accordionSelector - accordion css selector
 * @param triggerSelector - trigger css selector
 * @param collapsed - will accordion be collapsed or not (default: true)
 * @returns true if everything is good or false unless otherwise
 * @description it will init every accordions and triggers inside wrapper element
 */
export function initWrapper( wrapperEl: unknown, wrapperSelector: string, accordionSelector: string, triggerSelector: undefined | null | string = undefined, collapsed: boolean = true ): boolean {
   if( !isHTMLElement( wrapperEl ) ) return false

   const accordion = findAccordionInsideWrapper( wrapperEl, wrapperSelector, accordionSelector );

   if( !accordion ) return false

   ///accordion found then this element is an accordion wrapper
   wrapperEl.setAttribute( ACCORDION_ITEM_WRAPPER_ATTR, "true" );

   const triggers = findAccordionTriggers( triggerSelector, wrapperEl, wrapperSelector, accordion );

   ///it needs to done after selecting triggers, because below function
   // will set accordion ID if it doesn't have, it will effect selecting
   // proper triggers
   // TODO: test
   initAccordion( accordion, collapsed );

   triggers.forEach( trigger => {
      // checking accordion is truthy just because TS giving me some error
      if( accordion && accordion.id ) initTrigger( trigger, accordion.id, collapsed );
   });

   toggleActiveCSSClass( wrapperEl, collapsed );

   return true
}

export function initAccordion( accordion: HTMLElement, initCollapse: boolean = true )  {
   ///set new id if the container don't have one
   ///for assigning this id to trigger target
   if( accordion.id === '' )  {
      assignNewUniqueIdToElement( accordion );
   }

   ///if accordion has this attribute and it's set to false then don't need to do anything
   ///accordion still be initilized but it will not work, user will have to use
   ///method "enable" or setting it's attribute value to anything other than 'false'.
   if( accordion.getAttribute( ACCORDION_ATTR ) !== "false" )  {
      accordion.setAttribute( ACCORDION_ATTR, "true" );
   }

   accordion.setAttribute( "data-collapse", initCollapse + "" );

   ///hide the element if initial collapse is true
   if( initCollapse )  accordion.style.display = "none";
}

export function getContainer( accordion: HTMLElement ): HTMLElement | undefined {
   const container = accordion.closest( CONTAINER_SELECTOR );

   if( container instanceof HTMLElement ) return container

   return undefined
}

/**
 * @param wrapperEl - accordion wrapper element
 * @param wrapperSelector - wrapper css selector
 * @param accordionSelector - accordion css selector
 * @returns Accordion Element if found one
 * @description find accordion inside wrapper (not nested wrapper)
 */
export function findAccordionInsideWrapper( wrapperEl: HTMLElement, wrapperSelector: string, accordionSelector: string = ACCORDION_SELECTOR ): null | HTMLElement {
   const accordion = wrapperEl.querySelector( accordionSelector );

   if( isHTMLElement( accordion ) ) {
      const closestWrapper = accordion.closest( wrapperSelector );
      if( closestWrapper === wrapperEl ) return accordion
   }

   return null
}

/**
 * @param container - accordions container
 * @returns wrapper css selector
 * @description it will get wrapper selector string from container data attribute,
 * the attribute has set when new instance of accordion was created
 */
export function getWrapperSelector( container: HTMLElement ): string {
   const selector = container.getAttribute( DATA_WRAPPER_SELECTOR_ATTR );
   return selector ? selector : ACCORDION_ITEM_WRAPPER_SELECTOR
}

/**
 * @param container - accordions container
 * @returns accordon css selector
 * @description it will get accordion selector string from container data attribute,
 * the attribute has set when new instance of accordion was created
 */
export function getAccordionSelector( container: HTMLElement ): string {
   const selector = container.getAttribute( DATA_ACCORDION_SELECTOR_ATTR );
   return selector ? selector : ACCORDION_ATTR
}

/**
 * @param container - accordions container
 * @returns trigger css selector
 * @description it will get trigger selector string from container data attribute,
 * the attribute has set when new instance of accordion was created
 */
export function getTriggerSelector( container: HTMLElement ): string {
   const selector = container.getAttribute( DATA_TRIGGER_SELECTOR_ATTR );
   return selector ? selector : TRIGGER_SELECTOR
}

export function getTransitionDuration( container: HTMLElement ): number | undefined {
   let duration;

   if( container ) {
      const containerDuration = container.getAttribute( DURATION_ATTR );

      if( containerDuration !== null && typeof +containerDuration === "number" && +containerDuration > 0 ) {
         duration = +containerDuration;
      }
   }

   return duration;
}

export function getRelativeAccordions( accordion: HTMLElement ): HTMLElement[] | null  {
   const closestContainer = accordion.closest( CONTAINER_SELECTOR ) as HTMLElement | null;

   if( closestContainer ) {
      let parent = accordion.parentElement;

      // try to find closest wrapper
      while( parent?.getAttribute( ACCORDION_ITEM_WRAPPER_ATTR ) === null && parent !== closestContainer ) {
         parent = parent.parentElement;
      }

      if( parent && parent.parentElement ) {
         const relativeAccordions: HTMLElement[] = [];
         const wrappers = parent.parentElement.querySelectorAll( `:scope > ${ACCORDION_ITEM_WRAPPER_SELECTOR}` );

         wrappers.forEach( wrapper => {
            const accordion = wrapper.querySelector( ACCORDION_SELECTOR );

            if( accordion && accordion instanceof HTMLElement && accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR ) === wrapper ) {
               relativeAccordions.push( accordion );
            }
         });

         return relativeAccordions
      }
   }

   return null
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

   let duration: number = TRANSITION_TIME;
   const container = getContainer( accordion );

   if( container ) {
      const containerDuration = getTransitionDuration( container );
      if( containerDuration ) duration = containerDuration;
   }

   accordion.style.transition = `height ${duration}ms ease-in-out`;
}

export function afterAccordionTransitionFinish( accordion: HTMLElement, callBackFunc?: Function )  {
   let duration: number = TRANSITION_TIME;
   const container = getContainer( accordion );

   if( container ) {
      const containerDuration = getTransitionDuration( container );
      if( containerDuration ) duration = containerDuration;
   }

   // adding extra time because sometimes accordion will not transition properly
   duration += EXTRA_TIME_FOR_TRANSITION;

   setTimeout( () =>  {
      if( typeof callBackFunc === 'function' )  callBackFunc();
      accordion.style.transition = '';
      accordion.style.height = '';
      accordion.classList.remove( TRANSITION_STATE_CLASSNAME );
   }, duration );
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

export function getAccordionType( element: HTMLElement ) {
   return element.closest( CONTAINER_SELECTOR )?.getAttribute( TOGGLE_TYPE_ATTR );
}

/**
 * @param accordionContainer - container element of accordion
 * @param position - number of the accordion from top
 * @returns HTMLElement | null whether if succeed or not
 * @description find accordion in the container from top position
 */
export function findAccordionWithPosition( accordionContainer: HTMLElement, position: number ) {
   if( Number.isInteger( position ) && position > 0 ) {
      const selectedAccordion = accordionContainer.querySelector( `${ACCORDION_ITEM_WRAPPER_SELECTOR}:nth-child(${position}) ${ACCORDION_SELECTOR}`);

      if( selectedAccordion && selectedAccordion instanceof HTMLElement ) {
         return selectedAccordion
      }
   }

   return null
}

/**
 * @param element - which element to toggle classes
 * @param isCollapsed - whether accordion is collapsed or not. (default true)
 * @description add collapse CSS class and remove expend CSS class and
 * vice-versa if `isCollapsed` is false
 */
export function toggleActiveCSSClass( element: Element, isCollapsed: boolean = true ) {
   if( isCollapsed ) {
      element.classList.add( COLLAPSED_CSS_CLASS );
      element.classList.remove( EXPENDED_CSS_CLASS );
   } else {
      element.classList.add( EXPENDED_CSS_CLASS );
      element.classList.remove( COLLAPSED_CSS_CLASS );
   }
}
