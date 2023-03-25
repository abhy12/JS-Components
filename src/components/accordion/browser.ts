import { accordionToggleEventHandler } from "./trigger";
import { ACCORDIONSELECTOR, PREFIX } from "./utilities";
import JscAccordion from "./accordion";

export function convertHTMLToAccordion()  {
   ///add click event of accordion trigger to body for event Bubbling
   document.body.addEventListener( 'click', accordionToggleEventHandler );

   ///get all the accordion content container
   const allAccordion = document.querySelectorAll( ACCORDIONSELECTOR ) as NodeListOf<HTMLElement>;

   ///convert accordion container to "accordion"
   allAccordion.forEach( item =>  {
      let triggerer;
      const accId = item.id;

      if( accId === '' )  {
         ///not selecting all the triggerer elements
         ///because of nested accordion under the container
         triggerer = item.closest( '.jsc-accordion' )?.querySelector( `[data-${PREFIX}-target]` ) as HTMLElement;
      } else if( accId !== '' )  {
         triggerer = document.querySelectorAll( `[data-${PREFIX}-target="${item.id}"]` ) as NodeListOf<HTMLElement>;
      }

      ///definitely not a good idea to use this class in this file
      ///and after that this file will be used in main "Accordion" file
      ///i don't have any idea right now how can i solve this.
      ///doing this because separation
      new JscAccordion({
         container: item,
         button: triggerer,
      });
   });
}
