/* TO DO

POLISH
    X draw yellow derivative vector!!
        -  color code X as light purple??

    ~? remove clone of Eig1 (think it has to do with adding child node twice?)
        - 1 drives 2 just defined
        - 2 driving 1 has a delay


    - handle position of time trajectory relative to phase plane
        -
        -
    - ADD AXES - to phase plane
    - rollover effect for phase plane?
    :) when explainer text is hovered-over, point to relevant
[]
MOSTLY COMPLETED
    CORRECT NUMERICAL PRECISION
        idea 1: don't flip between representations (didnt make a difference)
        - keep everything in math.js
        -

        idea 2: calculate at higher precision (didnt make a difference?)

        idea 3: just make dt smaller :) (works!)
        - 0.001 works!

        idea 4: use an ode solver (later)
        - implement midpoint method?

POSTPONED
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
 */

/* FUN STUFF

 SHould I be using CindyJs??
 https://cindyjs.org/gallery/cindygl/
can calculate eigenvalues
 https://cindyjs.org/ref/Alphabetical_Function_Index.html

 *
 */

let tex;
let colorHeader;
let eqStr;

let cBack;
let cHigh;
let c1, c2, c3;

let textIn, textFlat, textOut;
// = color(242, 212, 134);
//   console.log(textIn)

let px, py
let txOff, tyOff;


let dEq;
let dEig1, dEig2;

let dX0;
let dT;

let Amat;

let dragArray = [];



let isEigOver, isXDotOver, isX0Over, isXtOver;
let isRealOver, isImagOver;
// let isInputOver



function preload()
{
    textIn = loadStrings('eq1.txt');

}


function setup() {
    console.log(textIn[41])
    textFlat = textIn.join('\n');

    //REPLACES both at once
    textOut = repCMDandDef(textFlat,'CY','CH')
    textOut = repCMDandDef(textOut,'CR','CH')


    //textOut = repEachBracket(textFlat,'\CY{','}','\CB{','}');
    //textOut = repEachBracket(textOut,`LBC{\\\\CYDef}`,'RBC{}',`LBC{\\CRDef}`,'RBC{}');


//works
//    textOut = repEachBracket(textOut,'\CYDef}','{','\CHDef}','{');
    //textOut = repEachBracket(textOut,`{\\\\CYDef}`,'{',`{\\CHDef}`,'{');


    // //textFlat = textFlat.join('\n');
    //
    //
    // console.log('part2')
    // textOut = repEachBracket(textFlat,'\CYDef}','{','\CHDef}','{');
    // console.log('part3')
    // //textOut = repEachBracket(textFlat,'\CB{','}','\CH{','}');

    if (Array.isArray(textOut))
    {
        console.log("still an array, joining..")
        textOut = textOut.join('');
    }

    console.log(textIn[41])



    createCanvas(1000, 600);
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
    eqStr = colorHeader+textOut;//textIn.join(' ');

    tex = setupEquationBlock();

    // TODO: replace class definitions to accept colors on construct
    dEq = new DraggableEquation(450,200, cLow, colorHeader);
    dEig1 = new DraggableEquation(120,70, c1, colorHeader);
    dEig2 = new DraggableEquation(120,200-dEig1.y, c1, colorHeader);

    //dEig2 = new DraggableEquation(120,110, c1, colorHeader);
    dX0 = new DraggableEquation(350,30, cLow, colorHeader);


  //This links need to be child-specific!!!
  //Map out the connections!!


    dEig1.origin.set(150,100)
    //dEig1.xScale = 0.1;
    dEig1.setScale(.1)
    dEig1.xScale = 0.02;

    dEig1.xSnap = 5;
    dEig1.doSnap = true;

    dEig2.origin.set(150,100)
    dEig2.setScale(.1)
    dEig2.xScale = 0.02;

    dEig2.xSnap = 5;
    dEig2.doSnap = true;

    //demoFun = (driver, child) => child.color = color('white')
    mirrorY = (driver, child) => child.set( driver.x, 2*driver.origin.y-driver.y ) ;
    // updateX0 = (driver, child) =>
    // {
    //   //  child.setX0( driver.getX0() )
    // }

    linkPoints(dEig1, dEig2, mirrorY)

    //linkPoints(dX0, dEq, updateX0)

    //Initial trajectory
    // //reasonable
    // let dtSim = 0.001
    // let nSimPoints =  6000;

    //high precision
    let dtSim = 0.001
    //let nSimPoints = 20000;
    let nSimPoints = 6000;

    dT = new DraggableTrajectory(dX0.x,dX0.y, dtSim, nSimPoints)
    dT.origin.set(createVector(275,100))
    dT.hw = 30;
    /*
    let aLam1 = math.complex({re:-0.1, im:0.8});
    let aLam2 = math.complex({re:-0.1, im:-0.8});
    dT.Amat = generate2Dsys(aLam1,aLam2);
    */


    let nudge = (driver, child) =>
    {
        child.add(driver.moveDelta)
    //    child.set
    }

    dT.origin.children.push(dT);
    //When the origin moves, move the endPoint by the same delta
    dT.origin.linkFun = nudge;

    dT.origin.children.push(dX0);


    //stand-in for getLam method which would use relative position
    //dEig1.getLam = () => math.complex({re:-0.3, im:0.8});
    // updateLam = (driver,child) => dT.updateSys( driver.getLam() );

    // dEig1.children.push(dT)
    //dEig1.linkFun = updateLam;

    addDraggable(dEq);
    addDraggable(dEig1);
    addDraggable(dEig2);
    addDraggable(dT);
    addDraggable(dX0);
    isEigOver=false;
    isXDotOver=false;
    isX0Over=false;
    isRealOver=false;
    isImagOver=false;
}
// function setColor(d, clr)
// {
//     d.color = clr;
// }


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



// Update dynamical system
    //could be moved to a listener so it only updates when x0 updates?
    x0 = createVector(dX0.x-width/2,dX0.y-height/2);



    //let aLam1 = math.complex({re:-0.1, im:0.8});
    //let aLam2 = math.complex({re:-0.1, im:-0.8});

    let aLam1 = vec2complex(dEig1.getValue())
    let aLam2 = vec2complex(dEig2.getValue())

    dT.Amat = generate2Dsys(aLam1,aLam2);
    dT.generateMyTrajectory();



    //drawArrow(dT.origin,x0,'white')
    // draw all anchors
    dragArray.forEach(function(item,index){
        item.update();
        item.over();
    });

    drawXDot(dT, c3);
    if (isEigOver)
    {
        dEig1.over(true);
        dEig2.over(true);
        dEig1.show();
    }


    dragArray.forEach(function(item,index){
        item.show();
    });



    //
    // translate(dT.trajArray[0].x, dT.trajArray[0].y)
    // line(0,0,dX.x, dX.y)
    // %circle(dT.trajArray[0].x, dT.trajArray[0].y,10)
    // circle(dT.trajArray[1].x, dT.trajArray[1].y,10)





    cHigh = hueShift(cHigh);
    cHex = pColorToHexStr(c1);
    clHex = pColorToHexStr(cLow);

    lamStr = `\\textcolor{${cHex}}{\\lambda_1}`;
    lamStr2 = `\\textcolor{${cHex}}{\\lambda_2}`;

    x0Str =`\\textcolor{${clHex}}{x(0)}`
    x10Str =`\\textcolor{${clHex}}{x_1(0)}`
//Equation for \lambda
//
    dEig1.color = c1;
    dEig1.updateEq(`${lamStr}=${getLamStr(dEig1)}`)

    dEig2.color = c1;
    dEig2.updateEq(`${lamStr2}=${getLamStr(dEig2)}`)

    dX0.color = cLow;

    let x0traj = dT.getValue();
    x0traj.y *= -1; //for some reason this is wrong

    dX0.updateEq(`${x0Str}= ${colVecStr(x0traj)}`)
//Equation for x(t)

    //simpleStr = `x_1(t) = x_1(0) \\exp(\\Re(\\lambda_1)t) \\cos(\\Im(\\lambda_1) t) `;
    colorStr = `x_1(t) = ${x10Str} \\,`
    colorStr += `\\exp( \\operatorname{Re}(${lamStr}) t ) \\,`
    colorStr += `\\cos( \\operatorname{Im}(${lamStr}) t ) `;

    //'x_1(t) = \\CH{x_1(0)} \\exp({\\CY{\\Re(\\lambda_1)}t}) \\cos({\\CB{\\Im(\\lambda_1)} t}) '
    //'
    dEq.color = cLow ;
    dEq.updateEq(colorStr) ;



    drawEigenAxes(dEig1);
  //tex.position(px,py)
  //katex.render("x(t)",tex.elt)
  //
  //    drawFore();
}
// end draw

function eOver()
{
    isEigOver=true;
    console.log("yas")
}
function eOut()
{
    isEigOver=false;
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

function colVecStr(xVec)
{
    return `\\begin{bmatrix} ${xVec.x} \\\\ ${xVec.y} \\end{bmatrix} `
}
