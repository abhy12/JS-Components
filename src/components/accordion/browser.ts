import { ACCORDION_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR, CONTAINER_SELECTOR, TRIGGER_SELECTOR, INIT_CLASSNAME, isContainer, getWrapperSelector, getAccordionSelector, getTriggerSelector, initWrapper } from "./core";
import { accordionToggleEventHandler } from "./trigger";
import { isHTMLElement } from "./utilities";

export function convertHTMLToAccordion( JscAccordion: any )  {
   const accordionContainers = document.querySelectorAll( `${CONTAINER_SELECTOR}:not(.${INIT_CLASSNAME})` );

   accordionContainers.forEach( container => {
      const accordionItemWrappers = container.querySelectorAll( ACCORDION_ITEM_WRAPPER_SELECTOR );

      if( accordionItemWrappers.length > 0 )  {
         new JscAccordion({
            container: container,
            containerIsAccordion: false,
            accordionElWrapper: ACCORDION_ITEM_WRAPPER_SELECTOR,
            accordionEl: ACCORDION_SELECTOR,
            button: TRIGGER_SELECTOR,
         });
      }
   });
}

export function addAccordionEvents() {
   ///for event Bubbling
   document.body.addEventListener( "click", accordionToggleEventHandler );
}

export function removeAccordionEvents() {
   document.body.removeEventListener( "click", accordionToggleEventHandler, false );
}

const mutationsObserverConfig: MutationObserverInit = {
   subtree: false,
   childList: true,
}

const mutationsObserverCallback: MutationCallback = ( mutationList ) => {
   for( const mutation of mutationList ) {
      if( !isHTMLElement( mutation.target ) || !isContainer( mutation.target ) ||
      !mutation.target.classList.contains( INIT_CLASSNAME ) || mutation.type !== "childList" ) continue

      const container = mutation.target;
      const wrapperSelector = getWrapperSelector( container );
      const accordionSelector = getAccordionSelector( container );
      const triggerSelector = getTriggerSelector( container );

      mutation.addedNodes.forEach( node => {
         if( !isHTMLElement( node ) ) return

         // first element is wrapper
         if( node.closest( wrapperSelector ) === node ) {
            initWrapper( node, wrapperSelector, accordionSelector, triggerSelector );
         }

         // find nested wrapper
         node.querySelectorAll( wrapperSelector ).forEach( wrapper => {
            initWrapper( wrapper, wrapperSelector, accordionSelector, triggerSelector );
         });
      });
   }
}

const mutationsObserver = new MutationObserver( mutationsObserverCallback );

export function mutationObserve( element: HTMLElement ) {
   mutationsObserver.observe( element, mutationsObserverConfig );
}
