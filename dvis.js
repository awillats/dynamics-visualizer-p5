let tex;
let texMouse;
let colorHeader;
let eqStr;

let cBack;
let cHigh;
let c1;
let c2;
let c3;
let textIn;
// = color(242, 212, 134);
//   console.log(textIn)

let px;
let py;
let txOff;
let tyOff;

function preload()
{
    textIn = loadStrings('eq1.txt');
}


function setup() {
  createCanvas(620, 480);
  px = width / 5.0;
  py = height / 5.0;
  txOff = -100;//20;
  tyOff = -30;// -45;

  cBack = color(42,42,45);

  cText = color(200,200,200);
  cHigh = color(0, 240, 255)

  c1 = color(176, 57, 57); //red
  c2 = color(77, 150, 213); //blue
  c3 = color(241, 234, 143); //yellow

  background(cBack)

// add colors and eq1.txt to latex input
  colorHeader = setupLatexColors(cText, cHigh, c1, c2, c3);
  eqStr = colorHeader+textIn.join(' ');

//render LaTeX
  tex = createP();
  tex.style('font-size', '15px');
  tex.position(135, 165);
  katex.render(eqStr, tex.elt);

  texMouse = createP();
  texMouse.style('font-size', '25px');

  //
}

function drawBack(){
    background(cBack);
}
function drawFore(){
    tex.position(135, 165);
    katex.render(eqStr, tex.elt);
}
function draw(){
  drawBack();
  fill(c3);
  //ellipse(px,py,20)

  texMouse.position(px+txOff,py+tyOff)
  let lam = px / width;
  katex.render(colorHeader+`{x_1(t)} = exp^{(- \\CR{ ${lam.toFixed(2)} } t )}`,texMouse.elt)
  //tex.position(px,py)
  //katex.render("x(t)",tex.elt)
  //
  //    drawFore();

}

function mouseDragged(){
    px = mouseX;
    py = mouseY;
}
