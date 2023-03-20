# Light weight and Simple Accordion

## Usage

**CDN:**
```html
<script src="https://cdn.jsdelivr.net/npm/@js-components/accordion/accordion.min.js"></script>
```

### Get started
After linking the accordion file you can use accordion with [HTML way](#html-way) or [class based way](#class-based-way) (either way is good but class based way give you more control over "accordion").

## HTML Way

### HTML Example 1  

Basic structure

```html
<!-- Accordion wrapper -->
<div class="jsc-accordion">
   <!-- Always wrap button to heading tag for accessibility -->
   <h1><button data-jsc-target="YOUR-ID">Lorem ipsum dolor sit amet.</button></h1>
   <!-- Accordion -->
   <div id="YOUR-ID" data-jsc-accCon="true">
      <!-- Your content -->
   </div>
</div>
```

just replace "YOUR-ID" with your own same unique html ID(without "#") and that's it eveything will be working fine now 🎉.  

#### Change button text on collapse or expend
```html
<h1>
   <button data-collapsetext="collapse" data-expendtext="Expend">Collapse</button>
</h1>
```

***Read More***  
Add `data-jsc-target` dataset with the value of accordion id to any button you like to trigger accordion.  
If you add `data-jsc-accCon=""` dataset with the value of "false" to the accordion then the accordion will not work.

### HTML Example 2
In this example you don't need to add any html ID to the container or in the button

```html
<div class="jsc-accordion">
   <!-- Always wrap button to heading tag for accessibility -->
   <h1><button data-jsc-target="">Lorem ipsum dolor sit amet.</button></h1>
   <!-- Accordion content container -->
   <div data-jsc-accCon="true">
      <!-- Your content -->
   </div>
</div>
```

The "jsc-accordion" element has to wrap the whole accordion and the button this is important.  
**Note: The downside of not adding ID to this is that it will not work perfectly in nested accordion.**  


## Class based way

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


## APIs
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
</table>  

## Methods
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
