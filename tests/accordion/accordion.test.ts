import JscAccordion from "@js-components/accordion/accordion";
import { convertHTMLToAccordion } from "@js-components/accordion/browser";
import { CONTAINER_ATTR, ACCORDION_ITEM_CONTAINER_ATTR, ACCORDION_ATTR, TRIGGER_ATTR, TRIGGER_SELECTOR, ACCORDION_ITEM_CONTAINER_SELECTOR, ACCORDION_SELECTOR, COLLAPSE_ATTR } from "@js-components/accordion/core";
import { accordionToggleEventHandler } from "@js-components/accordion/trigger";

const accordionStructure = `
<div id="basic" data-jsc-accordion-container="">
   <div data-jsc-accordion-item="">
      <h1><button data-jsc-target="">Lorem ipsum dolor sit amet.</button></h1>
      <div data-jsc-accordion="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
   <div data-jsc-accordion-item="">
      <h1><button data-jsc-target="">Lorem ipsum dolor sit amet.</button></h1>
      <div data-jsc-accordion="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
</div>`;

describe( "JscAccordion", () => {
   beforeEach(() =>  {
      document.body.innerHTML = '';
   });

   it( "convert all DOM accordion struture to working accordion", async () => {
      document.body.insertAdjacentHTML( "afterbegin", accordionStructure );

      convertHTMLToAccordion( JscAccordion );

      const accordionItem = document.querySelectorAll( `#basic ${ACCORDION_ITEM_CONTAINER_SELECTOR}` )[1] as HTMLElement;
      const accordion = accordionItem?.querySelector( ACCORDION_SELECTOR ) as HTMLElement;
      const trigger = accordionItem?.querySelector( TRIGGER_SELECTOR ) as HTMLElement;

      expect( accordion?.getAttribute( COLLAPSE_ATTR ) ).toEqual( "true" );

      trigger.click();

      await new Promise( r => setTimeout( r, 100 ) );

      expect( accordion?.getAttribute( COLLAPSE_ATTR ) ).toEqual( "false" );
   });

   it( "properly run accordion function without any interruption of DOM 'accordion' converter", () => {
      const customStruture = `
      <div id="eg-1">
         <div class="item">
            <h1><button>Lorem ipsum dolor sit amet.</button></h1>
            <div class="accordion">Lorem ipsum dolor sit amet consect</div>
         </div>
      </div>`;

      document.body.insertAdjacentHTML( "afterbegin", customStruture );
      document.body.insertAdjacentHTML( "afterbegin", accordionStructure );

      // convertHTMLToAccordion();

      const newAccordion = new JscAccordion({
         container: '#eg-1',
         accordionItemContainer: '.item',
         accordionEl: '.accordion',
         button: '.item button',
         containerIsAccordion: false
      });

      expect( document.querySelector( "#eg-1" ) ).not.toBeNull();
      expect( document.querySelector( "#eg-1" )?.getAttribute( CONTAINER_ATTR ) ).not.toBeNull();
      expect( document.querySelector( "#eg-1 .item" )?.getAttribute( ACCORDION_ITEM_CONTAINER_ATTR ) ).not.toBeNull();
      expect( document.querySelector( "#eg-1 .item .accordion" )?.getAttribute( ACCORDION_ATTR ) ).not.toBeNull();
      expect( document.querySelector( "#eg-1 .item h1 button" )?.getAttribute( TRIGGER_ATTR ) ).not.toBeNull();
   });
});
