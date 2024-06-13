import { PREFIX, CONTAINER_ATTR, ACCORDION_ITEM_WRAPPER_ATTR, initAccordion, TOGGLE_TYPE_ATTR, TRANSITION_TIME, getTransitionDuration, DURATION_ATTR, ACCORDION_SELECTOR, INIT_CLASSNAME, ACCORDION_ITEM_WRAPPER_SELECTOR, DURATION_CSS_VAR, COLLAPSED_CSS_CLASS, EXPENDED_CSS_CLASS, findAccordionWithPosition, DATA_WRAPPER_SELECTOR_ATTR, DATA_ACCORDION_SELECTOR_ATTR, DATA_TRIGGER_SELECTOR_ATTR, TRIGGER_SELECTOR } from "./core";
import { toggleAccordion, getClosestTriggers, getAllAssociateTriggers, initTrigger, expendAccordion, collapseAccordion } from "./trigger";

export interface AccordionArgs {
   container: string | HTMLElement,
   accordionElWrapper?: string,
   accordionEl?: string,
   firstElExpend?: boolean,
   button?: string,
   type?: 'accordion' | 'toggle',
   duration?: number,
}

export interface AccordionInterface {
   initiated: boolean,
}

export default class JscAccordion implements AccordionInterface {
   container: HTMLElement
   accordionElWrapper
   accordionEl
   firstElExpend = true
   button
   type: AccordionArgs['type'] = 'accordion';
   duration
   initiated = false

   constructor( args: AccordionArgs )  {
      //return if falsy value
      if( !args || !args.container ) return this

      let tempContainer: Element | string | null = args.container;

      if( typeof tempContainer === "string" )  {
         tempContainer = document.querySelector( tempContainer );
      }

      ///don't do anything if container is not an element
      if( !( tempContainer instanceof HTMLElement ) ) return this
      this.container = tempContainer;

      if( typeof args.accordionElWrapper === "string" && args.accordionElWrapper !== '' ) {
         this.accordionElWrapper = args.accordionElWrapper;
      }

      if( typeof args.accordionEl === "string" && args.accordionEl !== '' ) {
         this.accordionEl = args.accordionEl;
      }

      if( typeof args.button === "string" ) {
         this.button = args.button;
      }

      if( args.firstElExpend === false ) this.firstElExpend = false;

      if( args.type === "toggle" ) this.container.setAttribute( TOGGLE_TYPE_ATTR, "toggle" );

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

      const wrapperSelector = this.accordionElWrapper ? this.accordionElWrapper : ACCORDION_ITEM_WRAPPER_SELECTOR;
      const accordionElWrappers = this.container.querySelectorAll( wrapperSelector );
      const accordionElSelector = this.accordionEl ? this.accordionEl : ACCORDION_SELECTOR;
      const accordionParents: HTMLElement[] = [];

      // add selector args to data attribute
      this.container.setAttribute( DATA_WRAPPER_SELECTOR_ATTR, wrapperSelector );
      this.container.setAttribute( DATA_ACCORDION_SELECTOR_ATTR, accordionElSelector );
      this.container.setAttribute( DATA_TRIGGER_SELECTOR_ATTR, this.button ? this.button : TRIGGER_SELECTOR );

      for( let i = 0; i < accordionElWrappers.length; i++ ) {
         const wrapper = accordionElWrappers[i];
         const accordion = wrapper.querySelector( accordionElSelector );
         const closestWrapper = accordion?.closest( wrapperSelector );

         if(
            //make sure the wrapper is not a nested wrapper
            closestWrapper !== wrapper
            || !( accordion instanceof HTMLElement )
            || !( wrapper instanceof HTMLElement )
            || !wrapper.parentElement
         ) continue

         ///if accordion is found have then this element is an accordion wrapper
         wrapper.setAttribute( ACCORDION_ITEM_WRAPPER_ATTR, "true" );

         ///// start initialization of accordion and trigger(s) /////

         let collapsed: boolean;

         if( i > 0 && accordionParents.includes( wrapper.parentElement ) ) {
            collapsed = true;
         } else {
            accordionParents.push( wrapper.parentElement );
            collapsed = this.firstElExpend === false;
         }

         let trigger;

         if( typeof this.button === "string" ) {
            if( accordion.id )  {
               trigger = getAllAssociateTriggers( accordion, wrapper, wrapperSelector, this.button );
            } else if( !accordion.id ) {
               trigger = getClosestTriggers( wrapper, wrapperSelector, this.button );
            }
         } else if( !this.button ) {
            trigger = getClosestTriggers( wrapper );
         }

         if( collapsed ) {
            wrapper.classList.add( COLLAPSED_CSS_CLASS );
         } else if( collapsed === false ) {
            wrapper.classList.add( EXPENDED_CSS_CLASS );
         }

         ///it has to be done after selecting trigger
         initAccordion( accordion, collapsed );

         if( trigger )  {
            trigger.forEach( trigger =>  {
               initTrigger( trigger, accordion.id, collapsed );
            });
         }
      }
   }

   enable()  {
      this.container?.setAttribute( `data-${PREFIX}-accCon`, 'true' );
   }

   disable()  {
      this.container?.setAttribute( `data-${PREFIX}-accCon`, 'false' );
   }

   /**
    * @param accordionPosition position number of the accordion from top
    * @returns boolean whether if succeed or not
    * @description expend/open accordion
    */
   expend( accordionPosition : number ) {
      if( this.container ) {
         const accordion = findAccordionWithPosition( this.container, accordionPosition );

         if( accordion ) return expendAccordion( accordion );
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
    * @description collapse/close or expend/open, depending on the current state of accordion
    */
   toggle( accordionPosition: number ) {
      if( this.container ) {
         const accordion = findAccordionWithPosition( this.container, accordionPosition );

         if( accordion ) return toggleAccordion( accordion );
      }

      return false
   }
}
