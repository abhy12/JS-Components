import "./accordion.css";
import JscAccordion from "./accordion";
import { addAccordionEvents, convertHTMLToAccordion } from "./browser";

//@ts-ignore
///exposing class
window.JscAccordion = JscAccordion

addAccordionEvents();

document.addEventListener( 'DOMContentLoaded', () => {
   convertHTMLToAccordion( JscAccordion );
});

export * from "./accordion"
export default JscAccordion;
