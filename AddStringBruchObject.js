class Fraction {
    constructor(whole = 0, numerator = 0, denominator = 1) {
        // für gemischte Eingabe, z.B. 1 1/2
        this.whole = Number(whole);
        this.numerator = Number(numerator);
        this.denominator = Number(denominator);

        this.normalize();
    }

    // Statischer Konstruktor aus String, z.B. "3 2/5" oder "2"
    static fromString(input) {
        let whole = 0, numerator = 0, denominator = 1;

        if (input.includes("/")) {
            let [wholeStr, frac] = input.split(" ");
            if (frac === undefined) {
                // z.B. "3/4"
                [numerator, denominator] = wholeStr.split("/").map(Number);
            } else {
                whole = Number(wholeStr);
                [numerator, denominator] = frac.split("/").map(Number);
            }
        } else {
            // z.B. "5"
            whole = Number(input);
        }
        return new Fraction(whole, numerator, denominator);
    }

    // Addition, gibt neues Fraction-Objekt zurück
    add(other) {
        // In unechten Bruch umwandeln
        const n1 = this.whole * this.denominator + this.numerator;
        const n2 = other.whole * other.denominator + other.numerator;

        const commonDenom = this.denominator * other.denominator;
        const numeratorSum =
            n1 * other.denominator + n2 * this.denominator;

        const result = new Fraction(0, numeratorSum, commonDenom);
        result.normalize();
        return result;
    }

    // Bruch kürzen und ggf. in gemischte Form bringen
    normalize() {
        // Aus unechtem Bruch wieder eine gemischte Zahl machen
        if (Math.abs(this.numerator) >= this.denominator && this.denominator !== 0) {
            this.whole += Math.trunc(this.numerator / this.denominator);
            this.numerator = Math.abs(this.numerator) % this.denominator;
        }

        this.reduce();
    }

    // Kürzt den Bruchteil (ggT)
    reduce() {
        if (this.numerator === 0) {
            this.denominator = 1;
            return;
        }
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(Math.abs(this.numerator), Math.abs(this.denominator));
        this.numerator /= divisor;
        this.denominator /= divisor;
    }

    toString() {
        let result = '';
        if (this.whole !== 0) result += this.whole;
        if (this.numerator !== 0) {
            if (result) result += ' ';
            result += `${this.numerator}/${this.denominator}`;
        }
        if (!result) result = '0';
        return result;
    }
}

// Beispiel-Nutzung:
const in1 = process.argv[2];
const in2 = process.argv[3];

const f1 = Fraction.fromString(in1);
const f2 = Fraction.fromString(in2);
const res = f1.add(f2);

console.log(res.toString());
