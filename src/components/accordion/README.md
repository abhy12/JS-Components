# Lightweight and accessible Accordion

## Table of contents
- [Installation](#installation)
- [Get Started](#get-started)
- [HTML Way](#html-way)
- [JS Instance](#accordion-instance)
   - [APIs](#apis)
   - [Methods](#methods)

## Installation
**CDN**

JavaScript (add it to end of the body)
```html
<script src="https://cdn.jsdelivr.net/npm/@js-components/accordion@1.3.0/accordion.min.js"></script>
```
```
https://cdn.jsdelivr.net/npm/@js-components/accordion@1.3.0/accordion.min.js
```

CSS (required) for basic styling
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@js-components/accordion@1.3.0/accordion.min.css">
```
```
https://cdn.jsdelivr.net/npm/@js-components/accordion@1.3.0/accordion.min.css
```
**NPM**
```bash
npm install @js-components/accordion@1.3.0
```
**Import Accordion**
```javascript
import JscAccordion from "@js-components/accordion";
```

## Get Started
You can use this accordion in two ways or both ways at the same time.

In [first way](#html-way) you don't need to write any JS code, just add accordion HTML structure and that's it, you will have working accordion [learn more](#html-way).

[Second way](#accordion-instance) to create working accordions with the help of JS Class instance [learn more](#accordion-instance).

## HTML Way
Just add below HTML to your code and that's it, you will have working accordion.

### Basic structure

```xml
<div data-jsc-accordion-container=""><!-- container -->
   <div data-jsc-accordion-item=""><!-- accordion wrapper -->
      <h1 class="accordion-header"><!-- needed for accessibility -->
         <button class="accordion-button" data-jsc-target=""><!-- trigger -->
            <span>Accordion Example #1</span>
            <div class="accordion-icon">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                 <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
               </svg>
            </div>
         </button>
      </h1>
      <div class="accordion" data-jsc-accordion=""><!-- accordion -->
         <div class="accordion-content"><!-- content here -->
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever
         </div>
      </div>
   </div>
   <div data-jsc-accordion-item="">
      <h1 class="accordion-header">
         <button class="accordion-button" data-jsc-target="">
            <span>Accordion Example #2</span>
            <div class="accordion-icon">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                 <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
               </svg>
            </div>
         </button>
      </h1>
      <div class="accordion" data-jsc-accordion="">
         <div class="accordion-content">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever
         </div>
      </div>
   </div>
</div>
```

If you want to customize the structure please [read](#customize-accordion-structure).

***Note: if you're adding above HTML after [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event) event is fired, you will need to use [Class instance](#accordion-instance).***

## Accordion Instance

**Basic HTML structure**

```xml
<div id="accordion-container"><!-- container -->
   <div class="item"><!-- accordion wrapper -->
      <h1 class="accordion-header"><!-- needed for accessibility -->
         <button class="accordion-button trigger"><!-- trigger -->
            <span>Accordion Example #1</span>
            <div class="accordion-icon">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                 <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
               </svg>
            </div>
         </button>
      </h1>
      <div class="accordion"><!-- accordion -->
         <div class="accordion-content"><!-- content here -->
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever
         </div>
      </div>
   </div>
   <div class="item">
      <h1 class="accordion-header">
         <button class="accordion-button trigger">
            <span>Accordion Example #2</span>
            <div class="accordion-icon">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                 <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
               </svg>
            </div>
         </button>
      </h1>
      <div class="accordion">
         <div class="accordion-content">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever
         </div>
      </div>
   </div>
</div>
```

**Import Accordion**
```javascript
import JscAccordion from "@js-components/accordion";
```

**Create an instance of Accordion**

```javascript
const accordion = new JscAccordion({
   container: "#accordion-container",
   wrapper: ".item",
   accordion: ".accordion",
   trigger: ".trigger",
});
```

## Customize accordion structure

You can customize the HTML struture however you want just make sure every accordion is inside of a container, that's an element which has ```data-jsc-accordion-container``` data attribute or a container of class instance.
Every accordion have to wrap inside an accordion wrapper that's an element which has ```data-jsc-accordion-item``` data attribute or wrapper of class instance.

## APIs

### Container (required)
**type: string | HTMLElement**

```js
{
   // CSS selector || HTMLElement
   container: '#jsc-accordion-container'
}
```
Provide CSS selector or DOM element. This is the container where all the accordions lives.

<hr>

### wrapper
**type: string**

```js
{
   // default [data-jsc-accordion-item]
   wrapper: '.item', // CSS selector
}
```
Accordion wrapper selector. Only one accordion can be a working accordion inside a parent wrapper, you can make nested accordions in it, just add wrappers inside it (ofcourse with accordion).

<hr>

### accordion
**type: string**

```js
{
   // default [data-jsc-accordion]
   accordion: '.accordion', // CSS selector
}
```
This will be the accordion/panel which will open/expand or close/collapse.

<hr>

### firstElExpand
**type: boolean**

```js
{
   // default true
   firstElExpand: true, // boolean
}
```
Whether or not to expand first accordion initially. Default is `true`.

<hr>

### trigger
**type: string**

```js
{
   // default [data-jsc-target]
   trigger: '.trigger', // CSS selector
}
```
This will be the header/trigger to open/expand or close/collapse an accordion. Just make sure to wrap this element inside of any heading element for accessibility reasons.

Trigger can be skipped in an accordion struture,
because anything can be a trigger, just add this `data-jsc-target='ID'` attribute to any element that you want it to be a `trigger` and replace `ID` with unique CSS ID of the accordion.

**Example**
```html
...
..
<div id="accordion-eg-1" class="accordion">
   <div class="accordion-content">
      Lorem Ipsum is...
   </div>
</div>
..
...
<button data-jsc-target="accordion-eg-1">Toggle Accordion</button>
```

<hr>

### duration
**type: number**

```js
{
   // default 300(ms)
   duration: 400, // number
}
```
Transition duration of the accordions in millisecond.
You can also add `data-jsc-duration='500'` attribute to the container with the value in millisecond.

## Methods

### expand( position: number ): boolean

**position:** position of accordion inside a container  
**returns:** boolean whether succeed or not
**description:** open/expand accordion

```js
accordion.expand( 1 );
```

### collapse( position: number ): boolean

**position:** position of accordion inside a container  
**returns:** boolean whether succeed or not
**description:** close/collapse accordion

```js
accordion.collapse( 1 );
```

### toggle( position: number ): boolean

**position:** position of accordion inside a container  
**returns:** boolean whether succeed or not
**description:** open/expand or close/collapse accordion depends on the current state of accordion.

```js
accordion.toggle( 1 );
```
