# Light weight and Simple Accordion

## Intro
You can use this Accordion in **two ways or both ways** at same time.  

**First way** is [HTML Way](#html-way) which can ***"automatically convert your existing HTML to working Accordion"*** for this to work you have to follow certain html "structure", look [HTML Way](#html-way) to find out more.  

**Second way** to create anything a Accordion see [Class based Accordion](#class-based-way).


## Installation
**CDN**
```html
<script src="https://cdn.jsdelivr.net/npm/@js-components/accordion/accordion.min.js"></script>
```

**NPM**
```bash
npm install @js-components/accordion
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
<!-- Accordion wrapper P.S not necessary if you are going to add an appropriate ID -->
<div class="jsc-accordion">
   <!-- Always wrap button to heading tag for accessibility -->
   <h1><button data-jsc-target="ACCORDION-ID">Lorem ipsum dolor sit amet.</button></h1>
   <!-- Accordion -->
   <div id="ACCORDION-ID" data-jsc-accCon="true">
      <!-- Your content -->
   </div>
</div>
```
You can replace your own ID to "ACCORDION-ID" or you can ommit the "ACCORDION-ID" to empty string.

***Note: If you are omitting "ACCORDION-ID" the downside of this is that it will not work perfectly in nested accordion and you have to add whole accordion and button to the "jsc-accordion" wrapper element this is important step of doing this way.***

### Change button text on collapse or expend state
```html
<h1>
   <button data-collapsetext="collapse" data-expendtext="Expend">Collapse</button>
</h1>
```

And that's it eveything will be working fine now 🎉.

***Additional Notes:***
* You can add `data-jsc-target` dataset with the value of accordion id to any button you like to trigger the accordion.
* If you add `data-jsc-accCon=""` dataset with the value of "false" to the accordion then the accordion will not work.
* Add ``data-jsc-preventDefault=""`` dataset to your trigger(s) or button(s) a value of false or empty if you want it to ``preventDefault`` or not.


## Class based way
***If you have not installed see [installation](#installation) section***

**Example HTML structure**

```html
<button id="btn">Lorem ipsum dolor sit amet.</button>
<div class="new-accordion">
   <!-- Your content -->
</div>
```

**Create an instance of Accordion**

```javascript
const newAccordion = new JscAccordion({	
   container: ".new-accordion",
   button: "#btn",
   collapsed: true, ///initial default

   ///change button text on collapse or expend
   collapseText: "Collapse",
   expendText: "Expend",
});
```

**Note: you can use any document query for selecting an accordion container but if that accordion container don't have an existing ID then this Accordion instance will generate a new ID for that accordion container.**  


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
   container: ".new-accordion"
}
```
<td>You can use CSS selector or any DOM element for selecting "accordion".</td>
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

### Methods
<table>
<tr>
<td> Method </td> <td> Description </td>
</tr>
<tr>
<td>
   
```javascript
enable 
```
</td>
<td>Enable the accordion.</td>
</tr>
<tr>
<td>
   
```javascript
disable 
```
</td>
<td>Disable the accordion.</td>
</tr>
<tr>
<td>
   
```javascript
toggle
```
 </td>
<td>Toggle the accordion if accordion is collapsed then it will expend or vice versa.</td>
</tr>
</table>  
