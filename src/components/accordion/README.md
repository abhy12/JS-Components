# Light weight and Simple Accordion

## Usage

Download the "accordion.js" file from [here](https://github.com/abhy12/JS-Components/tree/master/src/components/accordion) and after downloading, link the end of the body.  

CDN: (I will soon add CDN links)  

### Get started
After linking the accordion file you can use accordion with [HTML way](#html-way) or [class based way](#class-based-way) (either way is good but class based way give you more control over "accordion").

## HTML Way

### HTML Example 1  

Basic structure

```
<!-- Accordion wrapper -->
<div class="jsc-accordion">
  <!-- Always wrap button to heading tag for accessibility -->
  <h1><button data-jsc-target="YOUR-ID">Lorem ipsum dolor sit amet.</button></h1>
  <!-- Accordion -->
  <div id="YOUR-ID" class="accordion" data-jsc-accCon="true">
    <!-- Your content -->
  </div>
</div>
```

just replace "YOUR-ID" with your own same unique html ID(without "#") and that's it eveything will be working fine now 🎉.  

#### Change button text on collapse or expend
```
  <h1>
    <button class="..." data-collapsetext="collapse" data-expendtext="Expend">Collapse</button>
  </h1>
```

***Read More***  
Add `data-jsc-target` dataset with the value of accordion id to any button you like to trigger accordion.  
If you add `data-jsc-accCon=""` dataset with the value of "false" to the accordion then the accordion will not work.

### HTML Example 2
In this example you don't need to add any html ID to the container or in the button

```
<div class="jsc-accordion">
  <!-- Always wrap button to heading tag for accessibility -->
  <h1><button data-jsc-target="">Lorem ipsum dolor sit amet.</button></h1>
  <!-- Accordion content container -->
  <div class="accordion" data-jsc-accCon="true">
    <!-- Your content -->
  </div>
</div>
```

The "jsc-accordion" element has to wrap the whole accordion and the button this is important.  
***Note: The downside of not adding ID to this is that it will not work perfectly in nested accordion.***  


## Class based way

***Example HTML structure***

```
<button id="btn">Lorem ipsum dolor sit amet.</button>
<div class="new-accordion">
  <!-- Your content -->
</div>
```

Create an instance of Accordion

```
const newAccordion = new JscAccordion({	
   container: '.new-accordion',
   button: '#btn',
   collapsed: true, ///default,

   ///change button text on collapse or expend
   collapseText: 'Collapse',
   expendText: 'Expend',
});
```

***Note: you can use any document query or any class as a container if that container don't have an existing ID then the accordion will generate an ID for that container.***