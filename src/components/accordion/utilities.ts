/// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
export function randomIdGenerator( length: number = 8 ): string  {
   const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
   const charactersLength: number = characters.length;
   let result: string = '';

   for( let i = 0; i < length; i++ )  {
      result += characters.charAt( Math.floor( Math.random() * charactersLength ) );
   }

   return result;
}

export function assignNewUniqueIdToElement( element: HTMLElement )  {
   let randomId = randomIdGenerator();

   // eslint-disable-next-line no-constant-condition
   while( true )  {
      ///no element found
      if( !document.getElementById( randomId ) )  break

      randomId = randomIdGenerator();
   }

   element.id = randomId;
}

export function isHTMLElement( element: unknown ): element is HTMLElement {
   return element instanceof HTMLElement
}

export function smoothTransitionAfterRepaint( element: HTMLElement, beforeTransition?: CallableFunction, afterTransition?: CallableFunction ) {
   // because of repaint, we have to do this for smooth transition
   requestAnimationFrame(() => {
      requestAnimationFrame(() => {
         if( typeof beforeTransition === 'function' ) beforeTransition();
         element.addEventListener( 'transitionend', transitionEndEventCallback );
      });
   });

   function transitionEndEventCallback() {
      if( typeof afterTransition === 'function' ) afterTransition();
      element.removeEventListener( 'transitionend', transitionEndEventCallback, false );
   }
}
