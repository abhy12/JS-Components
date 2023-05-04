import JscAccordion from "@js-components/accordion/accordion";
import { convertHTMLToAccordion } from "@js-components/accordion/browser";
import { CONTAINER_ATTR, ACCORDION_ITEM_WRAPPER_ATTR, ACCORDION_ATTR, TRIGGER_ATTR, TRIGGER_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR, ACCORDION_SELECTOR, COLLAPSE_ATTR, CONTAINER_SELECTOR } from "@js-components/accordion/core";
import { getClosestTriggers } from "@js-components/accordion/trigger";

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

const customStruture = `
<div id="eg-1">
   <div class="item">
      <h1><button>Lorem ipsum dolor sit amet.</button></h1>
      <div class="accordion">Lorem ipsum dolor sit amet consect</div>
   </div>
   <div class="item">
      <h1><button>Lorem ipsum dolor sit amet.</button></h1>
      <div class="accordion">Lorem ipsum dolor sit amet consect</div>
   </div>
</div>`;


describe( "JscAccordion", () => {
   beforeEach(() =>  {
      document.body.innerHTML = '';
      document.body.insertAdjacentHTML( "afterbegin", accordionStructure );
      document.body.insertAdjacentHTML( "afterbegin", customStruture );
      convertHTMLToAccordion( JscAccordion );
   });

   it( "convert all DOM accordion struture to working accordion", async () => {
      const accordionItem = document.querySelectorAll( `#basic ${ACCORDION_ITEM_WRAPPER_SELECTOR}` )[1] as HTMLElement;
      const accordion = accordionItem?.querySelector( ACCORDION_SELECTOR ) as HTMLElement;
      const trigger = accordionItem?.querySelector( TRIGGER_SELECTOR ) as HTMLElement;

      expect( accordion?.getAttribute( COLLAPSE_ATTR ) ).toEqual( "true" );

      trigger.click();

      expect( accordion?.getAttribute( COLLAPSE_ATTR ) ).toEqual( "false" );
   });

   it( "properly run accordion function without any interruption of DOM 'accordion' converter", () => {
      new JscAccordion({
         container: '#eg-1',
         accordionItemContainer: '.item',
         accordionEl: '.accordion',
         button: '.item button',
         containerIsAccordion: false
      });

      const accordionContainer = document.querySelector( "#eg-1" );

      expect( accordionContainer ).not.toBeNull();

      if( accordionContainer )  {
         expect( accordionContainer.getAttribute( CONTAINER_ATTR ) ).not.toBeNull();
         expect( accordionContainer.getAttribute( ACCORDION_ITEM_WRAPPER_ATTR ) ).toBeNull();
         expect( accordionContainer.getAttribute( ACCORDION_ATTR ) ).toBeNull();

         expect( accordionContainer.querySelector( ".item" )?.getAttribute( ACCORDION_ITEM_WRAPPER_ATTR ) ).not.toBeNull();
         expect( accordionContainer.querySelector( ".item .accordion" )?.getAttribute( ACCORDION_ATTR ) ).not.toBeNull();
         expect( accordionContainer.querySelector( ".item h1 button" )?.getAttribute( TRIGGER_ATTR ) ).not.toBeNull();
      }
   });

   describe( "checks if first accordion is expended or not", () => {
      test( "browser", () => {
         const accordion = document.querySelector( CONTAINER_SELECTOR + " " + ACCORDION_SELECTOR ) as HTMLElement | null;

         expect( accordion?.getAttribute( COLLAPSE_ATTR ) ).toEqual( "false" );

         if( accordion )  {
            const triggers = getClosestTriggers( accordion );
            triggers?.forEach( trigger => {
               expect( trigger.classList.contains( "collapsed" ) ).toBeFalsy();
            });
         }
      });

      describe( "class", () => {
         it( "checks if first accordion expended which is default behavior", () =>  {
            new JscAccordion({
               container: '#eg-1',
               accordionItemContainer: '.item',
               accordionEl: '.accordion',
               button: '.item button',
               containerIsAccordion: false,
            });

            const accordion = document.querySelector( "#eg-1 .item .accordion" ) as HTMLElement | null;

            expect( accordion?.getAttribute( COLLAPSE_ATTR ) ).toEqual( "false" );

            if( accordion )  {
               const triggers = getClosestTriggers( accordion );
               triggers?.forEach( trigger => {
                  expect( trigger.classList.contains( "collapsed" ) ).toBeFalsy();
               });
            }
         });

         it( "checks if first accordion collapsed", () =>  {
            new JscAccordion({
               container: '#eg-1',
               accordionItemContainer: '.item',
               accordionEl: '.accordion',
               firstElExpend: false,
               button: '.item button',
               containerIsAccordion: false,
            });

            const accordion = document.querySelector( "#eg-1 .item .accordion" ) as HTMLElement | null;

            expect( accordion?.getAttribute( COLLAPSE_ATTR ) ).toEqual( "true" );

            if( accordion )  {
               const triggers = getClosestTriggers( accordion );
               triggers?.forEach( trigger => {
                  expect( trigger.classList.contains( "collapsed" ) ).toBeTruthy();
               });
            }
         });
      });
   });
});
