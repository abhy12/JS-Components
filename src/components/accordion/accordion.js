"use strict";
///you can change prefix if you want to
const PREFIX = 'jsc', accordionCon = document.querySelectorAll(`[data-${PREFIX}-accCon='true']`);
/**
 * TO DO
 * add A11y
 * create function or class to create new accordion
 */
accordionCon.forEach(item => {
    var _a;
    const accAnimationTime = +window.getComputedStyle(item).getPropertyValue('transition-duration').replace(/s/, '') * 1000;
    // console.log( accAnimationTime );
    ///if initial state not provided of the accrodion container
    if (item.dataset.collapse === undefined)
        item.setAttribute(`data-collapse`, 'false');
    ///check to see is container collapse
    const isCollapse = item.dataset.collapse === 'true' ? true : false;
    ///initialize container
    if (isCollapse) {
        item.style.height = '0';
        item.style.display = 'none';
    }
    else if (!isCollapse) {
        item.style.height = item.offsetHeight + 'px';
    }
    ///get the triggerers 
    const triggerBtns = (_a = item.dataset.targetbtn) === null || _a === void 0 ? void 0 : _a.split(',');
    ///check if any triggerers found
    if (triggerBtns && triggerBtns.length > 0) {
        ///add event listner to triggerer
        /**
         * TODO
         * might use bubbling for this for performance
         */
        triggerBtns.map(btn => {
            var _a, _b;
            const btnEl = document.querySelector(btn);
            if (!btnEl)
                return;
            ///expend and collapse text
            const collapseText = (_a = btnEl.dataset) === null || _a === void 0 ? void 0 : _a.acccollapsetext;
            const expendText = (_b = btnEl.dataset) === null || _b === void 0 ? void 0 : _b.accexpendtext;
            ///change the expend or collapse text
            if (isCollapse && expendText) {
                btnEl.textContent = expendText;
            }
            else if (!isCollapse && collapseText) {
                btnEl.textContent = collapseText;
            }
            btnEl.addEventListener('click', function (e) {
                e.preventDefault();
                const btn = e.target;
                ///check to see is container collapse
                const isCollapse = item.dataset.collapse === 'true' ? true : false;
                if (!isCollapse) {
                    item.style.height = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, accAnimationTime);
                    item.dataset.collapse = 'true';
                    //add collapse text
                    if (expendText)
                        btn.textContent = expendText;
                }
                else if (isCollapse) {
                    //it will change the whatever display the element has before
                    item.style.display = '';
                    ///to get the full height of the element
                    // item.style.height = 'auto';
                    ///not using this method for now might be using this in future
                    item.setAttribute('style', 'height:auto !important');
                    ///save the height of futher use
                    const acHeight = item.offsetHeight;
                    ///immediately change the element height to 0
                    item.style.height = '0';
                    ///wait just a little bit for animation to work properly
                    setTimeout(() => {
                        item.style.height = acHeight + 'px';
                    }, 0);
                    item.dataset.collapse = 'false';
                    //add collapse text
                    if (collapseText)
                        btn.textContent = collapseText;
                }
            });
        });
    }
});
///TODO add event bubbling if it's not too complicated
// document.body.addEventListener( 'click', function( e )  {
// 	const target = e.target as HTMLElement;
// 	if( target.id !== '' )  {
//       console.log( target.id.split( ' ' ) );
// 		target.id.split( ' ' ).map( att => {
// 			console.log( document.querySelector(`[data-targetBtn*='#${att}']`) );
// 		})
// 	}
// });
//# sourceMappingURL=accordion.js.map