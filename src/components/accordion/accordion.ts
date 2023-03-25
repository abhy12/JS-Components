import { convertHTMLToAccordion } from "./browser";
import { randomIdGenerator, PREFIX } from "./utilities";
import { accordionToggle } from "./trigger";

interface AccordionArgs  {
   container: string | HTMLElement,
   button?: string | Element | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement> | (HTMLElement| string)[] | undefined | null,
   collapsed?: boolean | undefined,
   collapseText?: string | undefined,
   expendText?: string | undefined,
   buttonPreventDefault?: boolean
}

export default class JscAccordion  {
   container: HTMLElement | null = null;
   collapsed: boolean;
   button: AccordionArgs['button'];
   collapseText: AccordionArgs['collapseText'];
   expendText: AccordionArgs['expendText'];
   buttonPreventDefault: AccordionArgs['buttonPreventDefault'] = true;

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

      if( args.buttonPreventDefault === false )  this.buttonPreventDefault = false

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
         let id = randomIdGenerator();

         while( true )  {
            if( document.getElementById( id ) )  {
               id = randomIdGenerator();
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

      this._init_trigger();
   }

   _init_trigger()  {
      if( !this.button ) return

      let trigger: null | HTMLElement = null;

      if( this.button instanceof HTMLElement )  {
         trigger = this.button;
      } else if( typeof this.button === 'string' )  {
         trigger = document.querySelector( this.button );
      }

      if( trigger )  {
         this._finalizeTrigger( trigger );
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

            this._finalizeTrigger( btn );
         });
      }
   }

   _finalizeTrigger( target: HTMLElement )  {
      // @ts-ignore
      const containerId = this.container.id;

      target.setAttribute( `data-${PREFIX}-target`, containerId );
      target.setAttribute( 'aria-expanded', `${!this.collapsed}` );
      target.setAttribute( 'aria-controls', containerId );

      if( this.buttonPreventDefault === false )  target.setAttribute( `data-${PREFIX}-preventdefault`, 'false' );

      let collapseOrExpendText: string | null;

      if( this.collapsed )  {

         if( this.collapseText !== undefined )  {
            collapseOrExpendText = this.collapseText;
         } else {
            collapseOrExpendText = target.getAttribute( 'data-collapsetext' );
         }

         target.classList.add( 'collapsed' );
      } else {

         if( this.expendText !== undefined )  {
            collapseOrExpendText = this.expendText;
         } else {
            collapseOrExpendText = target.getAttribute( 'data-expendtext' );
         }
      }

      if( collapseOrExpendText !== null ) target.innerText = collapseOrExpendText;
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


///convert all exisiting accordion html to accordion
window.onload = () => convertHTMLToAccordion();
