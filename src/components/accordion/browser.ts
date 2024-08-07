import { ACCORDION_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR, CONTAINER_SELECTOR, TRIGGER_SELECTOR, INIT_CLASSNAME, getContainer } from "./core";
import { accordionToggleEventHandler } from "./trigger";
import { isHTMLElement } from "./utilities";
import JscAccordion from "./accordion";

export function convertHTMLToAccordion()  {
   const accordionContainers = document.querySelectorAll( `${CONTAINER_SELECTOR}:not(.${INIT_CLASSNAME})` );

   accordionContainers.forEach( container => {
      const accordionItemWrappers = container.querySelectorAll( ACCORDION_ITEM_WRAPPER_SELECTOR );

      if( accordionItemWrappers.length > 0 )  {
         new JscAccordion({
            container: container,
            wrapper: ACCORDION_ITEM_WRAPPER_SELECTOR,
            accordion: ACCORDION_SELECTOR,
            trigger: TRIGGER_SELECTOR,
         });
      }
   });
}

export function addAccordionEvents() {
   // if called again
   removeAccordionEvents();
   ///for event Bubbling
   document.body.addEventListener( "click", accordionToggleEventHandler );
}

export function removeAccordionEvents() {
   document.body.removeEventListener( "click", accordionToggleEventHandler, false );
}

const mutationsObserverConfig: MutationObserverInit = {
   subtree: true,
   childList: true,
}

const mutationsObserverCallback: MutationCallback = ( mutationList ) => {
   for( const mutation of mutationList ) {
      if( !isHTMLElement( mutation.target ) || mutation.type !== "childList" ) continue

      const target = mutation.target;
      const container = getContainer( target );
      const instance = container?.JscAccordion;
      if( !container || !instance ) continue

      try{
         const wrapperSelector = instance.wrapperSelector;

         mutation.addedNodes.forEach( node => {
            if( !isHTMLElement( node ) ) return

            // first element is wrapper
            if( node.closest( wrapperSelector ) === node ) {
               instance._initItem( node );
            }

            // find nested wrapper
            node.querySelectorAll( wrapperSelector ).forEach( wrapper => {
               instance._initItem( wrapper );
            });
         });
      } catch( e ) {
         // eslint-disable-next-line no-console
         console.error( e );
      }
   }
}

const mutationsObserver = new MutationObserver( mutationsObserverCallback );

export function mutationObserve( element: HTMLElement ) {
   mutationsObserver.observe( element, mutationsObserverConfig );
}
