//https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88

class Draggable extends p5.Vector{
    constructor(x=100, y=100, colorIn=color(55, 241, 147)) {
        super(x,y)
        this.dragging = false;
        this.rollover = false;
        this.hw = 10;
        this.hh = 10;
        this.color = colorIn;//color(255, 241, 147);
        this.children = [];
        //updates the position of its children according to the following rule:
        //this.linkFun = (myV, childV) => child.set(createVector(childV.x, myV.y))
        this.linkFun = (driver, child) => child.set(child.x, child.y)
        this.xScale=1;
        this.yScale=1;

        this.moveDelta = createVector(0,0);

        //by default the origin is at 0,0 (of the canvas) and is not interactable
        this.origin = createVector(0,0);
        this.showOrigin = false;

        this.doSnap = false;
        this.xSnap = 0;
        this.ySnap = 0;
    }

    over(override){
        if (!override)
        {
            this.rollover = this.isInHitbox();
        }
        else
        {
            this.rollover = override;
        }
        return this.rollover;
    }
    update(){
        if (this.dragging){

            let prevPos = createVector(this.x,this.y);

            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;

            //snap coordinates?
            if (this.doSnap)
            {
                let v = this.getLocalCoords();
                if (abs(v.x) < this.xSnap)
                {
                    this.x -= v.x;
                }
                if (abs(v.y) < this.ySnap)
                {
                    this.y -= v.y;
                }
            }

            this.moveDelta = prevPos.sub(this).mult(-1);


            //this allows points to have their positions linked according to the linkFun
            for (let [idx, child] of this.children.entries())
            {
                //this.linkFuns[i](this, child)
                this.linkFun(this, child)
            }
        }
    }

    getLocalCoords()
    {
        let pos = this.copy();
        let delta = pos.sub(this.origin);
        //let mag = delta.mag();
        return delta;
    }
    getValue()
    {
        let delta = this.getLocalCoords();
        delta.x *= this.xScale;
        delta.y *= this.yScale;
        return delta;
    }
    //EigPoint.getLam() = () => vec2complex( this.getValue() )
    //e.g. EigPoint.lam = vec2complex(getValue())
    //e.g. TrajPoint.x0 = getValue()
    setScale(newScale)
    {
        this.xScale = newScale;
        this.yScale = newScale;
    }

    show(){
        noStroke();
        fill(this.color);
        if (this.dragging) {
            //fill(   lightenColor(lightenColor(this.color))   );
        } else if (this.rollover) {
            stroke( lightenColor(this.color) );
            fill(this.color);

        } else {
          fill(this.color);
        }
        this.drawCircle();

         if (this.showOrigin)
         {
             noFill()
             stroke(this.color);
             this.origin.drawCircle();
         }
    }

    setColor(newColor) { this.color = newColor; }
    drawCircle() { ellipse(this.x, this.y, this.hw); }

    pressed(){
        if (this.isInHitbox()){
            print("Clicked me!")
            this.dragging = true;
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
        }
    }

    released() {
      // Quit dragging
      this.dragging = false;
    }

    isInHitbox()
    {
        //could replace this with a radial distance evaluation
        return (mouseX > this.x-this.hw && mouseX < this.x+this.hw && mouseY > this.y-this.hh && mouseY < this.y+this.hh);
    }
}

/*

Likely we want this(.vec) to be the x0 of the trajectory in visual space
- have some map to
Do we want to move the origin of the trajec


 */



class DraggableEquation extends Draggable {
    constructor(x,y, pointColor=color('red'), eqStr="") {
        super(x,y,pointColor)
        this.color = pointColor;color(250, 149, 84);
        this.textOffsetX = 15;//10.0;
        this.textOffsetY = -20;//-15.0;
        this.eqHeader = eqStr;
        this.eqStr = eqStr;
        this.texSpec = createP();
        this.texSpec.style('font-size', '12px');

        this.showEq = false;
    }

    updateEq(newEqStr){
        this.eqStr = this.eqHeader+newEqStr;
    }

    doShowEq(){ this.showEq = true; }
    doHideEq(){ this.showEq = false;}

    show()
    {
        noStroke();
        fill(this.color)
        if (this.rollover)
        {
            fill(lightenColor(this.color))
            this.texSpec.position(this.x + this.textOffsetX , this.y + this.textOffsetY);
            katex.render(this.eqStr, this.texSpec.elt);
        }
        else {
            katex.render('', this.texSpec.elt)
        }
        this.drawCircle();

    }

}

/////////////////////////////////////////////////////////////////////////////

class DraggableTrajectory extends Draggable {
    constructor(x,y, color= color(120, 206, 214), dt=0.1, nSteps=5000) {
        super(x,y,color)
        //this.color = color(120, 206, 214);//color('blue');//color(255, 248, 68)
        //rgb(120, 206, 214)
        this.origin = new Draggable(0,0,this.color);
        this.origin.color = this.color; //color(255,255,255,0);

        this.children.push(this.origin)

        this.trajArray = [];
        this.timeArray = [];
        this.dt = dt;
        this.Amat = generate2Dsys(.99,.99);

        this.nSteps = nSteps;

        this.trajectoryStartFun = () => translate(this.getValue().x, 0)
        //for some reason already translated to this.y ?
        this.tScale = 75;
    }
    show() {
        //super.show()
        //if (this.rollover){}
        noFill();
        stroke(this.color);
        strokeWeight(2)
        //ellipse(this.origin.x,this.origin.y,this.origin.hw)
        ellipse(this.x,this.y,this.hw)
        //drawArrow(this.origin,this.copy().sub(this.origin),'red')

        push(); // Now in origin coordinates
        translate(this.origin.x, this.origin.y)
        let d = this.getValue().mag()
        strokeWeight(4)
        stroke(color(69, 66, 71)); // grey for trajectory

        if (this.rollover){
            //PLOT trajectory vs time
            push()
            this.trajectoryStartFun();
            plotTX(this.timeArray, this.trajArray, 2, this.tScale)
            pop()
        }

        //PLOT trajectory in phase spcae
        //back to main color
        stroke(this.color);
        strokeWeight(2)
        plotVecArray(this.trajArray)

        pop(); // Left origin coordinates

    }
    updateSys(newEig)
    {
        // TODO: right now this only works for a single mirrored complex eigenvalue
        this.Amat = generate2Dsys(newEig)
    }
    generateMyTrajectory(x0=this.getValue(), mat=this.Amat, dt=this.dt, nSteps=this.nSteps)
    {
        let XT = generateTrajectory(x0,mat,dt,nSteps);
        this.trajArray = XT[0];
        this.timeArray = XT[1];
    }
}



function linkPoints(p1, p2, linkFun=p1.linkFun)
{
    p1.children.push(p2)
    p1.linkFun = linkFun;

    p2.children.push(p1)
    p2.linkFun = linkFun;
}
