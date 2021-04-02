function generateTrajectory(x0, mat=rotationMatrix(Math.PI/2),
    dt=0.01, nSteps=100, )
{
    let tAry = [];
    let t = 0;
    let vAry = [];
    //let dt = 0.01;
    let v = x0.copy();
    //const mat = rotationMatrix(Math.PI/2)

    let nMag = .2

    for (let i = 0; i<nSteps; i++)
    {
        tAry.push(t+=dt)
        v = v.copy();
        vc = v.copy();
        vAry.push(v);

        let noise = p5.Vector.random2D();
        noise.mult(nMag)
        noise.mult(v.mag())
        //generate dv/dt
        // v' = -Av + Bu + Qn
        dv = createVector(0,0);
        dv.add(applyMat(mat,vc));
        dv.add(noise)
        dv.mult(dt);
        v = v.add(dv);
    }
    return [vAry,tAry];
}

function applyMat(mMat, pVec)
{
    mvin = pVec2mathVec(pVec);
    mathOut = math.multiply(mMat,mvin);
    return mathVec2pVec(mathOut)
}


// matrix generators


function rotationMatrix(angle)
{
    return math.matrix([[Math.cos(angle), -Math.sin(angle)],
                        [Math.sin(angle), Math.cos(angle)]] )
}


// matrix / vector type helpers

function vecGet(mVec,idx)
{
    return (math.subset(mVec, math.index(idx,0)))
}
function pVec2mathVec(pVec)
{
    return math.matrix([[pVec.x],[pVec.y]])
}
function mathVec2pVec(mVec)
{
    // TODO: generalize to more than 2D
    return createVector(vecGet(mVec,0),
                        vecGet(mVec,1))
}



/*
class DynamicalSystem{
    constructor(eigs)
    {
        this.eigs = eigs;
        this.sys = generateSys(eigs)
        this.x0 = 0;

        this.dt = 0.1;

        this.trajY;
        this.trajX;
        this.trajT;

        this.color;
    }

    generateSys(eigA, eigB)
    {

    }
    generateTrajectory(x0)
    {
        this.x0 = x0;

    }

}
*/
