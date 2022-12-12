# Accordion

## Usage 
 If you have HTML control you can just add this to your accordion container
 `<.. data-jsc-accCon="true"><../>`
 
and an ID for trigger the accordion
 `<.. id="eg-1" data-jsc-accCon="true"><../>`
 
for accordion to trigger just add this to your button (you can use any element you want but button is recommended)
`<button data-jsc-target="eg-2">...</button>"`

for accordion to work you have to give button `data-jsc-target` a value of accordion container ID without "#"

***Example***
```
<!-- Simple bootstrap like container -->
<div class="accordion-container text-4xl bg-gray-300 text-black p-4 font-medium">
  <!-- Always wrap button to heading tag for accessibility -->
  <h1><button class="accordion-btn w-full bg-transparent border-0 text-left p-0" data-jsc-target="eg-1">Expend</button></h1>
  <!-- Accordion Container -->
  <div id="eg-1" class="accordion text-gray-600" data-jsc-accCon="">
    <h2  class="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
  </div>
</div>
```

## Another Way
Create an instance of Accordion
```
const newAccordion = new Accordion({	
   container: '.new-accordion',
   button: '#btn-2',
   ///the default is collapse true
   collapse: true,
   collapseText: 'Collapse',
   expendText: 'Expend',
});
```
one thing to note here that you can use any document query or any class as a container if that container don't have an existing ID then the accordion will generate an ID

```
<!-- Simple bootstrap like container -->
<div class="accordion-container text-4xl bg-gray-300 text-black p-4 font-medium">
  <!-- Always wrap button to heading tag for accessibility -->
   <h1>
     <button id="btn-2" class="accordion-btn w-full bg-transparent border-0 text-left p-0">Expend</button>
   </h1>
  <!-- Accordion Container -->
   <div class="accordion text-gray-600" data-jsc-accCon="">
     <h2 class="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, cupiditate sed. Illo itaque eligendi eius.</h2>
   </div>
</div>
```
