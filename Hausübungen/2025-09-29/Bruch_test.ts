import { assertEquals } from "@std/assert";
import { Bruch } from "./bruch.ts";


function kürzen(ganz: number, zaehler: number, nenner: number)
{
  if(zaehler >= nenner)
  {
    ganz += Math.floor(zaehler / nenner)
    zaehler %= nenner
  }

  for(let i = nenner; i > 0; i = i - 1)
  {
    if(zaehler % i == 0 && nenner % i == 0)
    {
      zaehler = zaehler / i
      nenner = nenner / i
    }
  }

  if(zaehler == 0  || nenner == 0)
  {
    zaehler = NaN
    nenner = NaN
  }

  return {ganz, zaehler, nenner}
}


Deno.test(function bruchTest() {
  for(let i = 0; i < 15; i++)
  {
    let ergebnisGanz = Math.ceil(Math.random() * 100)
    let ergebnisZaehler = Math.ceil(Math.random() * 100)
    let ergebnisNenner = Math.ceil(Math.random() * 100)

    let erweitern1 = Math.ceil(Math.random() * 10)
    let ganz1 = Math.ceil(Math.random() * (ergebnisGanz - 1))
    let zaehler1 = Math.ceil(Math.random() * (ergebnisZaehler - 1))
    let nenner1 = ergebnisNenner

    let erweitern2 = Math.ceil(Math.random() * 10)
    let ganz2 = ergebnisGanz - ganz1
    let zaehler2 = ergebnisZaehler - zaehler1
    let nenner2 = ergebnisNenner

    let ergebnis = kürzen(ergebnisGanz, ergebnisZaehler, ergebnisNenner);
    ergebnisGanz = ergebnis.ganz;
    ergebnisZaehler = ergebnis.zaehler;
    ergebnisNenner = ergebnis.nenner;

    const bruch1 = Bruch.fromString(`${ganz1} ${zaehler1 * erweitern1}/${nenner1 * erweitern1}`);
    const bruch2 = Bruch.fromString(`${ganz2} ${zaehler2 * erweitern2}/${nenner2 * erweitern2}`);

    if(Number.isNaN(ergebnisZaehler))
    {
      assertEquals(bruch1.addiere(bruch2).toString(), `${ergebnisGanz}`);
    }
    else
    {
      assertEquals(bruch1.addiere(bruch2).toString(), `${ergebnisGanz} ${ergebnisZaehler}/${ergebnisNenner}`);
    }

  }
});


//console.log(`${ergebnisGanz} ${ergebnisZaehler}/${ergebnisNenner} = ${ganz1} ${zaehler1 * erweitern1}/${nenner1 * erweitern1} + ${ganz2} ${zaehler2 * erweitern2}/${nenner2 * erweitern2}`)