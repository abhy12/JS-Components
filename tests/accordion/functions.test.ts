import { getContainer, ACCORDION_SELECTOR, DURATION_ATTR, getTransitionDuration, INIT_CLASSNAME, ACCORDION_ITEM_WRAPPER_SELECTOR, TRIGGER_SELECTOR, getRelativeAccordions, findAccordionWithPosition } from "@js-components/accordion/core";
import { accordionStructure, accordionContainerId, customStruture, customContainerSelector, customItemWrapperSelector, customAccordionElSelector } from "./structure";
import { convertHTMLToAccordion, addAccordionEvents } from "@js-components/accordion/browser";
import JscAccordion from "@js-components/accordion";
import { baseConfig } from "./accordion.test";

describe( "functions", () => {
   addAccordionEvents();

   beforeEach(() =>  {
      document.body.innerHTML = '';
   });

   it( "gets accordion container", () => {
      document.body.insertAdjacentHTML( "afterbegin", accordionStructure );
      const container = document.querySelector( "#" + accordionContainerId );

      expect( container ).not.toBeNull();

      if( container ) {
         const accordion = container.querySelector( ACCORDION_SELECTOR );
         expect( accordion ).not.toBeNull();

         if( accordion instanceof HTMLElement ) {
            const closestContainer = getContainer( accordion );
            expect( closestContainer === container ).toEqual( true );
         }
      }
   });

   it( "gets transition duration", () => {
      document.body.insertAdjacentHTML( "afterbegin", accordionStructure );
      const container = document.querySelector( "#" + accordionContainerId );

      // must be other than '300' because of the default value
      const testDuration = 200;
      expect( container ).not.toBeNull();

      if( container instanceof HTMLElement ) {
         container.setAttribute( DURATION_ATTR, '' + testDuration );
         expect( getTransitionDuration( container ) ).toEqual( 200 );
      }
   });

   describe( "convertHTMLToAccordion", () => {
      it( "convert all not init accordion html to working accordion", () => {
         document.body.insertAdjacentHTML( "afterbegin", accordionStructure );
         convertHTMLToAccordion( JscAccordion );

         expect( document.getElementById( accordionContainerId )?.classList.contains( INIT_CLASSNAME ) ).toBeTruthy();
      });

      it( "will not convert already init accordion", () => {
         document.body.insertAdjacentHTML( "afterbegin", accordionStructure );
         const container = document.getElementById( accordionContainerId );
         container?.classList.add( INIT_CLASSNAME );

         convertHTMLToAccordion( JscAccordion );
         const wrapper = container?.querySelector( ACCORDION_ITEM_WRAPPER_SELECTOR );
         const trigger = wrapper?.querySelector( TRIGGER_SELECTOR ) as HTMLElement | null;
         const accordion = wrapper?.querySelector( ACCORDION_SELECTOR ) as HTMLElement | null;

         const isCollapsed = accordion?.dataset['collapse'];

         trigger?.click();

         expect( accordion?.dataset['collapse'] ).toEqual( isCollapsed );
      });
   });

   describe( "getRelativeAccordions", () => {
      test( "if all the accordions are relative", () => {
         document.body.insertAdjacentHTML( "afterbegin", customStruture );
         new JscAccordion( baseConfig );

         const accordions: HTMLElement[]  = Array.from( document.querySelectorAll( `${customContainerSelector} > ${customItemWrapperSelector} > ${customAccordionElSelector}` ) );
         const accordion = accordions[0];

         expect( accordion instanceof HTMLElement ).toBeTruthy();

         const relativeAccordion = getRelativeAccordions( accordion );
         expect( relativeAccordion ).not.toBeNull();

         relativeAccordion?.map( acc => {
            expect( accordions.includes( acc ) ).toBe( true );
         });
      });

      test( "if all the accordions are relative", () => {
         document.body.insertAdjacentHTML( "afterbegin", customStruture );
         new JscAccordion( baseConfig );

         const accordions: HTMLElement[]  = Array.from( document.querySelectorAll( `${customContainerSelector} > ${customItemWrapperSelector} > ${customItemWrapperSelector} > ${customAccordionElSelector}` ) );
         const accordion = accordions[0];

         expect( accordion instanceof HTMLElement ).toBeTruthy();

         const relativeAccordion = getRelativeAccordions( accordion );
         expect( relativeAccordion ).not.toBeNull();

         relativeAccordion?.map( acc => {
            expect( accordions.includes( acc ) ).toBe( true );
         });
      });

      describe( "findAccordionWithPosition", () => {
         it( "get first accordion", () => {
            document.body.insertAdjacentHTML( "afterbegin", customStruture );
            new JscAccordion( baseConfig );

            const container = document.querySelector( customContainerSelector );
            expect( container ).not.toBe( null );

            if( !( container instanceof HTMLElement ) ) return

            const firstAccordion = container.querySelector( `${customContainerSelector} > ${customItemWrapperSelector} > ${customAccordionElSelector}`)

            expect( firstAccordion ).not.toBe( null );
            expect( firstAccordion === findAccordionWithPosition( container, 1 ) ).toBe( true );
         });

         it( "get second accordion", () => {
            document.body.insertAdjacentHTML( "afterbegin", customStruture );
            new JscAccordion( baseConfig );

            const container = document.querySelector( customContainerSelector );
            expect( container ).not.toBe( null );

            if( !( container instanceof HTMLElement ) ) return

            const secondAccordion = container.querySelector( `${customContainerSelector} > ${customItemWrapperSelector}:nth-child(2) > ${customAccordionElSelector}`)

            expect( secondAccordion ).not.toBe( null );
            expect( secondAccordion === findAccordionWithPosition( container, 2 ) ).toBe( true );
         });

         it( "get nested accordion", () => {
            document.body.insertAdjacentHTML( "afterbegin", customStruture );
            new JscAccordion( baseConfig );

            const container = document.querySelector( customContainerSelector );
            expect( container ).not.toBe( null );

            if( !( container instanceof HTMLElement ) ) return

            const nestedAccordion = container.querySelector( `${customContainerSelector} > ${customItemWrapperSelector}:nth-child(2) > ${customItemWrapperSelector} > ${customAccordionElSelector}`)

            expect( nestedAccordion ).not.toBe( null );
            expect( nestedAccordion === findAccordionWithPosition( container, 3 ) ).toBe( true );
         });
      });
   });
});
