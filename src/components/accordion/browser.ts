import { ACCORDION_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR, CONTAINER_SELECTOR, CONTAINER_ATTR, DEP_ACCORDION_SELECTOR, TRIGGER_SELECTOR } from "./core";
import { getClosestTriggers, getAllAssociateTriggers, accordionToggleEventHandler } from "./trigger";

function addNewAttributeToDeprecatedAccordion()  {
   const deprecatedAccordion = document.querySelectorAll( DEP_ACCORDION_SELECTOR );

   deprecatedAccordion.forEach( accordion => {
      let previousValue = "true";

      ///get previous attribute value then assign to new attribute value
      if( accordion.getAttribute( DEP_ACCORDION_SELECTOR ) === "false" )  previousValue = "false"

      accordion.setAttribute( CONTAINER_ATTR, previousValue );
   });
   ///P.S not removing the deprecated attribute because if user
   ///have set the style based on the attribute
}

export function convertHTMLToAccordion( JscAccordion: any )  {
   ///for backward compatibility
   addNewAttributeToDeprecatedAccordion();

   const accordionContainers = document.querySelectorAll( CONTAINER_SELECTOR ) as NodeListOf<HTMLElement>;

   accordionContainers.forEach( container => {
      let trigger: null | NodeListOf<HTMLElement> | HTMLElement[] = null;

      const accordionItemWrappers = container.querySelectorAll( ACCORDION_ITEM_WRAPPER_SELECTOR ) as NodeListOf<HTMLElement>;

      if( accordionItemWrappers.length > 0 )  {
         new JscAccordion({
            container: container,
            containerIsAccordion: false,
            accordionElWrapper: ACCORDION_ITEM_WRAPPER_SELECTOR,
            accordionEl: ACCORDION_SELECTOR,
            button: TRIGGER_SELECTOR,
         });
      }
      ///make container an accordion,
      ///for backward compatibility
      else if( accordionItemWrappers.length === 0 )  {
         const containerId = container.id;

         if( containerId === '' )  {
            trigger = getClosestTriggers( container );
         } else if( containerId !== '' )  {
            trigger = getAllAssociateTriggers( container );
         }

         new JscAccordion({
            container: container,
            accordionElWrapper: ACCORDION_ITEM_WRAPPER_SELECTOR,
            accordionEl: ACCORDION_SELECTOR,
            button: trigger,
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
