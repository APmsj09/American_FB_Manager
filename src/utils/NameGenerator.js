class NameGenerator {
    static #firstNames = [
        "Michael", "Christopher", "James", "John", "Robert", "David", "William", "Richard", "Joseph", "Thomas",
        "Daniel", "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven", "Andrew", "Kenneth", "Joshua",
        "Kevin", "Brian", "George", "Timothy", "Ronald", "Jason", "Edward", "Jeffrey", "Ryan", "Jacob",
        "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin",
        "Samuel", "Gregory", "Alexander", "Patrick", "Frank", "Raymond", "Jack", "Dennis", "Jerry", "Tyler",
        "Aaron", "Adam", "Albert", "Arthur", "Austin", "Billy", "Bobby", "Bruce", "Carl", "Carlos", "Charles",
        "Christian", "Clarence", "Craig", "Dale", "Danny", "Dennis", "Derek", "Douglas", "Dylan", "Earl",
        "Elijah", "Eugene", "Ethan", "Floyd", "Frederick", "Gabriel", "Gerald", "Glenn", "Gordon", "Harold",
        "Harry", "Henry", "Howard", "Isaac", "Isaiah", "Ivan", "Jesse", "Jimmy", "Joel", "Jordan", "Jose",
        "Juan", "Keith", "Kyle", "Lawrence", "Leo", "Leon", "Louis", "Manuel", "Martin", "Marvin", "Mason",
        "Nathan", "Noah", "Norman", "Oscar", "Peter", "Philip", "Ralph", "Randy", "Raul", "Reginald",
        "Ricardo", "Riley", "Roy", "Russell", "Sean", "Shane", "Shawn", "Stanley", "Terry", "Todd",
        "Tony", "Travis", "Troy", "Victor", "Vincent", "Walter", "Wayne", "Wesley", "Willie", "Zachary"
    ];

    static #lastNames = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
        "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
        "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
        "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
        "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
        "Adams", "Alexander", "Allen", "Alvarez", "Anderson", "Armstrong", "Arnold", "Austin", "Bailey", "Baker",
        "Banks", "Barnes", "Bell", "Bennett", "Berry", "Bishop", "Black", "Bowman", "Boyd", "Bradley",
        "Brooks", "Bryant", "Burke", "Burns", "Burton", "Butler", "Byrd", "Caldwell", "Campbell", "Carlson",
        "Carpenter", "Carr", "Carroll", "Castillo", "Chambers", "Chapman", "Chavez", "Chen", "Clark", "Cole",
        "Coleman", "Collins", "Cook", "Cooper", "Cox", "Crawford", "Cruz", "Cunningham", "Daniels", "Day",
        "Dean", "Diaz", "Dixon", "Douglas", "Duncan", "Dunn", "Edwards", "Elliott", "Ellis", "Evans",
        "Ferguson", "Fernandez", "Fisher", "Fletcher", "Ford", "Foster", "Fowler", "Fox", "Franklin", "Freeman",
        "Fuller", "Gardner", "Garrett", "Garza", "George", "Gibson", "Gilbert", "Gomez", "Gordon", "Graham",
        "Grant", "Graves", "Gray", "Greene", "Griffin", "Guerrero", "Gutierrez", "Guzman", "Hale", "Hamilton",
        "Hansen", "Hanson", "Hardy", "Harper", "Harrison", "Hart", "Harvey", "Hawkins", "Hayes", "Henderson",
        "Henry", "Hicks", "Hill", "Hoffman", "Holland", "Holmes", "Holt", "Howard", "Howell", "Hudson",
        "Hughes", "Hunt", "Hunter", "Jacobs", "James", "Jenkins", "Jensen", "Jimenez", "Johnston", "Jordan",
        "Kelley", "Kelly", "Kennedy", "Kim", "Knight", "Lane", "Larson", "Lawrence", "Lawson", "Le",
        "Little", "Long", "Lowe", "Lucas", "Lynch", "Lyons", "Mack", "Maldonado", "Mann", "Manning",
        "Marshall", "Mason", "Matthews", "May", "McCoy", "McDonald", "McKinney", "Medina", "Mendoza", "Meyer",
        "Mills", "Montgomery", "Morales", "Moreno", "Morgan", "Morris", "Morrison", "Murphy", "Murray", "Myers"
    ];

    static generateFullName() {
        const firstName = this.#firstNames[Math.floor(Math.random() * this.#firstNames.length)];
        const lastName = this.#lastNames[Math.floor(Math.random() * this.#lastNames.length)];
        return `${firstName} ${lastName}`;
    }
}

export default NameGenerator;

