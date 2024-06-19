import JscAccordion, { AccordionArgs } from "@js-components/accordion/";
import { convertHTMLToAccordion } from "@js-components/accordion/browser";
import { CONTAINER_ATTR, ACCORDION_ITEM_WRAPPER_ATTR, ACCORDION_ATTR, TRIGGER_ATTR, TRIGGER_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR, ACCORDION_SELECTOR, COLLAPSE_ATTR, CONTAINER_SELECTOR, TOGGLE_TYPE_ATTR, getTransitionDuration, TRANSITION_TIME, DURATION_ATTR, INIT_CLASSNAME, DATA_WRAPPER_SELECTOR_ATTR, DATA_ACCORDION_SELECTOR_ATTR, DATA_TRIGGER_SELECTOR_ATTR } from "@js-components/accordion/core";
import { getClosestTriggers } from "@js-components/accordion/trigger";
import { customStruture, accordionStructure, accordionContainerId, customContainerSelector, customItemWrapperSelector, customAccordionEl, customAccordionElSelector, customTriggerSelector, customContainerId, customItemWrapper, customTrigger } from "./structure";

export const baseConfig = {
   container: customContainerSelector,
   accordionElWrapper: customItemWrapperSelector,
   accordionEl: customAccordionElSelector,
   button: customTriggerSelector,
}

describe( "JscAccordion", () => {
   beforeEach(() =>  {
      document.body.innerHTML = '';
      document.body.insertAdjacentHTML( "afterbegin", accordionStructure );
      document.body.insertAdjacentHTML( "afterbegin", customStruture );
      convertHTMLToAccordion();
   });

   it( "convert all DOM accordion struture to working accordion", async () => {
      const accordionItem = document.querySelectorAll( `#${accordionContainerId} ${ACCORDION_ITEM_WRAPPER_SELECTOR}` )[1] as HTMLElement;
      const accordion = accordionItem?.querySelector( ACCORDION_SELECTOR ) as HTMLElement;
      const trigger = accordionItem?.querySelector( TRIGGER_SELECTOR ) as HTMLElement;

      expect( accordion?.getAttribute( COLLAPSE_ATTR ) ).toEqual( "true" );

      trigger.click();

      expect( accordion?.getAttribute( COLLAPSE_ATTR ) ).toEqual( "false" );
   });

   it( "properly run accordion function without any interruption of DOM 'accordion' converter", () => {
      new JscAccordion( baseConfig );

      const accordionContainer = document.querySelector( customContainerSelector );

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

   describe( "checks if first accordion is expanded or not", () => {
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
         it( "checks if first accordion expanded which is default behavior", () =>  {
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

      expect( document.querySelector( customContainerSelector )?.getAttribute( TOGGLE_TYPE_ATTR ) ).toEqual( null );
   });

   it( "adds toggle type attribute to the container", () => {
      new JscAccordion({
         ...baseConfig,
         type: 'toggle',
      });

      expect( document.querySelector( customContainerSelector )?.getAttribute( TOGGLE_TYPE_ATTR ) ).toEqual( "toggle" );
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

   describe( "select all the accordion elements", () => {
      const baseConfig: AccordionArgs = {
         container: customContainerSelector,
         accordionElWrapper: customItemWrapperSelector,
         accordionEl: customAccordionElSelector,
         button: customTriggerSelector,
      }

      const customStruture = `
      <div id="${customContainerId}">
         <div class="${customItemWrapper}">
            <h1><button class="${customTrigger}">Lorem ipsum dolor sit amet.</button></h1>
            <div class="${customAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            <div class="${customAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            <div class="${customItemWrapper}">
               <h1><button class="${customTrigger}">Lorem ipsum dolor sit amet.</button></h1>
               <div class="${customAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            </div>
         </div>
         <div class="${customItemWrapper}">
            <h1><button class="${customTrigger}">Lorem ipsum dolor sit amet.</button></h1>
            <div class="${customAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            <div class="${customAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            <div class="${customItemWrapper}">
               <h1><button class="${customTrigger}">Lorem ipsum dolor sit amet.</button></h1>
               <div class="${customAccordionEl}">Lorem ipsum dolor sit amet consect</div>
            </div>
         </div>
         <div class="${customItemWrapper}"></div>
         <div class="${customItemWrapper}">
            <h1><button class="${customTrigger}">Lorem ipsum dolor sit amet.</button></h1>
            <div class="${customAccordionEl}">Lorem ipsum dolor sit amet consect</div>
         </div>
      </div>`;

      beforeEach(() => {
         document.body.innerHTML = '';
         document.body.insertAdjacentHTML( "afterbegin", customStruture );
         convertHTMLToAccordion();
      });

      it( "initiate wrappers which has accordion", () => {
         new JscAccordion( baseConfig );
         const wrappers = document.querySelectorAll( `${customContainerSelector} ${customItemWrapperSelector}` );

         wrappers.forEach( wrapper => {
            const accordion = wrapper.querySelector( ACCORDION_SELECTOR );

            if( accordion ) {
               expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR ) === wrapper ).toBeTruthy();
               expect( wrapper.getAttribute( ACCORDION_ITEM_WRAPPER_ATTR ) ).toEqual( "true" );
            } else {
               expect( wrapper.getAttribute( ACCORDION_ITEM_WRAPPER_ATTR ) ).toEqual( null );
            }
         });
      });

      it( "initiate no more than one accordion inside one wrapper", () => {
         new JscAccordion( baseConfig );
         const wrappers = document.querySelectorAll( `${customContainerSelector} ${customItemWrapperSelector}` );

         wrappers.forEach( ( wrapper ) => {
            const accordions = wrapper.querySelectorAll( customAccordionElSelector );

            accordions.forEach( ( accordion, i ) => {
               if( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR ) !== wrapper ) return

               if( i === 0 ) {
                  expect( accordion.getAttribute( ACCORDION_ATTR ) ).toEqual( "true" );
               } else {
                  expect( accordion.getAttribute( ACCORDION_ATTR ) ).toEqual( null );
               }
            });
         });
      });

      it( "select all the triggers which has accordion", () => {
         new JscAccordion( baseConfig );
         const triggers = document.querySelectorAll( customTriggerSelector );

         triggers.forEach( trigger => {
            const accordion = trigger.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.querySelector( ACCORDION_SELECTOR );

            if( accordion ) {
               expect( trigger.getAttribute( TRIGGER_ATTR ) ).not.toBeNull();
               expect( accordion.id === trigger.getAttribute( TRIGGER_ATTR ) ).toBeTruthy();
            }
         });
      });
   });

   it( "checks if duration set", () => {
      // set it other than default value
      const duration = 100;

      new JscAccordion({
         ...baseConfig,
         duration,
      });

      const container = document.querySelector( customContainerSelector );
      expect( container ).not.toBeNull();

      if( container instanceof HTMLElement ) {
         expect( getTransitionDuration( container ) ).toEqual( duration );
      }
   });

   it( "sets default duration if not provided", () => {
      new JscAccordion({
         ...baseConfig,
      });

      const container = document.querySelector( customContainerSelector );
      expect( container ).not.toBeNull();

      if( container instanceof HTMLElement ) {
         expect( getTransitionDuration( container ) ).toEqual( TRANSITION_TIME );
      }
   });

   it( "overwrite duration of HTML attribute if duration arg is present", () => {
      const container = document.querySelector( customContainerSelector );
      const duration = 100, htmlAttrDuration = 200;

      expect( container ).not.toBeNull();

      if( container ) container.setAttribute( DURATION_ATTR, '' + htmlAttrDuration );

      new JscAccordion({
         ...baseConfig,
         duration
      });


      if( container instanceof HTMLElement ) {
         expect( getTransitionDuration( container ) ).toEqual( duration );
      }
   });

   it( "checks if accordion is working in class constructor when only container arg is provided", () => {
      const container = document.querySelector( customContainerSelector );
      expect( container ).not.toBeFalsy();

      if( !( container instanceof HTMLElement ) ) return

      const accordionWrapper = container.querySelectorAll( customItemWrapperSelector );
      // adding default attributes
      accordionWrapper.forEach( item => {
         item.setAttribute( 'data-jsc-accordion-item', '' );
         const accordion = item.querySelector( customAccordionElSelector );
         const trigger = item.querySelector( customTriggerSelector );

         expect( accordion ).toBeTruthy();
         expect( trigger ).toBeTruthy();

         if( accordion instanceof HTMLElement && trigger instanceof HTMLElement ) {
            accordion.setAttribute( 'data-jsc-accordion', '' );
            trigger.setAttribute( 'data-jsc-target', '' );
         }
      });

      new JscAccordion({
         container: customContainerSelector,
      });

      const trigger = document.querySelector( `${customContainerSelector} ${customTriggerSelector}` );

      expect( trigger ).not.toBeFalsy();

      if( !( trigger instanceof HTMLElement ) ) return

      const isCollapseContain = trigger.classList.contains( 'collapsed' );
      trigger.click();

      if( isCollapseContain ) {
         expect( trigger.classList.contains( 'collapsed' ) ).toBeFalsy();
      } else {
         expect( trigger.classList.contains( 'collapsed' ) ).toBeTruthy();
      }
   });

   test( 'if accordion initiated or not', () => {
      const eg1 = new JscAccordion({
         container: '#containerDoesNotExist',
      });

      const eg2 = new JscAccordion({
         container: customContainerSelector,
      });

      expect( eg1.initiated ).toBeFalsy();
      expect( eg2.initiated ).not.toBeFalsy();
   });

   describe( "checks if accordion container has initated class", () => {
      test( "html", () => {
         const accordionContainer = document.getElementById( accordionContainerId );

         expect( accordionContainer?.classList.contains( INIT_CLASSNAME ) ).toBeTruthy();
      });

      test( "class", () => {
         const container = document.querySelector( customContainerSelector );
         expect( container ).toBeTruthy();
         if( !( container instanceof HTMLElement ) ) return

         new JscAccordion({
            container: container,
         });

         expect( container?.classList.contains( INIT_CLASSNAME ) ).toBeTruthy();
      });
   });

   describe( "add selector args to data attribute in the container", () => {
      test( "defined selector args", () => {
         const container = document.querySelector( customContainerSelector );
         expect( container instanceof HTMLElement ).toBe( true );
         if( !( container instanceof HTMLElement ) ) return

         new JscAccordion({
            container,
            accordionElWrapper: customItemWrapperSelector,
            accordionEl: customAccordionElSelector,
         });

         expect( container.getAttribute( DATA_WRAPPER_SELECTOR_ATTR ) ).not.toBeNull();
         expect( container.getAttribute( DATA_ACCORDION_SELECTOR_ATTR ) ).not.toBeNull();
         expect( container.getAttribute( DATA_TRIGGER_SELECTOR_ATTR ) ).not.toBeNull();
      });

      test( "undefined selector args", () => {
         const container = document.querySelector( customContainerSelector );
         expect( container instanceof HTMLElement ).toBe( true );
         if( !( container instanceof HTMLElement ) ) return

         new JscAccordion({
            container,
         });

         expect( container.getAttribute( DATA_WRAPPER_SELECTOR_ATTR ) === ACCORDION_ITEM_WRAPPER_SELECTOR ).toBe( true );
         expect( container.getAttribute( DATA_ACCORDION_SELECTOR_ATTR ) === ACCORDION_SELECTOR ).toBe( true );
         expect( container.getAttribute( DATA_TRIGGER_SELECTOR_ATTR ) === TRIGGER_SELECTOR ).toBe( true );
      });
   });
});
