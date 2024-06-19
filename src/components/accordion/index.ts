import "./accordion.css";
import JscAccordion from "./accordion";
import { addAccordionEvents, convertHTMLToAccordion } from "./browser";

declare global {
   //eslint-disable-next-line @typescript-eslint/no-explicit-any
   interface Window { JscAccordion: any }
}

///exposing class
window.JscAccordion = JscAccordion

addAccordionEvents();

if( document.readyState === 'complete' || document.readyState === 'interactive' ) {
   convertHTMLToAccordion();
} else {
   document.addEventListener( 'DOMContentLoaded', () => {
      convertHTMLToAccordion();
   });
}

export * from "./accordion"
export default JscAccordion;
