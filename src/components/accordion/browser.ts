import { ACCORDION_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR, CONTAINER_SELECTOR, TRIGGER_SELECTOR, INIT_CLASSNAME } from "./core";
import { accordionToggleEventHandler } from "./trigger";

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
