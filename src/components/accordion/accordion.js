"use strict";
///you can change prefix if you want to
const PREFIX = 'jsc', ACCORDIONSELECTOR = `[data-${PREFIX}-accCon]:not([data-${PREFIX}-accCon='false'])`, accordionCon = document.querySelectorAll(ACCORDIONSELECTOR);
class Accordion {
    constructor(args) {
        this.container = '';
        this.collapsed = true;
        ///if container argument is empty return
        if (!args.container)
            return;
        this.container = args.container;
        if (args.button)
            this.button = args.button;
        this._init();
    }
    _init() {
        let container = null;
        ///check if container value is htmlElement or some DOM query
        if (this.container instanceof HTMLElement) {
            container = this.container;
        }
        else if (typeof this.container === 'string') {
            container = document.querySelector(this.container);
        }
        if (!container)
            return;
        ///probably not a good way to do it 
        this.container = container;
        ///set new id if the container don't have one
        if (container.id === '') {
            const randmoId = Math.floor((Math.random() * 1000) + 1);
            container.id = `${PREFIX}${randmoId}`;
        }
        ///set accordion data
        if (container.getAttribute(`data-${PREFIX}-accCon`) === null || container.getAttribute(`data-${PREFIX}-accCon`) !== 'false') {
            container.setAttribute(`data-${PREFIX}-accCon`, 'true');
        }
        // @ts-ignore
        ///only false when collapsed explicitly has false value, default is true
        this.collapsed = (this.collapsed !== false || this.collapsed !== 'false') ? true : false;
        container.setAttribute('data-collapse', this.collapsed + '');
        ///if the collapse value is true hide the element
        if (this.collapsed)
            container.style.display = 'none';
        this._init_target();
    }
    _init_target() {
        if (!this.button)
            return;
        let trigger = null;
        if (this.button instanceof HTMLElement) {
            trigger = this.button;
        }
        else if (typeof this.button === 'string') {
            trigger = document.querySelector(this.button);
        }
        if (trigger) {
            this._finalizeTarget(trigger);
            return;
        }
        ;
        if (this.button instanceof HTMLCollection || this.button instanceof NodeList) {
            const btns = Array.from(this.button);
            btns.forEach((el) => {
                const btn = el;
                if (!btn)
                    return;
                this._finalizeTarget(btn);
            });
        }
    }
    _finalizeTarget(target) {
        // @ts-ignore
        const containerId = this.container.id;
        target.setAttribute(`data-${PREFIX}-target`, containerId);
        target.setAttribute('aria-expanded', `${!this.collapsed}`);
        target.setAttribute('aria-controls', containerId);
        let text;
        if (this.collapsed) {
            text = target.getAttribute('data-acccollapsetext');
            target.classList.add('collapsed');
        }
        else {
            text = target.getAttribute('data-accexpendtext');
        }
        if (text !== null)
            target.innerText = text;
    }
}
accordionCon.forEach(item => {
    const triggerer = document.querySelectorAll(`[data-${PREFIX}-target="${item.id}"]`);
    new Accordion({
        container: item,
        button: triggerer,
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
const newAccordion = new Accordion({
    container: '#cl-eg-1',
    button: '#cl-eg-1-btn',
});
const secondbtn = document.getElementById('cl-eg-2-btn');
const newAccordion2 = new Accordion({
    container: '.cl-eg-2',
    button: secondbtn,
});
//# sourceMappingURL=accordion.js.map