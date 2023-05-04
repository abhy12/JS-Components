import { assignNewUniqueIdToElement } from "./utilities";

export const PREFIX: string = "jsc";
///@deprecated
export const DEP_ACCORDION_SELECTOR: string = `[data-${PREFIX}-acccon]`;
export const CONTAINER_ATTR: string = `data-${PREFIX}-accordion-container`;
export const CONTAINER_SELECTOR: string = `[${CONTAINER_ATTR}]`;
export const ACCORDION_ITEM_WRAPPER_ATTR: string = `data-${PREFIX}-accordion-item`;
export const ACCORDION_ITEM_WRAPPER_SELECTOR: string = `[${ACCORDION_ITEM_WRAPPER_ATTR}]`;
export const ACCORDION_ATTR: string = `data-${PREFIX}-accordion`;
export const ACCORDION_SELECTOR: string = `[${ACCORDION_ATTR}]`;
export const TRIGGER_ATTR: string = `data-${PREFIX}-target`;
export const TRIGGER_SELECTOR: string = `[${TRIGGER_ATTR}]`;
export const COLLAPSE_ATTR: string = "data-collapse";

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
