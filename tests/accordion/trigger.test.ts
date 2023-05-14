import JscAccordion from "@js-components/accordion/accordion";
import { convertHTMLToAccordion } from "@js-components/accordion/browser";
import { ACCORDION_SELECTOR, SELECT_TRIGGER_ACCORDION } from "@js-components/accordion/core";

const accordionBrowserStructure = `
<div id="basic" data-jsc-accordion-container="">
   <div data-jsc-accordion-item="">
      <h1><button data-jsc-target="">Lorem ipsum dolor sit amet.</button></h1>
      <div data-jsc-accordion="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
   <div data-jsc-accordion-item="">
      <h1><button data-jsc-target="">Lorem ipsum dolor sit amet.</button></h1>
      <div data-jsc-accordion="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
</div>`;

const customStruture = `
<div id="eg-1">
   <div class="item">
      <h1><button>Lorem ipsum dolor sit amet.</button></h1>
      <div class="accordion">Lorem ipsum dolor sit amet consect</div>
   </div>
   <div class="item">
      <h1><button>Lorem ipsum dolor sit amet.</button></h1>
      <div class="accordion">Lorem ipsum dolor sit amet consect</div>
   </div>
</div>`;

describe( "accordion trigger", () => {
   beforeEach(() =>  {
      document.body.innerHTML = '';
   });

   describe( "checks if trigger has 'collapsed' class when accordion is collapsed initially", () => {
      test( "browser", () => {
         document.body.insertAdjacentHTML( "afterbegin", accordionBrowserStructure );

         convertHTMLToAccordion( JscAccordion );

         const accordions = document.querySelectorAll( `${ACCORDION_SELECTOR}[data-collapse="true"]` );

         accordions.forEach( accordion => {
            const trigger = document.querySelector( SELECT_TRIGGER_ACCORDION( accordion.id ) );

            if( trigger )  {
               expect( trigger.classList.contains( "collapsed" ) ).toBe( true );
            }
         });
      });

      test( "class", () => {
         document.body.insertAdjacentHTML( "afterbegin", customStruture );

         new JscAccordion({
            container: '#eg-1',
            accordionElWrapper: '.item',
            accordionEl: '.accordion',
            button: '.item button',
            containerIsAccordion: false
         });

         expect( document.querySelectorAll( "#eg-1 .item button" )[1]?.classList.contains( "collapsed" ) ).toBe( true );
      });
   });
});
