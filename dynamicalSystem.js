function generateTrajectory(x0, mat=rotationMatrix(Math.PI/2),
    dt=0.01, nSteps=100, )
{

    // math.config({
    //   number: 'BigNumber',      // Default type of number:
    //                             // 'number' (default), 'BigNumber', or 'Fraction'
    //   precision: 128             // Number of significant digits for BigNumbers
    // })
    // math.config({
    //     number: 'number',
    // })


    let tAry = [];
    let t = 0;
    let vAry = [];
    //let dt = 0.01;
    let v = x0.copy();
    //const mat = rotationMatrix(Math.PI/2)

    let nMag = 0;//.05

    //1.) convert from pVec to highPrecision mathjsVec
    vMath = pVec2mathVec(v);
    vMathArray = []
    //2.) loop through in mathjsVec

/*
 *
 */
    for (let i=0; i<nSteps; i++)
    {
        tAry.push(t+=dt)
        vMathArray.push(vMath);

        let dv = math.multiply(mat,vMath);
        // add noise

        dv = math.multiply(dv,dt)
        vMath = math.add(vMath, dv)
        // dv *= dt; //from derivative to delta
        // vMath += dv;

    }
    //3.) convert array of mathjsVec to array of pVec
    for (let i=0; i<nSteps; i++)
    {
        vAry.push( mathVec2pVec(vMathArray[i]) )
    }

/*
    for (let i = 0; i<nSteps; i++)
    {
        tAry.push(t+=dt)

        v = v.copy();
        vc = v.copy();
        vAry.push(v);


        // let noise = p5.Vector.random2D();
        // noise.mult(nMag)
        // noise.mult(v.mag())

        //generate dv/dt
        // v' = -Av + Bu + Qn
        dv = createVector(0,0);
        dv.add(applyMat(mat,vc));
//        dv.add(noise)
        dv.mult(dt);
        v = v.add(dv);
    }

*/



    return [vAry,tAry];
}

function applyMat(mMat, pVec)
{
    mvin = pVec2mathVec(pVec);
    mathOut = math.multiply(mMat,mvin);
    pvOut = mathVec2pVec(mathOut);

    if (pvOut.mag()<1e-10)
    {
        pvOut.mult(0);
    }

    return pvOut
}


// matrix generators

function generate2Dsys(lam1, lam2=-1)
{
    if (math.im(lam1)>0)
    {
        //for 2D sys guarantee second lambda is a match
        lam2 = lam1.conjugate();
    }
    Amat = math.matrix(math.transpose( [[math.re(lam1), math.im(lam1)] ,
                                        [math.im(lam2), math.re(lam2)]]  ))
    return Amat;
}

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


function complex2str(z)
{
    return `${math.re(z)} + ${math.im(z)} i`
}
function vec2complex(vec)
{
    return math.complex({re:vec.x.toFixed(1), im:vec.y.toFixed(1)});
}


function getLamStr(drag)
{
    return complex2str(vec2complex(drag.getValue()))
}


/*
class DynamicalSystem{
    constructor(eigs)
    {
        this.eigs = eigs;
        //this.sys = generateSys(eigs)
        this.x0 = 0;
        this.Amat = math.matrix([.9,0],[0,.9])
        this.dt = 0.1;

        this.trajY;
        this.trajX;
        this.trajT;

        this.color;
    }

    generateSys()
    {
        this.sys = generate2Dsys(eigs[0],eigs[1])
    }
    generateTrajectory(x0)
    {
        this.x0 = x0;

    }

}
*/
