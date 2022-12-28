"use strict";
///you can change prefix if you want to
const PREFIX = 'jsc', ACCORDIONSELECTOR = `[data-${PREFIX}-accCon]`, allAccordion = document.querySelectorAll(ACCORDIONSELECTOR);
/**
 * TODO
*/
///credit https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function randmoId(length = 8) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
class Accordion {
    constructor(args) {
        this.container = null;
        this.collapsed = true;
        let tempCon = args.container;
        ///check if container value is htmlElement or some DOM query string
        if (typeof tempCon === 'string') {
            tempCon = document.querySelector(tempCon);
        }
        ///if container argument is falsey return
        if (!tempCon || (tempCon instanceof HTMLElement) === false)
            return;
        this.container = tempCon;
        if (args.button)
            this.button = args.button;
        this._init();
    }
    _is_valid_container() {
        return this.container instanceof HTMLElement;
    }
    _init() {
        if (!this.container)
            return;
        ///set new id if the container don't have one
        if (this.container.id === '') {
            let id = randmoId();
            while (true) {
                if (document.getElementById(id)) {
                    id = randmoId();
                    continue;
                }
                break;
            }
            this.container.id = `${PREFIX}${id}`;
        }
        ///set accordion data
        if (this.container.getAttribute(`data-${PREFIX}-accCon`) === null || this.container.getAttribute(`data-${PREFIX}-accCon`) !== 'false') {
            this.container.setAttribute(`data-${PREFIX}-accCon`, 'true');
        }
        // @ts-ignore
        ///only false when collapsed explicitly has false value, default is true
        this.collapsed = (this.collapsed !== false || this.collapsed !== 'false') ? true : false;
        this.container.setAttribute('data-collapse', this.collapsed + '');
        ///if the collapse value is true hide the element
        if (this.collapsed)
            this.container.style.display = 'none';
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
        if (this.button instanceof HTMLCollection || this.button instanceof NodeList || this.button instanceof Array) {
            //@ts-ignore
            const btns = Array.from(this.button);
            btns.forEach((el) => {
                if (el instanceof HTMLCollection || el instanceof NodeList)
                    return;
                let btn = el;
                if (typeof btn === 'string') {
                    btn = document.querySelector(btn);
                }
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
            if (this.collapseText !== undefined) {
                text = this.collapseText;
            }
            else {
                text = target.getAttribute('data-collapsetext');
            }
            target.classList.add('collapsed');
        }
        else {
            if (this.expendText !== undefined) {
                text = this.expendText;
            }
            else {
                text = target.getAttribute('data-expendtext');
            }
        }
        if (text !== null)
            target.innerText = text;
    }
    enable() {
        var _a;
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.setAttribute(`data-${PREFIX}-accCon`, 'true');
    }
    disable() {
        var _a;
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.setAttribute(`data-${PREFIX}-accCon`, 'false');
    }
}
///if the accordion exists in the dom tree 
///assuming you have the controls of html 
allAccordion.forEach(item => {
    var _a;
    let triggerer;
    const accId = item.id;
    if (accId === '') {
        ///not selecting all the triggerer elements 
        ///because of nested accordion under the container
        triggerer = (_a = item.closest('.accordion-container')) === null || _a === void 0 ? void 0 : _a.querySelector(`[data-${PREFIX}-target]`);
    }
    else if (accId !== '') {
        triggerer = document.querySelectorAll(`[data-${PREFIX}-target="${item.id}"]`);
    }
    new Accordion({
        container: item,
        button: triggerer,
    });
});
///Event Bubbling for Accordion triggerer
document.body.addEventListener('click', function (e) {
    const target = e.target;
    const acID = target.dataset[`${PREFIX}Target`];
    if (acID === null || acID === '')
        return;
    const accordion = document.querySelector(`${ACCORDIONSELECTOR}#${acID}`);
    if (!accordion || accordion.getAttribute(`data-${PREFIX}-accCon`) === 'false')
        return;
    if (accordion.classList.contains('colexping'))
        return;
    ///is container collapsed
    let isCollapse = accordion.dataset.collapse === 'true' ? true : false;
    const accAnimationTime = +window.getComputedStyle(accordion).getPropertyValue('transition-duration').replace(/s/, '') * 1000;
    ///save the height of futher use
    let acHeight = accordion.offsetHeight;
    ///add a class to accordion
    accordion.classList.add('colexping');
    if (isCollapse) {
        //it will change the whatever display the element has before
        accordion.style.display = '';
        ///to get the full height of the element
        accordion.style.height = 'auto';
        ///not using this method for now might be using this in future
        // accordion.setAttribute('style', 'height:auto !important');
        /**
         * update the height because if accordion is collapsed
         * previous value has to be 0 and we need the current height
         * of the accordion for further use
         */
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
            accordion.classList.remove('colexping');
        }, accAnimationTime);
        accordion.dataset.collapse = 'false';
        isCollapse = false;
    }
    else if (!isCollapse) {
        accordion.style.height = acHeight + 'px';
        setTimeout(() => {
            accordion.style.height = '0';
        }, 5);
        setTimeout(() => {
            accordion.style.display = 'none';
            accordion.style.height = '';
            accordion.classList.remove('colexping');
        }, accAnimationTime);
        accordion.dataset.collapse = 'true';
        isCollapse = true;
    }
    ;
    const triggerer = document.querySelectorAll(`[data-${PREFIX}-target="${accordion.id}"]`);
    triggerer.forEach((el) => {
        let text = undefined;
        if (isCollapse) {
            text = el.dataset.collapsetext;
            el.setAttribute('aria-expanded', 'false');
            el.classList.add('collapsed');
        }
        if (!isCollapse) {
            text = el.dataset.expendtext;
            el.setAttribute('aria-expanded', 'true');
            el.classList.remove('collapsed');
        }
        text !== undefined && (el.innerText = text);
    });
});
//# sourceMappingURL=accordion.js.map