import { assignNewUniqueIdToElement, isHTMLElement, randomIdGenerator } from "@js-components/accordion/utilities";

describe( "Random ID Generator", () =>  {
   it( "returns a random ID ", () =>  {
      expect( randomIdGenerator() ).not.toEqual( "" );
   });

   it( "returns random ID length of 8 as a default", () =>  {
      expect( randomIdGenerator().length ).toEqual( 8 );
   });

   it( "returns random ID length of 12", () =>  {
      expect( randomIdGenerator( 12 ).length ).toEqual( 12 );
   });
});

describe( "New Random ID Assigner", () =>  {
   beforeEach(() => {
      // document.body.innerHTML = '';
   });

   it( "assign new Id to an element", () =>  {
      const el = document.createElement( "div" );
      expect( el.id ).toEqual( "" );

      assignNewUniqueIdToElement( el );
      expect( el.id ).not.toEqual( "" );
   });

   it( "replace previous Id to new random Id", () =>  {
      const el = document.createElement( "div" );
      el.id = "prevID";
      expect( el.id ).toEqual( "prevID" );

      assignNewUniqueIdToElement( el );
      expect( el.id ).not.toEqual( "prevID" );
   });
});

describe( "isHTMLElement", () => {
   test( "1", () => {
      expect( isHTMLElement( 1 ) ).toBeFalsy();
   });

   test( "2", () => {
      expect( isHTMLElement( false ) ).toBeFalsy();
   });

   test( "3", () => {
      expect( isHTMLElement( document.body ) ).toBeTruthy();
   });
});
