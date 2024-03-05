import { getContainer, ACCORDION_SELECTOR, DURATION_ATTR, getTransitionDuration } from "@js-components/accordion/core";
import { accordionStructure, accordionContainerId } from "./structure";

describe( "functions", () => {
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
});
