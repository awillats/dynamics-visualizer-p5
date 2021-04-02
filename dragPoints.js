//https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88

class Draggable extends p5.Vector{
    constructor(x=100, y=100) {
        super(x,y)
        this.dragging = false;
        this.rollover = false;
        this.hw = 10;
        this.hh = 10;
        this.color = color(255, 241, 147);
        this.children = [];
    }

    over(){
        if (this.isInHitbox()){
              this.rollover = true;
        } else {
              this.rollover = false;
        }
    }
    update(){
        if (this.dragging){
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
        }
    }

    show(){
        noStroke();
        fill(this.color);
        if (this.dragging) {
            fill('white');
        } else if (this.rollover) {
            stroke('white');
            fill(this.color);
        } else {
          fill(this.color);
        }
        this.drawCircle();

    }
    drawCircle()
    {
        ellipse(this.x, this.y, this.hw);
    }
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


class DraggableTrajectory extends Draggable {
    constructor(x,y, dt=0.1, nSteps=5000) {
        super(x,y)
        this.color = color(120, 206, 214);//color('blue');//color(255, 248, 68)

        this.origin = new Draggable(0,0);
        this.origin.color = color(0,0,0,0);
        this.children.push(this.origin)

        this.trajArray = [];
        this.timeArray = [];
        this.dt = dt;


        this.nSteps = nSteps;
    }
    show() {
        //super.show()
        if (this.rollover)
        {
            fill(255);
        }
        else
        {
            noFill();
        }
        stroke(this.color);
        strokeWeight(2)
        ellipse(this.origin.x,this.origin.y,this.hw)
        ellipse(this.x,this.y,50)
        //drawArrow(this.origin,this.copy().sub(this.origin),'red')


        push();
        translate(this.origin.x, this.origin.y)

        plotTX(this.timeArray, this.trajArray)
        plotVecArray(this.trajArray)
        pop();

    }
    generateMyTrajectory(x0,mat)
    {
        let XT = generateTrajectory(x0,mat,this.dt,this.nSteps);
        this.trajArray = XT[0];
        this.timeArray = XT[1];
    }
}






class DraggableEquation extends Draggable {
    constructor(x,y, eqStr) {
        super(x,y)
        this.color = color(250, 149, 84);
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
