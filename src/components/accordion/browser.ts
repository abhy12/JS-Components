import { ACCORDIONSELECTOR, PREFIX } from "./core";
import JscAccordion from "./accordion";

export function convertHTMLToAccordion()  {
   ///get all the accordion content container
   const accordions = document.querySelectorAll( ACCORDIONSELECTOR ) as NodeListOf<HTMLElement>;

   ///convert accordion container to "accordion"
   accordions.forEach( accordion =>  {
      let trigger;
      const accId = accordion.id;

      if( accId === '' )  {
         ///not selecting all the trigger elements
         ///because of nested accordion under the container
         trigger = accordion.closest( '.jsc-accordion' )?.querySelector( `[data-${PREFIX}-target]` ) as HTMLElement;
      } else if( accId !== '' )  {
         trigger = document.querySelectorAll( `[data-${PREFIX}-target="${accordion.id}"]` ) as NodeListOf<HTMLElement>;
      }

      ///definitely not a good idea to use this class in this file
      ///and after that this file will be used in main "Accordion" file
      ///i don't have any idea right now how can i solve this.
      ///doing this because separation
      new JscAccordion({
         container: accordion,
         button: trigger,
      });
   });
}
