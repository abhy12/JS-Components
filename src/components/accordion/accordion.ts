import { convertHTMLToAccordion } from "./browser";
import { PREFIX } from "./core";
import { accordionToggle, accordionToggleEventHandler } from "./trigger";
import { assignNewIdToElement } from "./utilities";

interface AccordionInterace  {
   container: string | HTMLElement,
   button: string | Element | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement> | (HTMLElement| string)[] | undefined | null,
   collapsed?: boolean | undefined,
   collapseText?: string | undefined,
   expendText?: string | undefined,
   buttonPreventDefault?: boolean
}

export default class JscAccordion implements AccordionInterace {
   container: HTMLElement;
   collapsed: boolean;
   button: AccordionInterace['button'];
   collapseText: AccordionInterace['collapseText'];
   expendText: string;
   buttonPreventDefault: boolean = true;

   constructor( args: AccordionInterace )  {
      let tempContainer: HTMLElement | string = args.container;

      if( typeof tempContainer === 'string' )  {
         tempContainer = ( document.querySelector( tempContainer ) as HTMLElement );
      }

      ///not an element
      if( !( tempContainer instanceof HTMLElement ) )  return

      this.container = tempContainer;

      ///trigger
      if( args.button ) this.button = args.button;

      if( args.buttonPreventDefault === false )  this.buttonPreventDefault = false

      const containerCollapseAttributeValue = this.container.getAttribute( 'data-collapse' );

      ///if undefined check if html attribute has the value
      ///attribute value needs to be exactly equal to "false" for changing the collapse value
      if( ( args.collapsed === undefined && containerCollapseAttributeValue === "false" ) || args.collapsed === false )  {
         this.collapsed = false;
      } else {
         ///default
         this.collapsed = true;
      }

      this._init();
   }

   _init()  {
      if( !this.container ) return

      this.container.style.overflow = 'hidden';

      ///set new id if the container don't have one
      if( this.container.id === '' )  {
        assignNewIdToElement( this.container );
      }

      if( this.container.getAttribute( `data-${PREFIX}-accCon` ) === null || this.container.getAttribute( `data-${PREFIX}-accCon` ) !== 'false' )  {
         ///set accordion data
         this.container.setAttribute( `data-${PREFIX}-accCon`, 'true' );
      }

      this.container.setAttribute( 'data-collapse', this.collapsed + '' );

      ///hide the element
      if( this.collapsed )  this.container.style.display = 'none';

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

//@ts-ignore
///exposing class
window.JscAccordion = JscAccordion

document.addEventListener( "DOMContentLoaded", () =>  {
   ///convert all exisiting accordion html to working accordion
   convertHTMLToAccordion();

   ///add click event for accordion trigger to the body for event Bubbling
   document.body.addEventListener( "click", accordionToggleEventHandler );
});
