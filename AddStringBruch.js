const in1 = process.argv[2]
const in2 = process.argv[3]

function StringToNumber(string)// ganzeZahl, Zaehler, Nenner
{
    if(string.length > 1)
    {
        ganzeZahl = string.split(" ")
        bruch = ganzeZahl[1].split("/")
    }
    else
    {
        ganzeZahl = string[0]
        bruch = [0, 0]
    }
    
    let output = [Number(ganzeZahl[0]), Number(bruch[0]), Number(bruch[1])]

    return output
}

function AddBruch(bruch1, bruch2)//adds 2 Brüche and kürzes
{
    if(bruch1[2] != 0 && bruch2[2] != 0)
    {
        gemNenner = bruch1[2] * bruch2[2]
    }
    else if(bruch1[2] == 0 && bruch2[2] != 0)
    {
        gemNenner = bruch2[2]
    }
    else if(bruch2[2] == 0 && bruch1[2] != 0)
    {
        gemNenner = bruch1[2]
    }
    
    let zaehler1 = 0
    if(bruch1[2] != 0)
    {
       zaehler1 = bruch1[1] * (gemNenner / bruch1[2])
    }

    let zaehler2 = 0
    if(bruch2[2] != 0)
    {
        zaehler2 = bruch2[1] * (gemNenner / bruch2[2])
    }
    
    
    let zaehler = zaehler1 + zaehler2
    
    ganzeZahl = bruch1[0] + bruch2[0]

    let smallestNenner = 1
    for(let i = 2; i <= 9; i++)
    {
        if(zaehler % i == 0 && gemNenner % i == 0 && i > smallestNenner)
        {
            smallestNenner = i
        }
    }

    if(zaehler - gemNenner >= 0)
    {
        ganzeZahl = ganzeZahl + (Math.floor(zaehler / gemNenner))
        zaehler = zaehler - (gemNenner * (Math.floor(zaehler / gemNenner)))
    }
    gemNenner = gemNenner / smallestNenner
    zaehler = zaehler / smallestNenner

    mostDivider = Math.max()
    for(let i = 20; i >= 2; i = i - 1)
    {
        if(gemNenner % i == 0 && zaehler % i == 0)
        {
            mostDivider = i
        }
    }

    if(mostDivider != Math.max())
    {
        zaehler = zaehler / mostDivider
        gemNenner = gemNenner / mostDivider
    }
   
    output = `${ganzeZahl} ${zaehler}/${gemNenner}`
    return output
}

console.log(AddBruch(StringToNumber(in1), StringToNumber(in2)))