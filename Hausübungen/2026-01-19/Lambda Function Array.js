const persons = [
    {name: "Hermine", age: 14, gender: "f"}, 
    {name: "Jeff", age: 38, gender: "m"}, 
    {name: "Alex", age: 16, gender: "m"}, 
    {name: "Max", age: 22, gender: "m"}, 
    {name: "Sami", age: 13, gender: "m"}
];


//const alter_sort = persons.sort(function(person1, person2) {return person1.age - person2.age});
const alter_sort = persons.sort((person1, person2) => person1.age - person2.age);

//const nur_maenner = persons.filter(function(person) {return person.gender == "m"});
const nur_maenner = persons.filter(person => person.gender == "m");