import JscAccordion from "@js-components/accordion/";
import { convertHTMLToAccordion } from "@js-components/accordion/browser";
import { ACCORDION_SELECTOR, SELECT_TRIGGER_ACCORDION, TRIGGER_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR } from "@js-components/accordion/core";
import { accordionStructure, accordionContainerId, customStruture, customContainerId } from "./structure";

jest.useFakeTimers();
jest.spyOn( global, 'setTimeout' );

describe( "accordion trigger", () => {
   beforeEach(() =>  {
      document.body.innerHTML = '';
   });

   describe( "checks if trigger has 'collapsed' class when accordion is collapsed initially", () => {
      test( "browser", () => {
         document.body.insertAdjacentHTML( "afterbegin", accordionStructure );

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
         });

         expect( document.querySelectorAll( "#eg-1 .item button" )[1]?.classList.contains( "collapsed" ) ).toBe( true );
      });
   });

   describe( "expending and collapsing", () => {
      test( "html", () => {
         document.body.insertAdjacentHTML( "afterbegin", accordionStructure );
         convertHTMLToAccordion( JscAccordion );

         document.getElementById( accordionContainerId )?.querySelectorAll( ACCORDION_ITEM_WRAPPER_SELECTOR ).forEach( accordionItem => {
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
         });

         document.getElementById( customContainerId )?.querySelectorAll( ACCORDION_ITEM_WRAPPER_SELECTOR ).forEach( accordionItem => {
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
