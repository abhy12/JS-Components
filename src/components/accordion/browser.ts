import { accordionToggleEventHandler } from "./core";
import { ACCORDIONSELECTOR, PREFIX } from "./utilities";
import JscAccordion from "./accordion";

///Run necessary "things" when DOM loaded
window.onload = () =>  {
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

      new JscAccordion({
         container: item,
         button: triggerer,
      });
   });
}
