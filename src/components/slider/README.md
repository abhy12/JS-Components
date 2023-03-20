# Light weight Slider/Carousel

## Get Started

### CDN Links

**Link css to the head**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@js-components/slider/slider.min.css">
```

**Add script to bottom of the body**
```html
<script src="https://cdn.jsdelivr.net/npm/@js-components/slider/slider.min.js"></script>
```

### Basic HTML layout
```html
<div class="jsc-slider-container new-slider">
   <div class="jsc-slider-wrapper">
      <div class="slide">
         <img src="https://images.unsplash.com/photo-1548197253-652ffe79752c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1075&q=80" alt="example">
      </div>
      <div class="slide">
         <img src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="example">
      </div>
      <div class="slide">
         <img src="https://images.unsplash.com/photo-1548263594-a71ea65a8598?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80" alt="example">
      </div>
      <div class="slide">
         <img src="https://images.unsplash.com/photo-1548222606-6c4f581fd09d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1497&q=80" alt="example">
      </div>
      <div class="slide">
         <img src="https://images.unsplash.com/photo-1451188502541-13943edb6acb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80" alt="example">
      </div>
      <div class="slide">
         <img src="https://images.unsplash.com/photo-1506102383123-c8ef1e872756?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="example">
      </div>
   </div>
   <button class="jsc-slide-btn prev">Previous</button>
   <button class="jsc-slide-btn next">Next</button>
</div>
```

### Create new Slider
```javascript
<script>
const slider = new JscSlider({
   container: '.new-slider',
   slidesPerView: 1,
   gap: 5,
   prevEl: '.prev',
   nextEl: '.next',
   breakPoints: {
      480: {
         slidesPerView: 2,
         gap: 10,
      },
      768: {
         slidesPerView: 3,
         gap: 15,
      },
   }
});
</script>
```
