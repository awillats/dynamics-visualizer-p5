/* TO DO
 * plot any 2D trajectory
 * look for dynamical system libraries
 *  https://github.com/JuliaDynamics/DynamicalSystems.jl/blob/master/docs/src/index.md
 *      LSIM discretizes anyway...
 *      so just need to hold system props, convert to discrete time
 *      then matrix multiply (mat vec multiply)
 *
 *      can use math.js to get eigenvalues of 2D matrices
 *      https://mathjs.org/docs/reference/functions/eigs.html
 *
 *  https://mlweb.loria.fr/benchmark/index.html
 *      numeric.js
 *
 *     port of Eigen from C++
 *      https://www.npmjs.com/package/eigen
 *
 *     can I call C++?
 *          https://emscripten.org/docs/porting/connecting_cpp_and_javascript/index.html
 *          https://stackoverflow.com/questions/27198437/is-there-a-way-to-use-c-in-javascript
 *
 * hardcode axes
 */

/* FUN STUFF

 SHould I be using CindyJs??
 https://cindyjs.org/gallery/cindygl/
can calculate eigenvalues
 https://cindyjs.org/ref/Alphabetical_Function_Index.html


 *
 */

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

let dEq;
let dEig1;
let dX0;
let dT;

let Amat;

let dragArray = [];
let pVecArray = [];


function preload()
{
    textIn = loadStrings('eq1.txt');
}


function setup() {
  createCanvas(620, 600);
  colorMode(RGB,255);
  px = width / 5.0;
  py = height / 5.0;
  txOff = -100;//20;
  tyOff = -30;// -45;

  cBack = color(42,42,45);

  cText = color(200,200,200);
  cHigh = color(0, 238, 255);
  cLow = color(159, 109, 214);


  c1 = color(176, 57, 57); //red
  c2 = color(77, 150, 213); //blue
  c3 = color(241, 234, 143); //yellow

  background(cBack)

// add colors and eq1.txt to latex input
  colorHeader = setupLatexColors(cText, cHigh,cLow, c1, c2, c3);
  eqStr = colorHeader+textIn.join(' ');

//render LaTeX
  tex = createP();
  tex.style('font-size', '12px');
  tex.position(50, height-300);
  katex.render(eqStr, tex.elt);

  texMouse = createP();
  texMouse.style('font-size', '25px');

  dEq = new DraggableEquation(60,300, colorHeader);
  dEq.color = cLow;

  dEig1 = new DraggableEquation(120,100, colorHeader);
  dEig1.color = c1;

  dX0 = new DraggableEquation(320,100, colorHeader);
  dX0.color = cLow;

  dT = new DraggableTrajectory(60,60, 0.04,6000)
  dT.origin.set(createVector(width/2,height/2))
  Amat = rotationMatrix(Math.PI/2.1)
  Amat = math.multiply(Amat,-.99);
/*
  lam1 = -.1
  lam2 = -.1
  Amat = math.matrix([[lam1,0],[0,lam2]])
*/
  addDraggable(dEq);
  addDraggable(dEig1);
  addDraggable(dT);

  addDraggable(dX0);

  for (let i=0; i<20; i++)
  {
      let v = p5.Vector.random2D();
      pVecArray.push(v.mult(100));
  }

 // dEq.updateEq('\\CR{\\lambda_1} = 1')

  //mirror position of eqs
  // dEq = new DraggableEquation(50, 100, colorHeader);
  //dEq.updateEq('x_1(t) = e^{-\\CB{\\lambda_1} t}')
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

    x0 = createVector(dX0.x-width/2,dX0.y-height/2)
    dT.generateMyTrajectory(x0, Amat)

    //drawArrow(dT.origin,x0,'white')
    // draw all anchors
    dragArray.forEach(function(item,index){
        item.update();
        item.over();
        item.show();
    });

    cHigh = hueShift(cHigh);
    cHex = pColorToHexStr(c1);
    clHex = pColorToHexStr(cLow);

    lamStr = `\\textcolor{${cHex}}{\\lambda_1}`;
    x0Str =`\\textcolor{${clHex}}{x_1(0)}`
//Equation for \lambda
//
    dEig1.color = c1;
    dEig1.updateEq(`${lamStr}=${mouseX}`)

    dX0.color = cLow;
    dX0.updateEq(`${x0Str}=${mouseY}`)
//Equation for x(t)

    //simpleStr = `x_1(t) = x_1(0) \\exp(\\Re(\\lambda_1)t) \\cos(\\Im(\\lambda_1) t) `;
    colorStr = `x_1(t) = ${x0Str} `
    colorStr += `\\exp(\\operatorname{Re}(${lamStr}) t) `
    colorStr += `\\cos(\\operatorname{Im}(${lamStr}) t) `;

    //'x_1(t) = \\CH{x_1(0)} \\exp({\\CY{\\Re(\\lambda_1)}t}) \\cos({\\CB{\\Im(\\lambda_1)} t}) '
    //'
    dEq.color = cLow;
    dEq.updateEq(colorStr)

  //tex.position(px,py)
  //katex.render("x(t)",tex.elt)
  //
  //    drawFore();
}


function addDraggable(drag){
    dragArray.push(drag);
    for (child of drag.children){ dragArray.push(child) }
}
function mousePressed(){

    dragArray.forEach(function(item,index){ item.pressed();} );
    //dEq.doShowEq();
}

function mouseDragged(){
    px = mouseX;
    py = mouseY;
}

function mouseReleased(){
    dragArray.forEach(function(item,index){ item.released();} );
    //dEq.doHideEq();
}

function plotTX(tAry, xAry)
{
    beginShape();
    noFill();
    for (let i = 0; i<tAry.length; i++)
    {
        vertex(tAry[i]*3, math.re(xAry[i].y))
    }
    endShape();
}
function plotVecArray(vAry,v0=createVector(0,0))
{
    beginShape();
    noFill();
    vAry.forEach((item, i) => {
        //console.log(i)
        vertex(item.x+v0.x, item.y+v0.y)
    });
    endShape();
}
// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
