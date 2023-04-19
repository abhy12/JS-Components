import { browserSetup } from "./browser";
import { PREFIX, CONTAINER_ATTR, ACCORDION_ITEM_CONTAINER_SELECTOR, ACCORDION_SELECTOR, TRIGGER_SELECTOR, ACCORDION_ITEM_CONTAINER_ATTR, initAccordion } from "./core";
import { accordionToggle, accordionToggleEventHandler, getClosestTriggers, getAllAssociateTriggers, Trigger } from "./trigger";

interface AccordionInterface {
   container: string | HTMLElement | null | undefined,
   containerIsAccordion?: boolean,
   accordionItemContainer?: string,
   accordionEl?: string,
   button: string | Element | HTMLElement | HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement> | (HTMLElement | string)[] | undefined | null,
   collapsed?: boolean,
   collapseText?: string | undefined,
   expendText?: string | undefined,
   buttonPreventDefault?: boolean
}

export default class JscAccordion implements AccordionInterface {
   container: HTMLElement;
   ///for backward compatibility
   containerIsAccordion: boolean | undefined;
   accordionItemContainer: string;
   accordionEl: string | undefined;
   collapsed: boolean;
   button: AccordionInterface['button'];
   collapseText: AccordionInterface['collapseText'];
   expendText: string;
   buttonPreventDefault: boolean = true;

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

      if( this.containerIsAccordion === false )  {
         ///needs to be string for searching accordion item container
         if( typeof args.accordionItemContainer === "string" )  {
            this.accordionItemContainer = args.accordionItemContainer;
         } else {
            ///default
            this.accordionItemContainer = ACCORDION_ITEM_CONTAINER_SELECTOR;
         }

         ///accordionEl can only be string if it's something else don't do anything,
         ///doing this because we want to find the accordion inside the container
         ///we can't do this by element so it has to be a string
         if( typeof args.accordionEl === "string" )  {
            this.accordionEl = args.accordionEl;
         } else {
            ///default
            this.accordionEl = ACCORDION_SELECTOR;
         }

         ///it has be a string for searching the trigger inside the container
         if( typeof args.button === "string" )  {
            this.button = args.button;
         } else {
            ///default
            this.button = TRIGGER_SELECTOR;
         }
      } else {
         ///button can have any other valid values other than only string if
         ///the containerIsAccordion set to true
         if( args.button )  this.button = args.button;
      }

      if( args.buttonPreventDefault === false )  this.buttonPreventDefault = false;

      const containerCollapseAttributeValue = this.container.getAttribute( "data-collapse" );

      ///if arg collapsed is undefined then check if html attribute has the value of "false" and
      ///if it does then the collapsed will be false.
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
      this.container.setAttribute( CONTAINER_ATTR, "true" );

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
            this._initTrigger( trigger, containerId );
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

               this._initTrigger( btn, containerId );
            });
         }
      } else {
         ///find all the accordion inside item container
         const accordionItemsContainer = this.container.querySelectorAll( `${this.accordionItemContainer}` ) as NodeListOf<HTMLElement>;
         const accordions = this.container.querySelectorAll( `${this.accordionItemContainer} ${this.accordionEl}` ) as NodeListOf<HTMLElement>;

         ///add accordion item attribute to every accordion item container
         accordionItemsContainer.forEach( itemContainer =>  itemContainer.setAttribute( ACCORDION_ITEM_CONTAINER_ATTR, "true" ) );

         ///init each accordion and trigger
         accordions.forEach( ( accordion ) => {
            initAccordion( accordion );

            let trigger: Trigger = null;

            if( typeof this.button === "string" )  {
               ///if set then find all the associate triggers
               if( accordion.id )  {
                  trigger = getAllAssociateTriggers( accordion, this.button );
               }
               ///if not get all the closest triggers
               else {
                  trigger = getClosestTriggers( accordion, this.button );
               }
            }

            if( trigger )  {
               trigger.forEach( trigger =>  {
                  this._initTrigger( trigger, accordion.id );
               });
            }
         });
      }
   }

   _initTrigger( trigger: HTMLElement, targetId: string )  {
      trigger.setAttribute( `data-${PREFIX}-target`, targetId );
      trigger.setAttribute( 'aria-expanded', `${!this.collapsed}` );
      trigger.setAttribute( 'aria-controls', targetId );

      if( this.buttonPreventDefault === false )  trigger.setAttribute( `data-${PREFIX}-preventdefault`, 'false' );

      let collapseOrExpendText: string | null;

      if( this.collapsed )  {

         if( this.collapseText !== undefined )  {
            collapseOrExpendText = this.collapseText;
         } else {
            collapseOrExpendText = trigger.getAttribute( 'data-collapsetext' );
         }

         trigger.classList.add( 'collapsed' );

      } else {
         if( this.expendText !== undefined )  {
            collapseOrExpendText = this.expendText;
         } else {
            collapseOrExpendText = trigger.getAttribute( 'data-expendtext' );
         }
      }

      if( collapseOrExpendText !== null )  trigger.innerText = collapseOrExpendText;
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

browserSetup();
