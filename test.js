class bruch
{
    constructor(string_bruch)
    {
        this.ganz = Number(string_bruch.split(" ")[0])
        this.zaehler = Number(string_bruch.split(" ")[1].split("/")[0])
        this.nenner = Number(string_bruch.split(" ")[1].split("/")[1])
    }

    addition(bruch2)
    {
        
    }

}

let bruch1 = new bruch(process.argv[2])
let bruch2 = new bruch(process.argv[3])


console.log(bruch1.ganz)