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
