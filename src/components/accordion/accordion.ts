import { PREFIX, CONTAINER_ATTR, ACCORDION_ITEM_WRAPPER_ATTR, initAccordion, TOGGLE_TYPE_ATTR, TRANSITION_TIME, getTransitionDuration, DURATION_ATTR, ACCORDION_SELECTOR, INIT_CLASSNAME } from "./core";
import { toggleAccordion, getClosestTriggers, getAllAssociateTriggers, initTrigger } from "./trigger";

export interface AccordionArgs {
   container: string | HTMLElement | null | undefined,
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
      if( !args.container ) return this

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

      ///it has be a string for searching the trigger inside the container
      if( typeof args.button === "string" ) {
         this.button = args.button;
      }

      if( args.firstElExpend === false ) this.firstElExpend = false;

      if( args.type === "toggle" ) this.container.setAttribute( TOGGLE_TYPE_ATTR, "toggle" );

      /// duration
      if( !args.duration ) {
         const containerDuration = getTransitionDuration( this.container );

         if( containerDuration ) {
            this.duration = containerDuration;
         } else {
            this.duration = TRANSITION_TIME;
         }

      } else if( typeof args.duration === "number" && args.duration > 0 ) {
         this.duration = args.duration;
      }

      this._init();
   }

   _init()  {
      this.initiated = true;
      this.container.setAttribute( CONTAINER_ATTR, "true" );
      this.container.setAttribute( DURATION_ATTR, '' + this.duration );
      this.container.classList.add( INIT_CLASSNAME );

      ///if accordion wrapper is not defined then select every direct children of the container
      const wrapperSelector = this.accordionElWrapper ? this.accordionElWrapper : '*';
      const accordionElWrappers = this.container.querySelectorAll( `:scope > ${wrapperSelector}` );
      const accordionElSelector = this.accordionEl ? this.accordionEl : ACCORDION_SELECTOR;

      for( let i = 0; i < accordionElWrappers.length; i++ ) {
         const wrapper = accordionElWrappers[i];
         const accordion = wrapper.querySelector( `:scope > ${accordionElSelector}` );

         if( !( accordion instanceof HTMLElement ) || !( wrapper instanceof HTMLElement ) ) continue

         ///if accordion is found have then this element is an accordion wrapper
         wrapper.setAttribute( ACCORDION_ITEM_WRAPPER_ATTR, "true" );

         ///// start initialization of accordion and trigger(s) /////

         let collapsed = !( i === 0 && this.firstElExpend !== false );

         let trigger;

         if( typeof this.button === "string" ) {
            ///if ID is set then find all the associate triggers
            if( accordion.id )  {
               trigger = getAllAssociateTriggers( accordion, wrapper, wrapperSelector, this.button );
            } else if( !accordion.id ) {
               trigger = getClosestTriggers( wrapper, wrapperSelector, this.button );
            }
         } else if( !this.button ) {
            trigger = getClosestTriggers( wrapper );
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

   toggle()  {
      if( !( this.container instanceof HTMLElement ) ) return

      toggleAccordion( this.container );
   }
}
