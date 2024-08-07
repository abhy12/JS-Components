import "./accordion.css";
import JscAccordion from "./accordion";
import { convertHTMLToAccordion } from "./browser";

if( document.readyState === 'complete' || document.readyState === 'interactive' ) {
   convertHTMLToAccordion();
} else {
   document.addEventListener( 'DOMContentLoaded', convertHTMLToAccordion );
}

declare global {
   interface HTMLElement {
      JscAccordion?: JscAccordion
   }
}

export default JscAccordion;

export * from "./accordion"
