import "./accordion.css";
import JscAccordion from "./accordion";
import { addAccordionEvents, convertHTMLToAccordion } from "./browser";

if( document.readyState === 'complete' || document.readyState === 'interactive' ) {
   convertHTMLToAccordion();
} else {
   document.addEventListener( 'DOMContentLoaded', convertHTMLToAccordion );
}

export default (() => {
   addAccordionEvents();
   return JscAccordion;
})();

export * from "./accordion"
