//https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88

class Draggable {
    constructor(x=100, y=100) {
        this.dragging = false;
        this.rollover = false;

        this.x = x;
        this.y = y;
        this.hw = 10;
        this.hh = 10;

        this.color = color(255, 241, 147);
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
        ellipse(this.x, this.y, this.hw);
    }

    pressed(){
        if (this.isInHitbox()){
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

        ellipse(this.x,this.y,this.hw)

    }

}
