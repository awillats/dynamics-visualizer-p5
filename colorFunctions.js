function hueShift(pColor)
{
    colorMode(HSB,255);

    let h = (hue(pColor)+3 ) %255;
    let s = saturation(pColor);
    let l = brightness(pColor);
    let a = alpha(pColor);
    let c = color(h,s,l,a)
    colorMode(RGB,255);
    return c;

}
function lightenColor(pColor)
{    /*
    //colorMode(HSB,255);

    let s = saturation(pColor);
    let b = brightness(pColor);
*/
    let L = 1.1;
    let r = red(pColor);
    let g = green(pColor);
    let b = blue(pColor);
    let a = alpha(pColor);

    let cOut = color(r*L,g*L,b*L,a);
    //colorMode(RGB,255);
    return cOut;
}
