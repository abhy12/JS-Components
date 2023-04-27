import { PREFIX, initAccordion, ACCORDION_ATTR } from "@js-components/accordion/core";

test( "prefix should not be empty string", () =>  {
   expect( typeof PREFIX ).toEqual( "string" );
   expect( PREFIX.length ).toBeGreaterThan( 0 );
});

describe( "initAccordion", () =>  {
   let accordionEl: HTMLElement;

   beforeEach(() =>  {
      // document.body.innerHTML = '';
      accordionEl = document.createElement( "div" );
   });

   it( "assign new id if accordion don't have one", () =>  {
      expect( accordionEl.id ).toBe( "" );

      initAccordion( accordionEl );

      expect( accordionEl.id ).not.toBe( "" );
   });

   it( "don't assign new id if accordion have one", () =>  {
      accordionEl.id = "newAcID";

      initAccordion( accordionEl );

      expect( accordionEl.id ).toEqual( "newAcID" );
   });

   it( "not change accordion attribute value 'false' to anything new", () =>  {
      accordionEl.setAttribute( ACCORDION_ATTR, "false" );

      initAccordion( accordionEl );

      expect( accordionEl.getAttribute( ACCORDION_ATTR ) ).toEqual( "false" );
   });

   it( "add true to accordion attribute value if it's value is any other than false", () =>  {
      accordionEl.setAttribute( ACCORDION_ATTR, '' );

      initAccordion( accordionEl );

      expect( accordionEl.getAttribute( ACCORDION_ATTR ) ).toEqual( "true" );
   });

   it( "sets accordion data collapse to true by default", () =>  {
      initAccordion( accordionEl );

      expect( accordionEl.getAttribute( "data-collapse" ) ).toEqual( "true" );
   });

   it( "sets accordion data collapse to true", () =>  {
      initAccordion( accordionEl, true );

      expect( accordionEl.getAttribute( "data-collapse" ) ).toEqual( "true" );
   });

   it( "sets accordion data collapse to false", () =>  {
      initAccordion( accordionEl, false );

      expect( accordionEl.getAttribute( "data-collapse" ) ).toEqual( "false" );
   });

   it( "hides accordion if initial collapse is true", () =>  {
      initAccordion( accordionEl, true );

      expect( accordionEl.style.display ).toEqual( "none" );
   });

   it( "not hide accordion if initial collapse is false", () =>  {
      initAccordion( accordionEl, false );

      expect( accordionEl.style.display ).not.toEqual( "none" );
   });
});
