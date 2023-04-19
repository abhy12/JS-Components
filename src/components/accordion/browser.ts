import { ACCORDION_SELECTOR, CONTAINER_SELECTOR, CONTAINER_ATTR, DEP_ACCORDION_SELECTOR } from "./core";
import JscAccordion from "./accordion";
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

export function convertHTMLToAccordion()  {
   ///for backward compatibility
   addNewAttributeToDeprecatedAccordion();

   const accordionContainers = document.querySelectorAll( CONTAINER_SELECTOR ) as NodeListOf<HTMLElement>;

   accordionContainers.forEach( container => {
      let trigger: null | NodeListOf<HTMLElement> | HTMLElement[] = null;

      ///container accordions
      const accordions = container.querySelectorAll( ACCORDION_SELECTOR ) as NodeListOf<HTMLElement>;

      if( accordions.length > 0 )  {
         accordions.forEach( accordion => {
            const accordionId = accordion.id;

            ///accordion don't have ID that means it don't have any
            ///trigger outside the item container
            if( accordionId === '' )  {
               trigger = getClosestTriggers( accordion );
            } else if( accordionId !== '' )  {
               trigger = getAllAssociateTriggers( accordion );
            }

            new JscAccordion({
               container: accordion,
               button: trigger,
            });
         });
      }

      ///make container an accordion,
      ///doing this because of backward compatibility
      else if( accordions.length === 0 )  {
         const containerId = container.id;

         if( containerId === '' )  {
            trigger = getClosestTriggers( container );
         } else if( containerId !== '' )  {
            trigger = getAllAssociateTriggers( container );
         }

         new JscAccordion({
            container: container,
            button: trigger,
         });
      }
   });
}

export function browserSetup()  {
   ///convert all exisiting accordion html to working accordion
   convertHTMLToAccordion();

   ///add click event for accordion trigger to the body for event Bubbling
   document.body.addEventListener( "click", accordionToggleEventHandler );
}
