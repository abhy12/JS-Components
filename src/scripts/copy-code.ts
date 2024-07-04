document.body.addEventListener( "click", ( e ) => {
   const target = e.target;
   if( !( target instanceof Element ) ) return

   const container = target.closest( ".code-container" );
   if( !container ) return

   const code = container.querySelector( ".astro-code code" );

   if( !( code instanceof HTMLElement ) ) return

   try {
      navigator.clipboard.writeText( code.innerText.replaceAll( '`', '' ) );
   } catch ( error ) {
      console.error( error );
   }
});
