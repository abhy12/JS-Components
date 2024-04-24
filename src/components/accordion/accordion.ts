import { PREFIX, COLLAPSE_ATTR, CONTAINER_ATTR, ACCORDION_ITEM_WRAPPER_ATTR, initAccordion, TOGGLE_TYPE_ATTR, TRANSITION_TIME, getTransitionDuration, DURATION_ATTR } from "./core";
import { toggleAccordion, getClosestTriggers, getAllAssociateTriggers, TriggerInterface, initTrigger } from "./trigger";

export interface AccordionInterface {
   container: string | HTMLElement | null | undefined,
   containerIsAccordion?: boolean,
   item?: string,
   accordionElWrapper?: string,
   accordionEl?: string,
   firstElExpend?: boolean,
   button: string | Element | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement> | ( HTMLElement | string )[] | undefined | null,
   collapsed?: boolean,
   type?: 'accordion' | 'toggle',
   duration?: number,
}

export default class JscAccordion implements AccordionInterface {
   container: HTMLElement;
   ///for backward compatibility
   containerIsAccordion: boolean | undefined;
   ///deprecated
   item?: string | undefined;
   accordionElWrapper: string;
   accordionEl: string | undefined;
   collapsed: boolean;
   button: AccordionInterface['button'];
   firstElExpend: boolean = true;
   type?: 'accordion' | 'toggle' = 'accordion';
   duration: number;

   constructor( args: AccordionInterface )  {
      //return if falsy value
      if( !args.container )  return

      let tempContainer: Element | string | null = args.container;

      if( typeof tempContainer === "string" )  {
         tempContainer = document.querySelector( tempContainer );
      }

      ///don't do anything if container is not an element
      if( !( tempContainer instanceof HTMLElement ) )  return

      this.container = tempContainer;
      this.containerIsAccordion = args.containerIsAccordion;

      ///container is not an accordion
      if( this.containerIsAccordion === false )  {
         if( typeof args.item === "string" && args.item !== '' )  {
            this.accordionElWrapper = args.item;
         } else if( typeof args.accordionElWrapper === "string" && args.accordionElWrapper !== '' )  {
            this.accordionElWrapper = args.accordionElWrapper;
         }

         ///accordion element is required if container is not an accordion
         if( typeof args.accordionEl !== "string" || args.accordionEl === '' )  {
            return
         } else {
            this.accordionEl = args.accordionEl;
         }

         ///it has be a string for searching the trigger inside the container
         if( typeof args.button === "string" )  {
            this.button = args.button;
         }

         if( args.firstElExpend === false )  this.firstElExpend = false;

         if( args.type === "toggle" )  this.container.setAttribute( TOGGLE_TYPE_ATTR, "toggle" );

      } else {
         ///button can have any other valid values other than only string if
         ///the containerIsAccordion set to true
         if( args.button )  this.button = args.button;
      }

      const containerCollapseAttributeValue = this.container.getAttribute( COLLAPSE_ATTR );

      ///set collapsed to html attribute value if value is "false" and collapsed arg is undefined
      if( ( args.collapsed === undefined && containerCollapseAttributeValue === "false" ) || args.collapsed === false )  {
         this.collapsed = false;
      } else {
         ///default
         this.collapsed = true;
      }

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
      this.container.setAttribute( CONTAINER_ATTR, "true" );
      this.container.setAttribute( DURATION_ATTR, '' + this.duration );

      ///make container an accordion
      if( this.containerIsAccordion !== false )  {
         initAccordion( this.container, this.collapsed );
         const containerId = this.container.id;

         if( !this.button )  return

         let trigger: null | HTMLElement = null;

         if( this.button instanceof HTMLElement )  {
            trigger = this.button;
         } else if( typeof this.button === "string" )  {
            trigger = document.querySelector( this.button );
         }

         if( trigger )  {
            initTrigger( trigger, containerId, this.collapsed );
            return
         }

         if( this.button instanceof HTMLCollection || this.button instanceof NodeList || this.button instanceof Array )  {
            ///@ts-ignore
            const btns = Array.from( this.button );

            btns.forEach( ( el ) => {
               if( el instanceof HTMLCollection || el instanceof NodeList )  return

               let btn: any = el;

               if( typeof btn === 'string' )  {
                  btn = document.querySelector( btn );
               }

               if( !btn )  return

               initTrigger( btn, containerId, this.collapsed );
            });
         }
      }
      else if( this.containerIsAccordion === false )  {
         ///required
         if( !this.accordionEl )  return

         ///if accordion wrapper is not defined then select every direct children of the container
         const wrapperSelector = this.accordionElWrapper ? this.accordionElWrapper : '*';
         const accordionElWrappers = this.container.querySelectorAll( `:scope > ${wrapperSelector}` ) as NodeListOf<HTMLElement>;

         for( let i = 0; i < accordionElWrappers.length; i++ )  {
            const accordion = accordionElWrappers[i].querySelector( `:scope > ${this.accordionEl}` ) as HTMLElement | null;

            if( !accordion )  continue

            ///if accordion is found have then this element is an accordion wrapper
            accordionElWrappers[i].setAttribute( ACCORDION_ITEM_WRAPPER_ATTR, "true" );

            ///// start initialization of accordion and trigger(s) /////

            let collapsed: boolean;

            if( i !== 0 )  {
               collapsed = true;
            }
            else {
               ///first element should be expended depending on the arguments
               ///default true
               collapsed = !this.firstElExpend;
            }

            let trigger: TriggerInterface = null;

            if( typeof this.button === "string" )  {
               ///if ID is set then find all the associate triggers
               if( accordion.id )  {
                  trigger = getAllAssociateTriggers( accordion, this.accordionElWrapper, this.button );
               }
               ///if not get all the closest triggers
               else {
                  trigger = getClosestTriggers( accordion, this.accordionElWrapper, this.button );
               }
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
