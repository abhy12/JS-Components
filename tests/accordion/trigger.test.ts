import JscAccordion from "@js-components/accordion/";
import { convertHTMLToAccordion } from "@js-components/accordion/browser";
import { ACCORDION_SELECTOR, SELECT_TRIGGER_ACCORDION, TRIGGER_SELECTOR, ACCORDION_ITEM_WRAPPER_SELECTOR, COLLAPSED_CSS_CLASS, COLLAPSE_ATTR, EXPANDED_CSS_CLASS } from "@js-components/accordion/core";
import { accordionStructure, accordionContainerId, customStruture, customContainerId } from "./structure";

jest.useFakeTimers();
jest.spyOn( global, 'setTimeout' );

describe( "accordion trigger", () => {
   beforeEach(() =>  {
      document.body.innerHTML = '';
   });

   describe( "checks if trigger & accordion has appropriate CSS class initially", () => {
      test( "browser", () => {
         document.body.insertAdjacentHTML( "afterbegin", accordionStructure );

         convertHTMLToAccordion();

         const accordions = document.querySelectorAll( ACCORDION_SELECTOR );

         expect( accordions.length > 0 ).toBeTruthy();

         accordions.forEach( accordion => {
            const isCollapsed = accordion.getAttribute( COLLAPSE_ATTR );
            const trigger = document.querySelector( SELECT_TRIGGER_ACCORDION( accordion.id ) );

            if( isCollapsed === 'true' ) {
               expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeTruthy();
               expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( EXPANDED_CSS_CLASS ) ).toBeFalsy();

               expect( trigger?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBe( true );
               expect( trigger?.classList.contains( EXPANDED_CSS_CLASS ) ).toBe( false );
            } else if( isCollapsed === 'false' ) {
               expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( EXPANDED_CSS_CLASS ) ).toBeTruthy();
               expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeFalsy();

               expect( trigger?.classList.contains( EXPANDED_CSS_CLASS ) ).toBe( true );
               expect( trigger?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBe( false );
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

         const accordions = document.querySelectorAll( "#eg-1 .item button" );

         accordions.forEach( accordion => {
            const isCollapsed = accordion.getAttribute( COLLAPSE_ATTR );
            const trigger = document.querySelector( SELECT_TRIGGER_ACCORDION( accordion.id ) );

            if( isCollapsed === 'true' ) {
               expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeTruthy();
               expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( EXPANDED_CSS_CLASS ) ).toBeFalsy();

               expect( trigger?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBe( true );
               expect( trigger?.classList.contains( EXPANDED_CSS_CLASS ) ).toBe( false );
            } else if( isCollapsed === 'false' ) {
               expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( EXPANDED_CSS_CLASS ) ).toBeTruthy();
               expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeFalsy();

               expect( trigger?.classList.contains( EXPANDED_CSS_CLASS ) ).toBe( true );
               expect( trigger?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBe( false );
            }
         });
      });
   });

   describe( "expanding and collapsing accordion", () => {
      test( "html", () => {
         document.body.insertAdjacentHTML( "afterbegin", accordionStructure );
         convertHTMLToAccordion();

         document.getElementById( accordionContainerId )?.querySelectorAll( ACCORDION_ITEM_WRAPPER_SELECTOR ).forEach( accordionItem => {
            if( !( accordionItem instanceof HTMLElement ) ) return

            const trigger = accordionItem.querySelector( TRIGGER_SELECTOR );
            const accordion = accordionItem.querySelector( ACCORDION_SELECTOR );
            expect( trigger ).not.toBeFalsy();
            expect( accordion ).not.toBeFalsy();

            if( trigger instanceof HTMLElement && accordion instanceof HTMLElement ) {
               const isCollapsed = accordion.getAttribute( COLLAPSE_ATTR );

               trigger.click();

               const afterClickedIsCollapsed = accordion.getAttribute( COLLAPSE_ATTR );

               expect( afterClickedIsCollapsed ).not.toEqual( isCollapsed );

               if( afterClickedIsCollapsed === 'true' ) {
                  expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeTruthy();
                  expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( EXPANDED_CSS_CLASS ) ).toBeFalsy();

                  expect( trigger.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeTruthy();
                  expect( trigger.classList.contains( EXPANDED_CSS_CLASS ) ).toBeFalsy();
               } else if( afterClickedIsCollapsed === 'false' ) {
                  expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( EXPANDED_CSS_CLASS ) ).toBeTruthy();
                  expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeFalsy();

                  expect( trigger.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeFalsy();
                  expect( trigger.classList.contains( EXPANDED_CSS_CLASS ) ).toBeTruthy();
               }
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
               const isCollapsed = accordion.getAttribute( COLLAPSE_ATTR );

               trigger.click();

               const afterClickedIsCollapsed = accordion.getAttribute( COLLAPSE_ATTR );

               expect( afterClickedIsCollapsed ).not.toEqual( isCollapsed );

               if( afterClickedIsCollapsed === 'true' ) {
                  expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeTruthy();
                  expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( EXPANDED_CSS_CLASS ) ).toBeFalsy();

                  expect( trigger.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeTruthy();
                  expect( trigger.classList.contains( EXPANDED_CSS_CLASS ) ).toBeFalsy();
               } else if( afterClickedIsCollapsed === 'false' ) {
                  expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( EXPANDED_CSS_CLASS ) ).toBeTruthy();
                  expect( accordion.closest( ACCORDION_ITEM_WRAPPER_SELECTOR )?.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeFalsy();

                  expect( trigger.classList.contains( COLLAPSED_CSS_CLASS ) ).toBeFalsy();
                  expect( trigger.classList.contains( EXPANDED_CSS_CLASS ) ).toBeTruthy();
               }
            }

            jest.runAllTimers();

            expect( setTimeout ).toHaveBeenCalled();
         });
      });
   });
});
