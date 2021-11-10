const morseCode = {
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    //letters
    "a": ".-",     "b": "-...",    "c": "-.-.",    "d": "-..",    "e": ".",    "f": "..-.",    "g": "--.",    "h": "....",    "i": "..",
    "j": ".---",    "k": "-.-",    "l": ".-..",    "m": "--",    "n": "-.",    "o": "---",    "p": ".--.",    "q": "--.-",    "r": ".-.",
    "s": "...",    "t": "-",    "u": "..-",    "v": "...-",    "w": ".--",    "x": "-..-",    "y": "-.--",    "z": "--..",    ".": ".-.-.-", 
    //punctuation marks
    ",": "--..--",    "?": "..--..",    "!": "-.-.--",    "-": "-....-",    "/": "-..-.",    "@": ".--.-.",    "(": "-.--.",    ")": "-.--.-",
    "'": ".----.",    "\"": ".-..-.",    "&": ".-...",    ":": "---...",    ";": "-.-.-.",    "=": "-...-",    "+": ".-.-.",    "_": "..--.-",
    "$": "...-..-",    
}

const morseCodeRus = {
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    //letters
    "а": ".-",     "б": "-...",    "в": ".--",    "г": "--.",    "д": "-..",    "е": ".",  "ё": ".",   "ж": "...-",    "з": "--..",    "и": "..",
    "й": ".---",    "к": "-.-",    "л": ".-..",    "м": "--",    "н": "-.",    "о": "---",    "п": ".--.",    "р": ".-.",    "с": "...",
    "т": "-",    "у": "..-",    "ф": "..-.",    "х": "....",    "c": "-.-.",    "ч": "---.",    "ш": "----",    "щ": "--.-",    "ъ": "--.--",
    "ы": "-.--",    "ь": "-..-",    "э": "..-..",    "ю": "..--",    "я": ".-.-", 
    //punctuation marks 
    ".": "......",     ",": ".-.-.-",    "?": "..--..",    "!": "--..--",    "-": "-....-",    "/": "-..-.",    "@": ".--.-.",    "(": "-.--.-", 
    ")": "-.--.-",    "'": ".----.",    "\"": ".-..-.",     ":": "---...",    ";": "-.-.-.",    "=": "-...-",    "+": ".-.-.",   "_": "..--.-",
        
}


const words = [
    "the",    "be",    "to",    "of",    "and",    "a",    "in",    "that",    "have",    "I",    "it",    "for",    "not",    "on",    "with",
    "he",    "as",    "you",    "do",    "at",    "this",    "but",    "his",    "by",    "from",    "they",    "we",    "say",    "her",    "she",
    "or",    "an",    "will",    "my",    "one",    "all",    "would",    "there",    "their",    "what",    "so",    "up",    "out",    "if",
    "about",    "who",    "get",    "which",    "go",    "me",    "when",    "make",    "can",    "like",    "time",    "no",    "just",    "him",
    "know",    "take",    "person",    "into",    "year",    "your",    "good",    "some",    "could",    "them",    "see",    "other",    "than",
    "then",    "now",    "look",    "only",    "come",    "its",    "over",   "think",    "also",    "back",    "after",    "use",    "two",
    "how",    "our",    "work",    "first",    "well",    "way",    "even",    "new",    "want",    "because",    "any",    "these",    "give",
    "day",    "most",    "us" 
];

const wordsRus = [
    "это", "быть", "к", "из",  "и",    "какой",    "в",    "этот",    "иметь",    "я",    "что-то",    "для",    "нет",    "на",    "с",
    "он", "каким-то", "ты",    "делай",    "у",    "этим",    "но",    "его",    "пока",    "от",    "они",    "мы",    "скажи",    "её",    "она",
    "или",  "будет",    "мой",    "один",    "все",    "были",    "там",    "их",    "что",    "так",    "вверх",    "низ",    "если",
    "о",    "кто",    "чем-то",    "который",    "идти",    "me",    "когда",    "делать",    "мог",    "подобно",    "время",    "по",    "только",    "его",
    "знать",    "взять",    "человек",    "туда",    "год",    "твой",    "вещь",    "некий",    "могу",    "их",    "видеть",    "другой",    "чем",
    "тогда",    "now",    "взгляд",    "только",    "come",    "этого",    "сверх",   "думаю",    "также",    "назад",    "после",    "польза",    "два",
    "как",    "наш",    "дело",    "первый",    "идёт",    "путь",    "даже",    "новый",    "хочу",    "потому",    "любой",    "эти",    "пять",
    "день",    "более",    "мы" 
];

// const levels = [
//     ['e','t'],
//     ['i','m'],
//     ['d','u'],
//     ['c','p'],
//     ['w','l'],
//     ['f','y'],
//     ['x','j']
// ]


const levels = [
    ['e','t','a','n','0','9'],
    ['i','m','s','o','1','8'],
    ['d','u','r','k','2','7'],
    ['c','p','b','g','3','6'],
    ['w','l','q','h','4','5'],
    ['f','y','z','v','?','='],
    ['x','j','/','.','!',')']
]