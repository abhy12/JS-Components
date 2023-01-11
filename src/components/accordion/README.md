# Accordion

## Light weight and Simple Accordion

## Usage 

## HTML Example 1

If you have control over HTML the simplest and easy way to use the accordion is this:

```
<div class="accordion-container">
  <h1><button data-jsc-target="">Lorem ipsum dolor sit amet.</button></h1>
  <div data-jsc-accCon="">
    <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
  </div>
</div>
```
The "accordion-container" element has to wrap the whole accordion and the button this is important in this example. After that we can add `data-jsc-target` dataset to button and `data-jsc-accCon` dataset to the accordion and that's it your accordion will be working fine.
If you want more customize way to do this see [HTML Example 2](#html-example-2)

## HTML Example 2
In this example you don't have to follow the structure of html

Just add `<.. data-jsc-accCon><../>` this dataset to your accordion (if you add value of false the accordion will not work) and add an ID to the accordion `<.. id="eg-1" data-jsc-accCon><../>`

then for accordion to trigger just add `data-jsc-target="{id}"` this to your button with the value of accordion id (without "#") (you can use any element you want but button is more semantic html) like this:
```
<button data-jsc-target="eg-2">...</button>"
```

***Example***
```
<div class="accordion-container">
  <!-- Always wrap button to heading tag for accessibility -->
  <h1><button class="accordion-btn" data-jsc-target="eg-1">Expend</button></h1>
  <!-- Accordion Container -->
  <div id="eg-1" class="accordion" data-jsc-accCon="">
    <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
  </div>
</div>
```

## Class based accordion
Create an instance of Accordion
```
const newAccordion = new Accordion({	
   container: '.new-accordion',
   button: '#btn-2',
   collapse: true, ///default
});
```
one thing to note here that you can use any document query or any class as a container if that container don't have an existing ID then the accordion will generate an ID for the container

***Example***
```
<div class="accordion-container">
  <!-- Always wrap button to heading tag for accessibility -->
   <h1>
     <button id="btn-2" class="accordion-btn">Expend</button>
   </h1>
  <!-- Accordion Container -->
   <div class="accordion" data-jsc-accCon="">
     <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
   </div>
</div>
```

## You can add collapse and expend text on button

***HTML Example***

```
  <h1>
    <button class="..." data-collapsetext="collapse" data-expendtext="Expend">Collapse</button>
  </h1>
```

***Class Example***
```
const newAccordion = new Accordion({	
  collapseText: 'Collapse',
  expendText: 'Expend',
});
```