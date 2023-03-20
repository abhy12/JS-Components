const PREFIX = 'jsc';
const ACCORDIONSELECTOR = `[data-${PREFIX}-accCon]`;
let toggleTimeoutId: ReturnType<typeof setTimeout>;

///credit https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function randmoId( length: number = 8 )  {
   let result           = '';
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;

   for( let i = 0; i < length; i++ )  {
      result += characters.charAt( Math.floor( Math.random() * charactersLength ) );
   }

   return result;
}

interface AccordionArgs  {
   container: string | HTMLElement,
   button?: string | Element | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement> | (HTMLElement| string)[] | undefined | null,
   collapsed?: boolean | undefined,
   collapseText?: string | undefined,
   expendText?: string | undefined,
}

export default class JscAccordion  {
   container: HTMLElement | null = null;
   collapsed: boolean;
   button: AccordionArgs['button'];
   collapseText: AccordionArgs['collapseText'];
   expendText: AccordionArgs['expendText'];

   constructor( args: AccordionArgs )  {
      let tempCon: HTMLElement | string = args.container;

      ///check if container value is htmlElement or some DOM query string
      if( typeof tempCon === 'string' )  {
         tempCon = ( document.querySelector( tempCon ) as HTMLElement );
      }

      ///if container argument is falsey return
      if( !tempCon || ( tempCon instanceof HTMLElement ) === false ) return

      this.container = tempCon;

      ///trigger
      if( args.button ) this.button = args.button;

      ///if collapsed argument is defined and have boolean a value then change the collapsed value
      ///otherwise it can be change via html.
      ///it will not overwrite the html value when you defined collapsed value argument.
      if( args.collapsed !== undefined )  {
         if( !args.collapsed )  {
            this.collapsed = false;
         } else if( args.collapsed === true )  {
            this.collapsed = true;
         }
      }

      this._init();
   }

   _init()  {
      if( !this.container ) return

      this.container.style.overflow = 'hidden';

      ///set new id if the container don't have one
      if( this.container.id === '' )  {
         let id = randmoId();

         while( true )  {
            if( document.getElementById( id ) )  {
               id = randmoId();
               continue
            }
            break
         }

         this.container.id = `${PREFIX}${id}`;
      }

      ///set accordion data
      if( this.container.getAttribute( `data-${PREFIX}-accCon` ) === null || this.container.getAttribute( `data-${PREFIX}-accCon` ) !== 'false' )  {
         this.container.setAttribute( `data-${PREFIX}-accCon`, 'true' );
      }

      ///if collapsed value is undefined change the value to html collapse value default is true
      if( this.collapsed === undefined )  {
         const collapseValue = this.container.getAttribute( 'data-collapse' );
         if( collapseValue === 'false' )  {
            this.collapsed = false;
         } else {
            this.collapsed = true;
         }
      }

      this.container.setAttribute( 'data-collapse', this.collapsed + '' );

      ///if the collapse value is true hide the element
      if( this.collapsed ) this.container.style.display = 'none';

      this._init_target();
   }

   _init_target()  {
      if( !this.button ) return

      let trigger: any = null;

      if( this.button instanceof HTMLElement )  {
         trigger = this.button;
      } else if( typeof this.button === 'string' )  {
         trigger = document.querySelector( this.button );
      }

      if( trigger )  {
         this._finalizeTarget( trigger );
         return
      }

      if( this.button instanceof HTMLCollection || this.button instanceof NodeList || this.button instanceof Array )  {
         //@ts-ignore
         const btns = Array.from( this.button );

         btns.forEach( ( el ) => {
            if( el instanceof HTMLCollection || el instanceof NodeList ) return

            let btn: any = el;

            if( typeof btn === 'string' )  {
               btn = document.querySelector( btn );
            }

            if( !btn ) return

            this._finalizeTarget( btn );
         });
      }
   }

   _finalizeTarget( target: HTMLElement )  {
      // @ts-ignore
      const containerId = this.container.id;

      target.setAttribute( `data-${PREFIX}-target`, containerId );
      target.setAttribute( 'aria-expanded', `${!this.collapsed}` );
      target.setAttribute( 'aria-controls', containerId );

      let text: string | null;

      if( this.collapsed )  {

         if( this.collapseText !== undefined )  {
            text = this.collapseText;
         } else {
            text = target.getAttribute( 'data-collapsetext' );
         }

         target.classList.add( 'collapsed' );
      } else {

         if( this.expendText !== undefined )  {
            text = this.expendText;
         } else {
            text = target.getAttribute( 'data-expendtext' );
         }
      }

      if( text !== null ) target.innerText = text;
   }

   enable()  {
      this.container?.setAttribute( `data-${PREFIX}-accCon`, 'true' );
   }

   disable()  {
      this.container?.setAttribute( `data-${PREFIX}-accCon`, 'false' );
   }

   toggle()  {
      if( !( this.container instanceof HTMLElement ) ) return

      accordionToggle( this.container );
   }
}


function accordionToggle( accordion: HTMLElement )  {
   ///whether container is collapsed
   let isCollapse = accordion.dataset.collapse === 'true' ? true : false;
   ///adding 60ms more for transition bug
   const transitionTime = 300 + 60;
   ///save the height of futher use
   let acHeight = accordion.offsetHeight;

   if( accordion.classList.contains( 'colexping' ) ) return
   ///add a class to accordion
   accordion.classList.add( 'colexping' );

   ///just a measure for unkown transition bugs won't happen
   ///when previous setTimeout is not happend already
   ///see below setTimeout for more
   clearTimeout( toggleTimeoutId );

   ///deducting 60ms for transition bug
   accordion.style.transition = `height ${transitionTime - 60}ms ease-in-out`;
   toggleTimeoutId = setTimeout( () => {
      accordion.style.transition = '';
   },
   transitionTime );

   if( isCollapse )  {
      //it will change the whatever display the element has before
      accordion.style.display = '';

      ///to get the full height of the element
      accordion.style.height = 'auto';

      ///not using this method for now might be using this in future
      // accordion.setAttribute('style', 'height:auto !important');

      ///update the height because if accordion is collapsed
      ///previous value has to be 0 and we need the current height 
      ///of the accordion for further use
      acHeight = accordion.offsetHeight;

      ///immediately change the element height to 0
      accordion.style.height = '0';

      ///wait just a little bit for animation to work properly
      setTimeout( () =>  {
         accordion.style.height = acHeight + 'px';
      }, 0 );

      ///after animation change inline height to nothing
      setTimeout( () =>  {
         accordion.style.height = '';
         accordion.classList.remove( 'colexping' );
      }, transitionTime );

      accordion.dataset.collapse = 'false';

      isCollapse = false;

   } else if( !isCollapse )  {

      accordion.style.height = acHeight + 'px';

      setTimeout( () =>  {
         accordion.style.height = '0';
      }, 5 );

      setTimeout( () =>  {
         accordion.style.display = 'none';
         accordion.style.height = '';
         accordion.classList.remove( 'colexping' );
      }, transitionTime );

      accordion.dataset.collapse = 'true';

      isCollapse = true;
   }

   const triggerer = document.querySelectorAll( `[data-${PREFIX}-target="${accordion.id}"]` ) as NodeListOf<HTMLElement>;

   triggerer.forEach( ( el: HTMLElement ) =>  {

      let text: undefined | string = undefined;

      if( isCollapse )  {
         text = el.dataset.collapsetext;
         el.setAttribute( 'aria-expanded', 'false' );
         el.classList.add( 'collapsed' );
      }

      if( !isCollapse )  {
         text = el.dataset.expendtext
         el.setAttribute( 'aria-expanded', 'true' );
         el.classList.remove( 'collapsed' );
      }

      text !== undefined && ( el.innerText = text );
   });
}


function accordionToggleEventHandler( e: Event )  {
   const target = e.target as HTMLElement;
   const acID: any = target.dataset[`${PREFIX}Target`];

   if( acID === null || acID === '' ) return

   const accordion = ( document.querySelector( `${ACCORDIONSELECTOR}#${acID}` ) as HTMLElement );

   if( !accordion || accordion.getAttribute( `data-${PREFIX}-accCon` ) === 'false' || accordion.classList.contains( 'colexping' ) ) return

   accordionToggle( accordion );
}

///Run necessary "things" when DOM loaded
window.onload = () =>  {
   ///add click event of accordion trigger to body for event Bubbling
   document.body.addEventListener( 'click', accordionToggleEventHandler );

   ///get all the accordion content container
   const allAccordion = document.querySelectorAll( ACCORDIONSELECTOR ) as NodeListOf<HTMLElement>;

   ///convert accordion container to "accordion"
   allAccordion.forEach( item =>  {
      let triggerer;
      const accId = item.id;

      if( accId === '' )  {
         ///not selecting all the triggerer elements
         ///because of nested accordion under the container
         triggerer = item.closest( '.jsc-accordion' )?.querySelector( `[data-${PREFIX}-target]` ) as HTMLElement;
      } else if( accId !== '' )  {
         triggerer = document.querySelectorAll( `[data-${PREFIX}-target="${item.id}"]` ) as NodeListOf<HTMLElement>;
      }

      new JscAccordion({
         container: item,
         button: triggerer,
      });
   });
}
