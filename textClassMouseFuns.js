// let isEigOver, isXDotOver, isX0Over, isXtOver;
// let isRealOver, isImagOver;

// may be able to simplify this by nesting classes
// https://stackoverflow.com/questions/8722163/how-to-assign-multiple-classes-to-an-html-container


// end draw
function eigOverFn()
{
    isEigOver=true;
    console.log('over eig group')
}
function eigOutFn() { isEigOver=false; }

function dynOverFn()
{
    isXDotOver=true;
    console.log('over dyn group')
}
function dynOutFn() { isXDotOver=false; }


function x0OverFn()
{
    isX0Over=true;
    console.log('over x0 group')
}
function x0OutFn() { isX0Over=false; }

function xtOverFn()
{
    isXtOver=true;
    console.log('over xt group')
}
function xtOutFn() { isXtOver=false; }

function realOverFn()
{
    isRealOver=true;
    console.log('over real group')
}
function realOutFn() { isRealOver=false; }

function imagOverFn()
{
    isImagOver=true;
    console.log('over imag group')
}
function imagOutFn() { isImagOver=false; }


function eOver()
{
    isEigOver=true;
    console.log("yas")
}
function eOut()
{
    isEigOver=false;
}
