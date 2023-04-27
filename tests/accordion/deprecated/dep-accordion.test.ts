import JscAccordion from "@js-components/accordion/accordion";
import { DEP_ACCORDION_SELECTOR, CONTAINER_ATTR, ACCORDION_ATTR } from "@js-components/accordion/core";
import { convertHTMLToAccordion } from "@js-components/accordion/browser";

const depAccordionStructure = `
   <div>
      <h1><button data-jsc-target="eg-1">Lorem ipsum dolor sit amet.</button></h1>
      <div id="eg-1" data-jsc-accCon="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
   <div>
      <h1><button data-jsc-target="eg-2">Lorem ipsum dolor sit amet.</button></h1>
      <div id="eg-1" data-jsc-accCon="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
   <div>
      <h1><button data-jsc-target="eg-3">Lorem ipsum dolor sit amet.</button></h1>
      <div id="eg-1" data-jsc-accCon="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
   <div class="jsc-accordion">
      <h1><button data-jsc-target="">Lorem ipsum dolor sit amet.</button></h1>
      <div data-jsc-accCon="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
`;


describe( "JscAccordion DOM", () => {
   beforeEach(() =>  {
      document.body.innerHTML = '';
   });

   it( "convert all the exisiting HTML accordion structure to Accordion", () => {
      document.body.insertAdjacentHTML( "afterbegin", depAccordionStructure );

      let allAccordionHasNewAttribute = false;

      convertHTMLToAccordion( JscAccordion );

      const accordions = Array.from( document.querySelectorAll( DEP_ACCORDION_SELECTOR ) as NodeListOf<HTMLElement> );

      for( let i = 0; i < accordions.length; i++ )  {
         if( accordions[i].getAttribute( CONTAINER_ATTR ) && accordions[i].getAttribute( ACCORDION_ATTR ) )  {
            allAccordionHasNewAttribute = true;
         } else {
            allAccordionHasNewAttribute = false;
            break
         }
      }

      expect( allAccordionHasNewAttribute ).toBe( true );
   });
});
