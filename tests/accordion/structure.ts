import { CONTAINER_ATTR, ACCORDION_ITEM_WRAPPER_ATTR, ACCORDION_ATTR, TRIGGER_ATTR } from "@js-components/accordion/core";

export const accordionContainerId = "basic";
export const accordionStructure= `
<div id="${accordionContainerId}" ${CONTAINER_ATTR}>
   <div ${ACCORDION_ITEM_WRAPPER_ATTR}="">
      <h1><button ${TRIGGER_ATTR}>Lorem ipsum dolor sit amet.</button></h1>
      <div ${ACCORDION_ATTR}="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
   <div ${ACCORDION_ITEM_WRAPPER_ATTR}="">
      <h1><button ${TRIGGER_ATTR}>Lorem ipsum dolor sit amet.</button></h1>
      <div ${ACCORDION_ATTR}="">
         <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
      </div>
   </div>
</div>`;

export const customContainerId = "eg-1";
export const customContainerSelector = "#" + customContainerId;
export const customItemWrapper = "item";
export const customItemWrapperSelector = "." + customItemWrapper;
export const customAccordionEl = "accordion";
export const customAccordionElSelector = "." + customAccordionEl;
export const customTrigger = "trigger";
export const customTriggerSelector = "." + customTrigger;
export const customStruture = `
<div id="${customContainerId}">
   <div class="${customItemWrapper}">
      <h1><button class="${customTrigger}">Lorem ipsum dolor sit amet.</button></h1>
      <div class="${customAccordionEl}">Lorem ipsum dolor sit amet consect</div>
   </div>
   <div class="${customItemWrapper}">
      <h1><button class="${customTrigger}">Lorem ipsum dolor sit amet.</button></h1>
      <div class="${customAccordionEl}">Lorem ipsum dolor sit amet consect</div>
      <div class="${customItemWrapper}">
         <h1><button class="${customTrigger}">Lorem ipsum dolor sit amet.</button></h1>
         <div class="${customAccordionEl}">Lorem ipsum dolor sit amet consect</div>
      </div>
   </div>
</div>`;
