// Das Beispielexperiment erzeugt als Fragen nur die Zahlen 0-9.
// Ein Experimentteilnehmer kann die Zahlen 1-3 drücken
//
// Die Experimentdefinition erfolgt über Aufruf der Funktion
//  - document.experiment_definition(...)
// Falls eine Zufallszahl benötigt wird, erhält man sie durch den Methodenaufruf
//  - document.new_random_integer(...Obergrenze...);
//
// WICHTIG: Man sollte new_random_integer nur innerhalb  der Lambda-Funktion ausführen, also NICHT
// an einer anderen Stelle, damit man ein reproduzierbares Experiment erhält!

class CodeGenerator {

    // attributes
    classAttrs = []
    format = 0

    // Words
    animals = ["dog", "cat", "elephant", "lion", "tiger", "bear", "monkey", "giraffe", "zebra", "rabbit", "snake", "crocodile", "hippopotamus", "kangaroo", "penguin", "panda", "wolf", "fox", "deer", "rhinoceros", "cheetah", "gorilla", "koala", "buffalo", "camel", "elephant", "octopus", "polarbear", "shark", "jaguar", "dolphin", "owl", "platypus", "squirrel", "turtle", "hedgehog", "flamingo", "koala", "seal", "whale", "elephant", "zebra", "giraffe", "frog", "penguin", "panda", "peacock", "parrot", "butterfly"]

    methodPrefixes = ["create", "get", "is", "set", "generate", "find"]

    scopes = ["public", "protected", "private"]

    types = ["String", "boolean", "int", "float", "double"]


    constructor(className, attrs_num, codeHasError, format) {
        this.className = className
        this.format = format
        this.codeHasError = codeHasError
        this.classAttrs = this.initializeClassAttrs(attrs_num)
    }

    initializeClassAttrs(attrs_num) {
        var attrs = []
        var i = 0;

        while (i < attrs_num) {
            var attrName = this.generateIdentifier()
            var type = get_random_element(this.types)

            var newAttr = new Attribute(attrName, type)

            if (!attrs.includes(newAttr)) {
                attrs.push(newAttr)
                i++;
            }
        }
        return attrs;
    }

    generateCode() {
        var code = ""

        // Class name
        code += "class " + this.className + " {\n" + "\n"

        // Attrs
        code += this.generateAttrs()

        if (this.codeHasError) {
            this.error = get_random_int(1, 2)
        }

        // Constructor
        var constructor = this.generateConstructor()
        // Methods
        var methods = this.generateMethods()

        if (this.codeHasError) {
            code += modifyCode(constructor + methods)
        } else {
            code += constructor + methods
        }

        code += "}"



        return code
    }

    // Class attributes
    generateAttrs() {
        var attrs = ""
        var tab = "  "
        var lb = "\n"

        for (var attr of this.classAttrs) {
            attrs += tab + attr.type + " " + attr.name + ";" + lb
        }

        return attrs + lb;
    }

    // Constructor
    generateConstructor() {
        var cons = ""
        var tab = "  "
        var lb = "\n"

        // Cons scope
        var consScope = get_random_element(this.scopes)

        // Cons name
        var consName = this.className

        cons += tab + consScope + " " + consName
        cons += "("

        for (var attr of this.classAttrs) {
            cons += attr.type + " " + attr.name
            if (this.classAttrs.indexOf(attr) != this.classAttrs.length - 1) {
                cons += ", "
            }
        }

        cons += ")" + " {" + lb

        // Cons body
        for (var attr of this.classAttrs) {
            cons += tab + tab + "this." + attr.name + " = " + attr.name + ";" + lb
        }
        cons += tab + "}" + lb + lb

        return cons
    }

    // Methods
    generateMethods() {
        var methods = ""
        var tab = "  "
        var lb = "\n"


        if (this.format == "CamelCase") {
            for (var attr of this.classAttrs) {
                // Getter
                methods += tab + get_random_element(this.scopes) + " " + attr.type + " get" + capitalize_first_letter(attr.name) + "() {" + lb
                methods += tab + tab + "return this." + attr.name + ";" + lb
                methods += tab + "}" + lb + lb

                // Setter
                methods += tab + get_random_element(this.scopes) + " void " + "set" + capitalize_first_letter(attr.name) + "(" + attr.type + " " + attr.name + ") " + " {" + lb
                methods += tab + tab + "this." + attr.name + " = " + attr.name + ";" + lb
                methods += tab + "}" + lb + lb
            }
        } else {
            for (var attr of this.classAttrs) {
                // Getter
                methods += tab + get_random_element(this.scopes) + " " + attr.type + " get_" + attr.name + "() {" + lb
                methods += tab + tab + "return this." + attr.name + ";" + lb
                methods += tab + "}" + lb + lb

                // Setter
                methods += tab + get_random_element(this.scopes) + " void " + "set_" + attr.name + "(" + attr.type + " " + attr.name + ") " + " {" + lb
                methods += tab + tab + "this." + attr.name + " = " + attr.name + ";" + lb
                methods += tab + "}" + lb + lb
            }
        }
        return methods + lb
    }

    generateIdentifier() {
        var identifier_words_num = get_random_int(1, 3)
        var identifer = ""

        if (this.format === "CamelCase") {
            for (var i = 0; i < identifier_words_num; i++) {
                if (i == 0 || identifier_words_num == 1) {
                    identifer += get_random_element(this.animals)
                } else {
                    identifer += capitalize_first_letter(get_random_element(this.animals))
                }
            }
        } else {
            while (identifier_words_num > 0) {
                if (identifier_words_num == 1) {
                    identifer += get_random_element(this.animals)
                } else {
                    identifer += get_random_element(this.animals) + "_"
                }

                identifier_words_num--
            }
        }
        return identifer
    }
}

class Attribute {
    constructor(name, type) {
        this.name = name
        this.type = type
    }
}

function createRandomCode(error_in_code, format) {
    if (error_in_code == 1) {
        return new CodeGenerator("TestClass", 2, true, format).generateCode();
    } else {
        return new CodeGenerator("TestClass", 2, false, format).generateCode();
    }
}

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "Stefan First Trial",
        seed: "42",
        introduction_pages: ["Interessiert mich nicht.\n\nPress [Enter] to continue."],
        pre_run_instruction: "In dieser Aufgabe müssen Sie die vorgebene Klasse prüfen, ob sie einen Compile-Fehler hat.\n\nGeben Sie [1] ein wenn die Klasse einen Fehler hat.\n[2] sonst. \n\nHinweis: Der Fehler kann nur im Konstruktor oder in den Methoden auftauchen! Jede Klasse hat ihre Attribute, einen Konstruktor und die Getter/Setter Methoden. Dabei müssen die Getter/Setter dementsprechend das Prefix get/set haben, ansonsten gilt das als ein Fehlelr\n\nWhen you press [Enter] the tasks directly start.",
        finish_pages: ["Thanks for nothing. When you press [Enter], the experiment's data will be downloaded."],
        layout: [
            { variable: "Format", treatments: ["CamelCase", "Snake_case"] }
        ],
        repetitions: 10,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["1", "2"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
        task_configuration: (t) => {
            // Das hier ist der Code, der jeder Task im Experiment den Code zuweist.
            // Im Feld code steht der Quellcode, der angezeigt wird,
            // in "expected_answer" das, was die Aufgabe als Lösung erachtet
            // In das Feld "given_answer" trägt das Experiment ein, welche Taste gedrückt wurde
            //
            // Ein Task-Objekt hat ein Feld treatment_combination, welches ein Array von Treatment-Objekten ist.
            // Ein Treatment-Objekt hat zwei Felder:
            //     variable - Ein Variable-Objekt, welches das Feld name hat (der Name der Variablen);
            //     value - Ein String, in dem der Wert des Treatments steht.

            t.expected_answer = "" + get_random_int(1, 9);

            if (t.treatment_combination[0].value == "CamelCase") {
                t.expected_answer = get_random_int(1, 2)
                t.code = createRandomCode(t.expected_answer, "CamelCase")
            } else {
                t.expected_answer = get_random_int(1, 2)
                t.code = createRandomCode(t.expected_answer, "SnakeCase")
            }

            // im Feld after_task_string steht eine Lambda-Funktion, die ausgeführt wird
            // wenn eine Task beantwortet wurde. Das Ergebnis der Funktion muss ein String
            // sein.
            t.after_task_string = () => "Given answer: " + t.given_answer + " - Correct answer: " + t.expected_answer;
        }
    }
);

// Hilfsmethoden
function get_random_int(min, max) {
    return Math.floor(Math.random() * max) + min;;
}

function capitalize_first_letter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function get_random_element(array) {
    return array[get_random_int(0, array.length)]
}

function modifyCode(code) {
    var modifiedCode = code

    while (true) {
        modifiedCode = removeCharAtIndex(code, get_random_int(0, code.length))
        if (modifiedCode != "noCharRemoved") {
            break
        }
        modifiedCode = code
    }

    return modifiedCode
}

function removeCharAtIndex(str, index) {
    if (index < 0 || index >= str.length || str[index] == " " || str[index] == "\n") {
        return "noCharRemoved";
    }

    var beforeChar = str.slice(0, index);
    var afterChar = str.slice(index + 1);

    return beforeChar + afterChar;
}