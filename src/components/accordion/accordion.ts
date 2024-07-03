import { CONTAINER_ATTR, TOGGLE_TYPE_ATTR, TRANSITION_TIME, getTransitionDuration, DURATION_ATTR, ACCORDION_SELECTOR, INIT_CLASSNAME, ACCORDION_ITEM_WRAPPER_SELECTOR, DURATION_CSS_VAR, findAccordionWithPosition, DATA_WRAPPER_SELECTOR_ATTR, DATA_ACCORDION_SELECTOR_ATTR, DATA_TRIGGER_SELECTOR_ATTR, TRIGGER_SELECTOR, initWrapper } from "./core";
import { toggleAccordion, expandAccordion, collapseAccordion } from "./trigger";
import { mutationObserve } from "./browser";

export interface AccordionArgs {
   container: string | HTMLElement | Element | null | undefined,
   /** @deprecated use `wrapper` */
   accordionElWrapper?: string,
   wrapper?: string,
   /** @deprecated use `accordion` */
   accordionEl?: string,
   accordion?: string,
   /** @deprecated use `firstElExpand` */
   firstElExpend?: boolean,
   firstElExpand?: boolean,
   /** @deprecated use `trigger` */
   button?: string,
   trigger?: string,
   toggleType?: 'accordion' | 'toggle',
   /** @deprecated use `toggleType` */
   type?: AccordionArgs['toggleType'],
   duration?: number,
}

export interface AccordionInterface {
   container: HTMLElement
   wrapperSelector?: string,
   accordionSelector?: string,
   firstElExpand?: boolean,
   triggerSelector?: string,
   duration?: number,
   initiated: boolean,
   expand: ( pos: number ) => boolean,
   collapse: ( pos: number ) => boolean,
   toggle: ( pos: number ) => boolean,
}

export default class JscAccordion implements AccordionInterface {
   container: HTMLElement
   wrapperSelector
   accordionSelector
   firstElExpand = true
   triggerSelector
   duration
   initiated = false

   constructor( args: AccordionArgs ) {
      //return if falsy value
      if( !args || !args.container ) return this

      let tempContainer: Element | string | null = args.container;

      if( typeof tempContainer === "string" )  {
         tempContainer = document.querySelector( tempContainer );
      }

      ///don't do anything if container is not an element
      if( !( tempContainer instanceof HTMLElement ) ) return this
      this.container = tempContainer;

      if( typeof args.wrapper === "string" && args.wrapper !== '' ) {
         this.wrapperSelector = args.wrapper;
      } else if( typeof args.accordionElWrapper === "string" && args.accordionElWrapper !== '' ) {
         this.wrapperSelector = args.accordionElWrapper;
      }

      if( typeof args.accordion === "string" && args.accordion !== '' ) {
         this.accordionSelector = args.accordion;
      } else if( typeof args.accordionEl === "string" && args.accordionEl !== '' ) {
         this.accordionSelector = args.accordionEl;
      }

      if( typeof args.trigger === "string" ) {
         this.triggerSelector = args.trigger;
      } else if( typeof args.button === "string" ) {
         this.triggerSelector = args.button;
      }

      if( args.firstElExpand === false || args.firstElExpend === false ) this.firstElExpand = false;

      if( args.toggleType === "toggle" || args.type === "toggle" ) this.container.setAttribute( TOGGLE_TYPE_ATTR, "toggle" );

      /// duration
      if( typeof args.duration === "number" && args.duration > 0 ) {
         this.duration = args.duration;
      } else {
         const containerDuration = getTransitionDuration( this.container );

         this.duration = TRANSITION_TIME;

         if( containerDuration ) this.duration = containerDuration;
      }

      this._init();
   }

   _init()  {
      this.initiated = true;
      this.container.setAttribute( CONTAINER_ATTR, "true" );
      this.container.setAttribute( DURATION_ATTR, '' + this.duration );
      this.container.style.setProperty( DURATION_CSS_VAR, this.duration + 'ms' );
      this.container.classList.add( INIT_CLASSNAME );
      mutationObserve( this.container );

      const wrapperSelector = this.wrapperSelector ? this.wrapperSelector : ACCORDION_ITEM_WRAPPER_SELECTOR;
      const accordionElWrappers = this.container.querySelectorAll( wrapperSelector );
      const accordionElSelector = this.accordionSelector ? this.accordionSelector : ACCORDION_SELECTOR;
      const accordionParents: HTMLElement[] = [];

      // add selector args to data attribute
      this.container.setAttribute( DATA_WRAPPER_SELECTOR_ATTR, wrapperSelector );
      this.container.setAttribute( DATA_ACCORDION_SELECTOR_ATTR, accordionElSelector );
      this.container.setAttribute( DATA_TRIGGER_SELECTOR_ATTR, this.triggerSelector ? this.triggerSelector : TRIGGER_SELECTOR );

      for( let i = 0; i < accordionElWrappers.length; i++ ) {
         const wrapper = accordionElWrappers[i];

         if( !wrapper.parentElement ) continue

         let collapsed: boolean;

         if( i > 0 && accordionParents.includes( wrapper.parentElement ) ) {
            collapsed = true;
         } else {
            accordionParents.push( wrapper.parentElement );
            collapsed = this.firstElExpand === false;
         }

         initWrapper( wrapper, wrapperSelector, accordionElSelector, this.triggerSelector, collapsed );
      }
   }

   /**
    * @param accordionPosition position number of the accordion from top
    * @returns boolean whether if succeed or not
    * @description expand/open accordion
    */
   expand( accordionPosition : number ) {
      if( this.container ) {
         const accordion = findAccordionWithPosition( this.container, accordionPosition );

         if( accordion ) return expandAccordion( accordion );
      }

      return false
   }

   /**
    * @param accordionPosition position number of the accordion from top
    * @returns boolean whether if succeed or not
    * @description collapse/close accordion
    */
   collapse( accordionPosition : number ) {
      if( this.container ) {
         const accordion = findAccordionWithPosition( this.container, accordionPosition );

         if( accordion ) return collapseAccordion( accordion );
      }

      return false
   }

   /**
    * @param accordionPosition position number of the accordion from top
    * @returns boolean whether if succeed or not
    * @description collapse/close or expand/open, depending on the current state of accordion
    */
   toggle( accordionPosition: number ) {
      if( this.container ) {
         const accordion = findAccordionWithPosition( this.container, accordionPosition );

         if( accordion ) return toggleAccordion( accordion );
      }

      return false
   }
}
