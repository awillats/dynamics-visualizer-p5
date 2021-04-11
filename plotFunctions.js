function plotTX(tAry, xAry, xIdx, tScale=30)
{
    beginShape();
    noFill();
    for (let i = 0; i<tAry.length; i++)
    {
        if (xIdx==1)
        {
            vertex(tAry[i]*tScale, math.re(xAry[i].x))
        }
        else {
            vertex(tAry[i]*tScale, math.re(xAry[i].y))
        }
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


function drawXDot(dTraj, arrowColor)
{
    //draw vector from x0 in the direction of xdot(x0)
    let dX = dTraj.trajArray[1].copy();
    dX.sub(dTraj.trajArray[0]);
    dX.mult(1/dTraj.dt);
    dX.mult(1/5); //vector scaling fudge factor

    push()
    noFill()
    stroke(c3)
    translate(dTraj.origin.x,dTraj.origin.y)
    drawArrow(dTraj.trajArray[0], dX, c3);
    pop()
}

function drawEigenAxes(eigp)
{
    let dx = 100;
    let dy = 50;
    push()
    strokeWeight(1)
    stroke(eigp.color)

    //draw horizontal axis
    line(eigp.origin.x-dx, eigp.origin.y,
         eigp.origin.x+dx/3, eigp.origin.y);
    //draw vertical axis
    line(eigp.origin.x, eigp.origin.y-dy,
        eigp.origin.x, eigp.origin.y+dy);

    pop()
}


// these are arrows that highlight the real and imaginary part of the eigenvalues
function drawRealImagArrows(eigp, doDrawReal=false,doDrawImag=false)
{
    let arrowColor = lightenColor(eigp.color,3)
    let v = eigp.getLocalCoords();
    let vx = v.copy();
    let vy = v.copy();
    let dashParams = [5,8];
    vx.y=0;
    vy.x=0;

    push()
    strokeWeight(1)
    stroke(arrowColor)

    translate(eigp.origin.x, eigp.origin.y)

    if (doDrawReal){
        drawArrow(createVector(0,0), vx, arrowColor)
        drawingContext.setLineDash(dashParams); // set the "dashed line" mode
        line(v.x,0, v.x,v.y)
    }

    if (doDrawImag){
        drawArrow(createVector(0,0), vy, arrowColor)
        drawingContext.setLineDash(dashParams); // set the "dashed line" mode
        line(0,v.y, v.x,v.y)
    }


    pop()
}
function drawImagArrows(eigp)
{
    push()
    pop()
}


function drawDashed(p1,p2,dL)
{

}


// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(2);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
