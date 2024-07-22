import { assignNewUniqueIdToElement, isHTMLElement } from "./utilities";
import { findAccordionTriggers, initTrigger, updateTriggers } from "./trigger";

///// CORE /////
export const PREFIX: string = "jsc";
export const TRANSITION_TIME = 300; //ms
export const TRANSITION_STATE_CLASSNAME = 'colexping';
export const INIT_CLASSNAME = `${PREFIX}-initialized`;
export const DURATION_CSS_VAR = `--${PREFIX}-ac-duration`;
export const EXPANDED_CSS_CLASS = 'expanded';
export const COLLAPSED_CSS_CLASS = 'collapsed';

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
export const TOGGLE_TYPE_ATTR = `data-${PREFIX}-accordion-type`;
export const DURATION_ATTR = `data-${PREFIX}-duration`;
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

/**
 * @param container - accordion container
 * @returns get timing of `container` if provided, otherwise get default timing
 */
export function getTransitionDuration( container?: HTMLElement ): number {
   let duration = TRANSITION_TIME;

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

export function beforeAccordionTransition( accordion: HTMLElement )  {
   // to let the "state" know that it will or it is transitioning
   accordion.classList.add( TRANSITION_STATE_CLASSNAME );

   let duration: number = TRANSITION_TIME;
   const container = getContainer( accordion );

   if( container ) {
      const containerDuration = getTransitionDuration( container );
      if( containerDuration ) duration = containerDuration;
   }

   accordion.style.transition = `height ${duration}ms ease-in-out`;
}

/**
 * @param accordion - accordion which will be transition
 * @param collapse - accordion is collapsing or not
 */
export function startAccordionTransition( accordion: HTMLElement, collapse: boolean ): void {
   const wrapper = accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR );
   if( isHTMLElement( wrapper ) ) toggleActiveCSSClass( wrapper, collapse);

   accordion.setAttribute( COLLAPSE_ATTR, collapse + '' );

   updateTriggers( accordion.id, collapse );
}

export function afterAccordionTransitionFinish( accordion: HTMLElement ) {
   accordion.style.transition = '';
   accordion.style.height = '';
   accordion.classList.remove( TRANSITION_STATE_CLASSNAME );
}

/**
 * @param accordion - accordion element
 * @returns - boolean whether accordion is transitioning
 */
export function isAccordionTransitioning( accordion: HTMLElement ): boolean {
   return accordion.classList.contains( TRANSITION_STATE_CLASSNAME );
}

/**
 * @param accordion - accordion element
 * @returns - boolean whether relative or provided accordion is transitioning
 */
export function isRelativeAccordionTransitioning( accordion: HTMLElement ): boolean {
   const relativeAccordions = getRelativeAccordions( accordion );

   if( relativeAccordions ) {
      for( let i = 0; i < relativeAccordions.length; i++ ) {
         if( isAccordionTransitioning( relativeAccordions[i] ) ) return true
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
 * @description add collapse CSS class and remove expand CSS class and
 * vice-versa if `isCollapsed` is false
 */
export function toggleActiveCSSClass( element: Element, isCollapsed: boolean = true ) {
   element.classList.toggle( COLLAPSED_CSS_CLASS, isCollapsed );
   element.classList.toggle( EXPANDED_CSS_CLASS, !isCollapsed );
}

/**
 * @param element - element to expand/open
 * @param duration - transition duration in millisecond (default 300)
 * @param beforeTransition - callback function, which will be called when transition properly starts
 * @param afterTransition - callback function, called when transition finished
 * @description smoothly expand HTMLElement vertically
 */
export function expandElement( element: HTMLElement, duration: number = 300, beforeTransition?: CallableFunction | null, afterTransition?: CallableFunction | null ): void {
   // reset
   element.style.display = '';
   element.style.overflow = 'hidden';
   // to get the full height
   element.style.height = 'auto';
   const fullHeight = element.getBoundingClientRect().height;
   const transitionDuration: number = ( duration && Number.isInteger( duration ) && duration > 0 ) ? duration : TRANSITION_TIME;
   element.style.height = '0';
   element.style.transition = `height ${transitionDuration}ms ease-in-out`;

   // because of repaint of height, we have to do this for smooth transition
   requestAnimationFrame(() => {
      requestAnimationFrame(() => {
         if( typeof beforeTransition === 'function' ) beforeTransition();
         element.style.height = fullHeight + 'px';
         if( typeof afterTransition === 'function' ) setTimeout( afterTransition, transitionDuration );
      });
   });
}

/**
 * @param element - element to collapse/close
 * @param duration - transition duration in millisecond (default 300)
 * @param beforeTransition - callback function, which will be called when transition properly starts
 * @param afterTransition - callback function, called when transition finished
 * @description smoothly collapse HTMLElement vertically
 */
export function collapseElement( element: HTMLElement, duration: number = 300, beforeTransition?: CallableFunction | null, afterTransition?: CallableFunction | null ): void {
   const fullHeight = element.getBoundingClientRect().height;
   const transitionDuration: number = ( duration && Number.isInteger( duration ) && duration > 0 ) ? duration : TRANSITION_TIME;
   element.style.height = fullHeight + 'px';
   element.style.transition = `height ${transitionDuration}ms ease-in-out`;
   element.style.overflow = 'hidden';

   // because of repaint of height, we have to do this for smooth transition
   requestAnimationFrame(() => {
      requestAnimationFrame(() => {
         if( typeof beforeTransition === 'function' ) beforeTransition();
         element.style.height = '0';
         if( typeof afterTransition === 'function' ) setTimeout( afterTransition, transitionDuration );
      });
   });
}
