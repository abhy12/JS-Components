# Light weight and Simple Accordion

## Intro
You can use this Accordion in **two ways or both ways** at same time.  

**First way** is [HTML Way](#html-way) which can ***"automatically convert your existing HTML to working Accordion"*** for this to work you have to follow certain html "structure", look [HTML Way](#html-way) to find out more.  

**Second way** to create anything a Accordion see [Class based Accordion](#class-based-way).


## Installation
**CDN**
```html
<script src="https://cdn.jsdelivr.net/npm/@js-components/accordion@1/accordion.min.js"></script>
```

**NPM**
```bash
npm install @js-components/accordion@1
```
**Import Accordion**
```javascript
import JscAccordion from "@js-components/accordion";
```

## HTML Way
It will convert your existing HTML to working **"Accordion"**.  
***If you have not installed see [installation](#installation) section***

### Basic structure

```html
<div data-jsc-accordion-container=""><!-- container -->
   <div data-jsc-accordion-item=""><!-- accordion item wrapper -->
      <h1><button data-jsc-target="">Toggle Accordion</button></h1><!-- trigger -->
      <div data-jsc-accordion=""><!-- accordion -->
         <!-- content here -->
      </div>
   </div>
   <div data-jsc-accordion-item=""><!-- accordion item wrapper -->
      <h1><button data-jsc-target="">Toggle Accordion</button></h1><!-- trigger -->
      <div data-jsc-accordion=""><!-- accordion -->
         <!-- content here -->
      </div>
   </div>
</div>
```

### Change button text on collapse or expend state
```html
<h1>
   <button data-collapsetext="collapse" data-expendtext="Expend">Collapse</button>
</h1>
```

And that's it eveything will be working fine now 🎉.

***Additional Notes:***
* You can add `data-jsc-target` dataset with the value of accordion id to any button you like to trigger the accordion.
* If you add `data-jsc-accordion=""` dataset with the value of "false" to the accordion then the accordion will not work.
* Add ``data-jsc-preventDefault=""`` dataset to your trigger(s) or button(s) a value of false or empty if you want it to ``preventDefault`` or not.


## Class based way
***If you have not installed see [installation](#installation) section***

**Example HTML structure**

```html
<div id="accordion-container"><!-- container -->
   <div class="item"><!-- accordion item wrapper -->
      <h1><button class="trigger">Toggle Accordion</button></h1><!-- trigger -->
      <div class="accordion"><!-- accordion -->
         <!-- content here -->
      </div>
   </div>
   <div class="item"><!-- accordion item wrapper -->
      <h1><button class="trigger">Toggle Accordion</button></h1><!-- trigger -->
      <div class="accordion"><!-- accordion -->
         <!-- content here -->
      </div>
   </div>
</div>
```

**Create an instance of Accordion**

```javascript
const newAccordion = new JscAccordion({	
   container: "#accordion-container",
   ///for backward compatibility
   containerIsAccordion: false,
   item: ".item",
   accordion: ".accordion",
   button: ".trigger",
});
```

### APIs
<table>
<tr>
<td> API </td> <td> Usage </td> <td> Description </td>
</tr>
<tr>
<td> container </td>
<td>
   
```javascript
{
   ///CSS selector or DOM element
   container: ".accordion-container"
}
```
<td>Container which has all the accordions inside.</td>
</td>
</tr>  
<tr>
<td> containerIsAccordion </td>
<td>

```javascript
{
   ///Boolean
   ///default "true"
   ///for backward compatibility
   container: false
}
```
<td>If true then the whole container will be an Accordion.</td>
</td>
</tr>
<tr>
<td> item </td>
<td>

```javascript
{
   ///string
   ///default [data-jsc-accordion-item]
   item: ".accordion-item"
}
```
<td>Accordion item wrapper selector. It has to wrap each accordion in it.</td>
</td>
</tr>
<tr>
<td> accordion </td>
<td>

```javascript
{
   ///string
   ///default [data-jsc-accordion]
   item: ".accordion"
}
```
<td>Selector which will be an accordion.</td>
</td>
</tr>
<tr>
<td> button </td>
<td>
   
```javascript
{
   ///CSS selector or DOM element(s) 
   ///and [] of CSS selectors
   button: "#acc-btn"
}
```
</td>
<td>You can use single selector as a accordion toggle button or collection of HTML element in array or DOM elements nodes.  

**Note**: you can use either multiple values of DOM query string selector or DOM elements nodes, not both at same time as button property value.</td>
</tr>
<tr>
<td> collapsed </td>
<td>
   
```javascript
{
   //boolean
   //default "true"
   collapsed: true
}
```
</td>
<td>Whether you want accordion to be collapsed or not, default is true.</td>
</tr>
<tr>
<td> collapseText </td>
<td>
   
```javascript
{
   //string
   collapseText: "Expend"
}
```
</td>
<td>If accordion is collapsed then the text of button can be replace by this property value.</td>
</tr>
<tr>
<td> expendText </td>
<td>
   
```javascript
{
   //string
   expendText: 'Collapse'
}
```
</td>
<td>If accordion is expended then the text of button can be replace by this property value.</td>
</tr>
<tr>
<td> buttonPreventDefault </td>
<td>

```javascript
{
   //boolean
   //default "true"
   buttonPreventDefault: true
}
```
</td>
<td>Whether if you want the accordion 'button' to PreventDefault.
Default value is true.</td>
</tr>
</table>  
