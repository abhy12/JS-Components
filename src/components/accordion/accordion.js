"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Accordion_instances, _Accordion_init;
///you can change prefix if you want to
const PREFIX = 'jsc', ACCORDIONSELECTOR = `[data-${PREFIX}-accCon]:not([data-${PREFIX}-accCon='false'])`, accordionCon = document.querySelectorAll(ACCORDIONSELECTOR);
/**
 * TO DO
 * create function or class to create new accordion
 */
accordionCon.forEach(item => {
    var _a;
    const id = item.id;
    ///if initial state not provided of the accordion
    if (item.dataset.collapse === undefined ||
        (item.dataset.collapse !== 'false' && item.dataset.collapse !== 'true'))
        item.setAttribute(`data-collapse`, 'true');
    ///not returning because it can be 
    if (id !== '')
        (_a = document.querySelector(`[data-${PREFIX}-target="${id}"]`)) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-controls', id);
    ///check to see if default accordion collapse data is false or otherwise 
    ///collapse default data value can be anything
    ///if it's false then the accordion is expended otherwise collapsed
    const isCollapse = item.dataset.collapse === 'false' ? false : true;
    ///initialize container
    if (isCollapse)
        item.style.display = 'none';
    ///adding collapse class to all the triggerer
    const triggerer = document.querySelectorAll(`[data-${PREFIX}-target="${item.id}"]`);
    triggerer.forEach((el) => {
        let text = undefined;
        if (isCollapse) {
            text = el.dataset.acccollapsetext;
            el.setAttribute('aria-expanded', 'false');
            el.classList.add('collapsed');
        }
        if (!isCollapse) {
            text = el.dataset.accexpendtext;
            el.setAttribute('aria-expanded', 'true');
            el.classList.remove('collapsed');
        }
        text !== undefined && (el.innerText = text);
    });
});
///Event Bubbling for Accordion triggerer
document.body.addEventListener('click', function (e) {
    const target = e.target;
    let acID = undefined;
    if (acID = target.dataset[`${PREFIX}Target`]) {
        const accordion = document.querySelector(`${ACCORDIONSELECTOR}#${acID}`);
        if (!accordion)
            return;
        ///is container collapsed
        let isCollapse = accordion.dataset.collapse === 'true' ? true : false;
        const accAnimationTime = +window.getComputedStyle(accordion).getPropertyValue('transition-duration').replace(/s/, '') * 1000;
        let acHeight = accordion.offsetHeight;
        if (isCollapse) {
            //it will change the whatever display the element has before
            accordion.style.display = '';
            ///to get the full height of the element
            accordion.style.height = 'auto';
            ///not using this method for now might be using this in future
            // accordion.setAttribute('style', 'height:auto !important');
            ///save the height of futher use
            acHeight = accordion.offsetHeight;
            ///immediately change the element height to 0
            accordion.style.height = '0';
            ///wait just a little bit for animation to work properly
            setTimeout(() => {
                accordion.style.height = acHeight + 'px';
            }, 0);
            ///after animation change inline height to nothing
            setTimeout(() => {
                accordion.style.height = '';
            }, accAnimationTime);
            accordion.dataset.collapse = 'false';
            isCollapse = false;
        }
        else if (!isCollapse) {
            accordion.style.height = acHeight + 'px';
            setTimeout(() => {
                accordion.style.height = '0';
            }, 0);
            setTimeout(() => {
                accordion.style.display = 'none';
                accordion.style.height = '';
            }, accAnimationTime);
            accordion.dataset.collapse = 'true';
            isCollapse = true;
        }
        ;
        const triggerer = document.querySelectorAll(`[data-${PREFIX}-target="${accordion.id}"]`);
        triggerer.forEach((el) => {
            let text = undefined;
            if (isCollapse) {
                text = el.dataset.acccollapsetext;
                el.setAttribute('aria-expanded', 'false');
                el.classList.add('collapsed');
            }
            if (!isCollapse) {
                text = el.dataset.accexpendtext;
                el.setAttribute('aria-expanded', 'true');
                el.classList.remove('collapsed');
            }
            text !== undefined && (el.innerText = text);
        });
    }
});
class Accordion {
    constructor(args) {
        _Accordion_instances.add(this);
        this.container = null;
        this.collapsed = true;
        this.container = args.container;
        if (args.collapse !== undefined)
            this.collapsed = args.collapse;
        if (args.button)
            this.button = args.button;
        __classPrivateFieldGet(this, _Accordion_instances, "m", _Accordion_init).call(this);
    }
}
_Accordion_instances = new WeakSet(), _Accordion_init = function _Accordion_init() {
    if (!this.container && typeof this.container !== 'string')
        return;
    const container = document.querySelector(this.container);
    if (!container)
        return;
    let notId = this.container.match(/^[^#]*/);
    if (notId && notId[0]) {
        let randmoId = Math.floor((Math.random() * 9999) + 1);
        this.container = `${PREFIX}${randmoId}`;
        container.id = this.container;
    }
    ///if initial state not provided of the accordion
    container.setAttribute(`data-${PREFIX}-accCon`, 'true');
    ///only expended if the value is falsey default is collapsed
    container.setAttribute('data-collapse', `${!this.collapsed ? 'false' : 'true'}`);
    if (this.collapsed)
        container.style.display = 'none';
    if (!this.button || typeof this.button !== 'string')
        return;
    const trigger = document.querySelector(this.button);
    if (!trigger)
        return;
    trigger.setAttribute(`data-${PREFIX}-target`, container.id);
    trigger.setAttribute('aria-expanded', `${!container.dataset.collapse}`);
    trigger.setAttribute('aria-controls', container.id.replace(/^#/, ''));
};
const newAccordion = new Accordion({
    container: '#cl-eg-1',
    button: '#cl-eg-1-btn',
});
const newAccordion2 = new Accordion({
    container: '.cl-eg-2',
    button: '#cl-eg-2-btn',
});
//# sourceMappingURL=accordion.js.map