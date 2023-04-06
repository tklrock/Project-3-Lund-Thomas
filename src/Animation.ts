/*========================================================================
 * FILE:    Animation.js
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2023
 *
 * DESCRIPTION: Module for managing animations
 */
/*------------------------------------------------------------------------
 *                      CONSTANTS
 */
const ANIMATION_TYPE_SLIDE_LEFT = "slideleft";
const ANIMATION_TYPE_SLIDE_RIGHT = "slideright";
const ANIMATION_TYPE_CROSSFADE = "crossfade";
const DIV_SCRIPTURES1 = "nav-contents1";
const DIV_SCRIPTURES2 = "nav-contents2";

/*------------------------------------------------------------------------
 *                      VARIABLES
 */
let onscreenDiv = document.getElementById(DIV_SCRIPTURES2);
let offscreenDiv = document.getElementById(DIV_SCRIPTURES1);

/*------------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
const performAnimation = function (animationType: string) {
    if (onscreenDiv && offscreenDiv) {
        onscreenDiv.className = `${animationType}-offscreen`;
        offscreenDiv.className = "onscreen";
    }
};

const prepareToAnimate = function (
    html: string,
    contentChangedCallback: (div: HTMLElement) => {},
    animationType: string
) {
    if (onscreenDiv && offscreenDiv) {
        offscreenDiv.className = `${animationType}-prepare-offscreen`;
        offscreenDiv.innerHTML = html;
        offscreenDiv.scrollTop = 0;

        if (typeof contentChangedCallback === "function") {
            contentChangedCallback(offscreenDiv);
        }
    }
};

const swapDivs = function () {
    [onscreenDiv, offscreenDiv] = [offscreenDiv, onscreenDiv];
};

/*------------------------------------------------------------------------
 *                      EXPORTED FUNCTIONS
 */
const animateToNewContent = function (
    html: string,
    contentChangedCallback: (div: HTMLElement) => {},
    animationType = ANIMATION_TYPE_CROSSFADE
) {
    prepareToAnimate(html, contentChangedCallback, animationType);
    performAnimation(animationType);
    swapDivs();
};

/*------------------------------------------------------------------------
 *                      EXPORTS
 */
export {
    ANIMATION_TYPE_CROSSFADE,
    ANIMATION_TYPE_SLIDE_LEFT,
    ANIMATION_TYPE_SLIDE_RIGHT,
    animateToNewContent
};