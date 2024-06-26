import "./accordion.css";
import JscAccordion from "./accordion";
import { addAccordionEvents, convertHTMLToAccordion } from "./browser";

addAccordionEvents();

if( document.readyState === 'complete' || document.readyState === 'interactive' ) {
   convertHTMLToAccordion();
} else {
   document.addEventListener( 'DOMContentLoaded', convertHTMLToAccordion );
}

export * from "./accordion"
export default JscAccordion
