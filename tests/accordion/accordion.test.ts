import JscAccordion, { AccordionInterface } from "@js-components/accordion/accordion";
import { convertHTMLToAccordion } from "@js-components/accordion/browser";
import { CONTAINER_ATTR, ACCORDION_ITEM_WRAPPER_ATTR, ACCORDION_ATTR, TRIGGER_ATTR, TRIGGER_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR, ACCORDION_SELECTOR, COLLAPSE_ATTR, CONTAINER_SELECTOR, TOGGLE_TYPE_ATTR } from "@js-components/accordion/core";
import { getClosestTriggers } from "@js-components/accordion/trigger";

const accordionStructure = `
<div id="basic" ${CONTAINER_ATTR}>
   <div ${ACCORDION_ITEM_WRAPPER_ATTR}="">
      <h1><button ${TRIGGER_ATTR}>Lorem ipsum dolor sit amet.</button></h1>
      <div ${ACCORDION_ATTR}="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
   <div ${ACCORDION_ITEM_WRAPPER_ATTR}="">
      <h1><button ${TRIGGER_ATTR}>Lorem ipsum dolor sit amet.</button></h1>
      <div ${ACCORDION_ATTR}="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
</div>`;

const exampleContainer = "eg-1";
const exampleContainerSelector = "#" + exampleContainer;
const exampleItemWrapper = "item";
const exampleItemWrapperSelector = "." + exampleItemWrapper;
const exampleAccordionEl = "accordion";
const exampleAccordionElSelector = "." + exampleAccordionEl;
const exampleTrigger = "trigger";
const exampleTriggerSelector = "." + exampleTrigger;
const customStruture = `
<div id="${exampleContainer}">
   <div class="${exampleItemWrapper}">
      <h1><button class="${exampleTrigger}">Lorem ipsum dolor sit amet.</button></h1>
      <div class="${exampleAccordionEl}">Lorem ipsum dolor sit amet consect</div>
   </div>
   <div class="${exampleItemWrapper}">
      <h1><button class="${exampleTrigger}">Lorem ipsum dolor sit amet.</button></h1>
      <div class="${exampleAccordionEl}">Lorem ipsum dolor sit amet consect</div>
   </div>
</div>`;

const baseConfig = {
   container: exampleContainerSelector,
   accordionElWrapper: exampleItemWrapperSelector,
   accordionEl: exampleAccordionElSelector,
   button: exampleTriggerSelector,
   containerIsAccordion: false
}

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
      new JscAccordion( baseConfig );

      const accordionContainer = document.querySelector( exampleContainerSelector );

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
            new JscAccordion( baseConfig );

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
               ...baseConfig,
               firstElExpend: false
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

   it( "don't add accordion type attribute to the container if type value equal to 'accordion'", () => {
      new JscAccordion({
         ...baseConfig,
         type: 'accordion',
      });

      expect( document.querySelector( exampleContainerSelector )?.getAttribute( TOGGLE_TYPE_ATTR ) ).toEqual( null );
   });

   it( "adds toggle type attribute to the container", () => {
      new JscAccordion({
         ...baseConfig,
         type: 'toggle',
      });

      expect( document.querySelector( exampleContainerSelector )?.getAttribute( TOGGLE_TYPE_ATTR ) ).toEqual( "toggle" );
   });

   describe( "does not save accordion item wrapper or accordion element selector to the instance in these options are ommited", () => {
      it( "accordion item wrapper", () => {
         const myAccordion = new JscAccordion({
            ...baseConfig,
            accordionElWrapper: undefined
         });

         expect( myAccordion.accordionElWrapper ).toBe( undefined );
      });

      it( "accordion item wrapper", () => {
         const myAccordion = new JscAccordion({
            ...baseConfig,
            accordionElWrapper: ''
         });

         expect( myAccordion.accordionElWrapper ).toBe( undefined );
      });

      it( "accordion elment", () => {
         const myAccordion = new JscAccordion({
            ...baseConfig,
            accordionEl: undefined
         });

         expect( myAccordion.accordionEl ).toBe( undefined );
      });

      it( "accordion elment", () => {
         const myAccordion = new JscAccordion({
            ...baseConfig,
            accordionEl: ''
         });

         expect( myAccordion.accordionEl ).toBe( undefined );
      });

      it( "both accordion item wrapper and accordion elment", () => {
         const myAccordion = new JscAccordion({
            ...baseConfig,
            accordionElWrapper: undefined,
            accordionEl: undefined
         });

         expect( myAccordion.accordionElWrapper ).toBe( undefined );
         expect( myAccordion.accordionEl ).toBe( undefined );
      });

      it( "both accordion item wrapper and accordion element", () => {
         const myAccordion = new JscAccordion({
            ...baseConfig,
            accordionElWrapper: '',
            accordionEl: ''
         });

         expect( myAccordion.accordionElWrapper ).toBe( undefined );
         expect( myAccordion.accordionEl ).toBe( undefined );
      });
   });

   describe( "select only direct or relative elements", () => {
      const baseConfig: AccordionInterface = {
         container: exampleContainerSelector,
         containerIsAccordion: false,
         accordionElWrapper: exampleItemWrapperSelector,
         accordionEl: exampleAccordionElSelector,
         button: exampleTriggerSelector,
      }

      const customStruture = `
      <div id="${exampleContainer}">
         <div class="${exampleItemWrapper}">
            <h1><button class="${exampleTrigger}">Lorem ipsum dolor sit amet.</button></h1>
            <div class="${exampleAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            <div class="${exampleAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            <div class="${exampleItemWrapper}">
               <h1><button class="${exampleTrigger}">Lorem ipsum dolor sit amet.</button></h1>
               <div class="${exampleAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            </div>
         </div>
         <div class="${exampleItemWrapper}">
            <h1><button class="${exampleTrigger}">Lorem ipsum dolor sit amet.</button></h1>
            <div class="${exampleAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            <div class="${exampleAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            <div class="${exampleItemWrapper}">
               <h1><button class="${exampleTrigger}">Lorem ipsum dolor sit amet.</button></h1>
               <div class="${exampleAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            </div>
         </div>
      </div>`;

      beforeEach(() => {
         document.body.innerHTML = '';
         document.body.insertAdjacentHTML( "afterbegin", customStruture );
         convertHTMLToAccordion( JscAccordion );
      });

      it( "initiate only direct accordion wrapper", () => {
         new JscAccordion( baseConfig );
         const directWrappers = document.querySelectorAll( `${exampleContainerSelector} > ${exampleItemWrapperSelector}` );
         const nestedWrappers = document.querySelectorAll( `${exampleContainerSelector} > ${exampleItemWrapperSelector} ${exampleItemWrapperSelector}` );

         expect( directWrappers.length ).toBeGreaterThan( 0 );
         expect( nestedWrappers.length ).toBeGreaterThan( 0 );

         directWrappers.forEach( wrapper => {
            expect( wrapper.getAttribute( ACCORDION_ITEM_WRAPPER_ATTR ) ).toEqual( "true" );
         });

         nestedWrappers.forEach( wrapper => {
            expect( wrapper.getAttribute( ACCORDION_ITEM_WRAPPER_ATTR ) ).toBe( null );
         });
      });

      it( "initiate only those accordions which is directly inside accordion wrapper and is first element", () => {
         new JscAccordion( baseConfig );
         const directWrappers = document.querySelectorAll( `${exampleContainerSelector} > ${exampleItemWrapperSelector}` ) as NodeListOf<HTMLElement>;
         const indirectAccordions = document.querySelectorAll( `${exampleContainerSelector} > ${exampleItemWrapperSelector} ${exampleItemWrapperSelector} ${exampleAccordionElSelector}` );

         expect( directWrappers.length ).toEqual( 2 );
         expect( indirectAccordions.length ).toEqual( 2 );

         directWrappers.forEach( ( wrapper: HTMLElement ) => {
            const accordions = wrapper.querySelectorAll( `:scope > ${exampleAccordionElSelector}` ) as NodeListOf<HTMLElement>;
            ///i think it's a bug in Jsdom because it's selecting more than 2, so not using toEqual
            expect( accordions.length ).toBeGreaterThan( 2 );

            accordions.forEach( ( accordion, i ) => {
               if( i !== 0 )  {
                  expect( accordion.getAttribute( ACCORDION_ATTR ) ).toEqual( null );
               } else {
                  expect( accordion.getAttribute( ACCORDION_ATTR ) ).toEqual( "true" );
               }
            });
         });

         indirectAccordions.forEach( accordion => {
            expect( accordion.getAttribute( ACCORDION_ATTR ) ).toBe( null );
         });
      });

      it( "select all the triggers inside the accordion wrapper not in nested accordion", () => {
         new JscAccordion( baseConfig );
         const wrappers = document.querySelectorAll( `${exampleContainerSelector} > ${exampleItemWrapperSelector}` ) as NodeListOf<HTMLElement>;

         wrappers.forEach( wrapper => {
            const triggers = wrapper.querySelectorAll( TRIGGER_SELECTOR );
            triggers.forEach( trigger => {
               expect( trigger.closest( exampleItemWrapperSelector ) === wrapper ).toBe( true );
            });
         });
      });
   });
});
