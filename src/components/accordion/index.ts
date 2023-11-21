import "./accordion.css";
import JscAccordion from "./accordion";
import { browserSetup } from "./browser";

//@ts-ignore
///exposing class
window.JscAccordion = JscAccordion

browserSetup( JscAccordion );

export * from "./accordion"
export default JscAccordion;
