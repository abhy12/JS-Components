import JscAccordion from "@js-components/accordion/";
import { convertHTMLToAccordion } from "@js-components/accordion/browser";
import { ACCORDION_SELECTOR, SELECT_TRIGGER_ACCORDION, COLLAPSE_ATTR, TRIGGER_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR } from "@js-components/accordion/core";

jest.useFakeTimers();
jest.spyOn( global, 'setTimeout' );

const HtmlContainerId = 'basic-html-container',
accordionBrowserStructure = `
<div id="${HtmlContainerId}" data-jsc-accordion-container="">
   <div data-jsc-accordion-item="">
      <h1><button data-jsc-target="">Accordion #1</button></h1>
      <div data-jsc-accordion="">
         <h2>Accordion #1 Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
   <div data-jsc-accordion-item="">
      <h1><button data-jsc-target="">Accordion #2</button></h1>
      <div data-jsc-accordion="">
         <h2>Accordion #2 Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
   <div data-jsc-accordion-item="">
      <h1><button data-jsc-target="">Accordion #3</button></h1>
      <div id="test-ac-btn" data-jsc-accordion="">
         <h2>Accordion #3 Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
   <button data-jsc-target="test-ac-btn">Click to Trigger last accordion</button>
</div>`;

const customStrutureContainerId = "eg-1",
customStruture = `
<div id="${customStrutureContainerId}">
   <div class="item">
      <h1><button>Lorem ipsum dolor sit amet.</button></h1>
      <div class="accordion">Lorem ipsum dolor sit amet consect</div>
   </div>
   <div class="item">
      <h1><button>Lorem ipsum dolor sit amet.</button></h1>
      <div class="accordion">Lorem ipsum dolor sit amet consect</div>
   </div>
   <div class="item">
      <h1><button>Lorem ipsum dolor sit amet.</button></h1>
      <div id="test-ac" class="accordion">Lorem ipsum dolor sit amet consect</div>
   </div>
</div>
`;

describe( "accordion trigger", () => {
   beforeEach(() =>  {
      document.body.innerHTML = '';
   });

   describe( "checks if trigger has 'collapsed' class when accordion is collapsed initially", () => {
      test( "browser", () => {
         document.body.insertAdjacentHTML( "afterbegin", accordionBrowserStructure );

         convertHTMLToAccordion( JscAccordion );

         const accordions = document.querySelectorAll( `${ACCORDION_SELECTOR}[data-collapse="true"]` );

         accordions.forEach( accordion => {
            const trigger = document.querySelector( SELECT_TRIGGER_ACCORDION( accordion.id ) );

            if( trigger )  {
               expect( trigger.classList.contains( "collapsed" ) ).toBe( true );
            }
         });
      });

      test( "class", () => {
         document.body.insertAdjacentHTML( "afterbegin", customStruture );

         new JscAccordion({
            container: '#eg-1',
            accordionElWrapper: '.item',
            accordionEl: '.accordion',
            button: '.item button',
            containerIsAccordion: false
         });

         expect( document.querySelectorAll( "#eg-1 .item button" )[1]?.classList.contains( "collapsed" ) ).toBe( true );
      });
   });

   describe( "expending and collapsing", () => {
      test( "html", () => {
         document.body.insertAdjacentHTML( "afterbegin", accordionBrowserStructure );
         convertHTMLToAccordion( JscAccordion );

         document.getElementById( HtmlContainerId )?.querySelectorAll( ACCORDION_ITEM_WRAPPER_SELECTOR ).forEach( accordionItem => {
            if( !( accordionItem instanceof HTMLElement ) ) return

            const trigger = accordionItem.querySelector( TRIGGER_SELECTOR );
            const accordion = accordionItem.querySelector( ACCORDION_SELECTOR );
            expect( trigger ).not.toBeFalsy();
            expect( accordion ).not.toBeFalsy();

            if( trigger instanceof HTMLElement && accordion instanceof HTMLElement ) {
               const isCollapsed = accordion.dataset['collapse'];

               trigger.click();

               setTimeout(() => {
                  expect( accordion.dataset['collapse'] ).not.toEqual( isCollapsed );
               });
            }

            jest.runAllTimers();

            expect( setTimeout ).toHaveBeenCalled();
         });
      });

      test( "class", () => {
         document.body.insertAdjacentHTML( "afterbegin", customStruture );

         new JscAccordion({
            container: '#eg-1',
            accordionElWrapper: '.item',
            accordionEl: '.accordion',
            button: '.item button',
            containerIsAccordion: false
         });

         document.getElementById( customStrutureContainerId )?.querySelectorAll( ACCORDION_ITEM_WRAPPER_SELECTOR ).forEach( accordionItem => {
            if( !( accordionItem instanceof HTMLElement ) ) return

            const trigger = accordionItem.querySelector( TRIGGER_SELECTOR );
            const accordion = accordionItem.querySelector( ACCORDION_SELECTOR );
            expect( trigger ).not.toBeFalsy();
            expect( accordion ).not.toBeFalsy();

            if( trigger instanceof HTMLElement && accordion instanceof HTMLElement ) {
               const isCollapsed = accordion.dataset['collapse'];

               trigger.click();

               setTimeout(() => {
                  expect( accordion.dataset['collapse'] ).not.toEqual( isCollapsed );
               });
            }

            jest.runAllTimers();

            expect( setTimeout ).toHaveBeenCalled();
         });
      });
   });
});
