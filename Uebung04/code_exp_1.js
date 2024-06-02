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
    identifiers = []
    modified_identifiers = []

    // Words
    animals = ["dog", "cat", "elephant", "lion", "tiger", "bear", "monkey", "giraffe", "zebra", "rabbit", "snake", "crocodile", "hippopotamus", "kangaroo", "penguin", "panda", "wolf", "fox", "deer", "rhinoceros", "cheetah", "gorilla", "koala", "buffalo", "camel", "elephant", "octopus", "polarbear", "shark", "jaguar", "dolphin", "owl", "platypus", "squirrel", "turtle", "hedgehog", "flamingo", "koala", "seal", "whale", "elephant", "zebra", "giraffe", "frog", "penguin", "panda", "peacock", "parrot", "butterfly"]

    methodPrefixes = ["create", "get", "is", "set", "generate", "find"]

    scopes = ["public", "protected", "private"]

    types = ["String", "boolean", "int", "float", "double"]


    constructor(className, identifier_num, format, id, call_times) {
        this.className = className
        this.format = format
        this.id = id
        this.call_times = call_times
        this.identifiers = this.initialize_Identifiers(identifier_num)
        this.modified_identifiers = split_array(this.identifiers)
    }

    initialize_Identifiers(identifier_num) {
        var ids = []

        while (identifier_num > 0) {
            var identifer = this.generateIdentifier(this.format)

            if (identifer != this.id) {
                ids.push(identifer)
                identifier_num--
            }
        }

        while (this.call_times > 0) {
            ids.push(this.id)
            this.call_times--
        }

        shuffle_array(ids)

        return ids
    }

    generateCode() {
        var code = ""
        // Expected Identifier
        code += "Identifier: " + this.id + "\n" + "\n"

        // Class name
        code += "class " + this.className + " {\n" + "\n"

        // Methods
        code += this.generateMethods()

        code += "}"

        return code
    }

    generateMethods() {
        var methods = ""
        var tab = "  "
        var lb = "\n"

        for (var ids of this.modified_identifiers) {
            methods += this.generateMethod(ids)
        }

        return methods + lb
    }

    generateMethod(identifiers) {
        var method = ""
        var tab = "  "
        var lb = "\n"

        // public void addABC()
        method += tab + get_random_element(this.scopes) + " void " + this.generateIdentifier(this.format) + "() " + " {" + lb

        // Method content
        for (var i of identifiers) {
            method += tab + tab + this.generateCodeLine(i) + lb
        }

        method += tab + "}" + lb + lb
        return method
    }

    generateCodeLine(identifer) {
        var code_line_generator = get_random_int(1, 3)

        if (code_line_generator == 1) {
            return this.generateCodeLine1(identifer)
        } else if (code_line_generator == 2) {
            return this.generateCodeLine2(identifer)
        } else {
            return this.generateCodeLine3(identifer)
        }
    }

    generateCodeLine1(identifer) {
        // int abc = abcd
        return get_random_element(this.types) + " " + this.generateIdentifier(this.format) + " = " + identifer + ";"
    }

    generateCodeLine2(identifer) {
        // int abc = abcd()
        return get_random_element(this.types) + " " + this.generateIdentifier(this.format) + " = " + identifer + "()" + ";"
    }

    generateCodeLine3(identifer) {
        // abc()
        return identifer + "();"
    }

    generateIdentifier(format) {
        var identifier_length = get_random_int(1, 3)
        var identifer = ""

        if (format === "CamelCase") {
            for (var i = 0; i < identifier_length; i++) {
                if (i == 0 || identifier_length == 1) {
                    identifer += get_random_element(this.animals)
                } else {
                    identifer += capitalize_first_letter(get_random_element(this.animals))
                }
            }
        } else {
            for (var i = 0; i < identifier_length; i++) {
                if (identifier_length == 1) {
                    identifer += get_random_element(this.animals)
                } else {
                    identifer += get_random_element(this.animals) + "_"
                }
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

function createRandomCode(format, call_times) {
    var identifier_num = get_random_int(10, 20)
    var code_generator = new CodeGenerator("TestClass", 0, format, "testId", call_times)
    var expected_identifier = code_generator.generateIdentifier(format)

    return new CodeGenerator("TestClass", identifier_num, format, expected_identifier, call_times).generateCode()
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
        accepted_responses: ["1", "2", "3", "4", "5"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
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

            t.expected_answer = get_random_int(1, 5);

            if (t.treatment_combination[0].value == "CamelCase") {
                t.code = createRandomCode("CamelCase", t.expected_answer)
            } else {
                t.code = createRandomCode("SnakeCase", t.expected_answer)
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

function shuffle_array(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function split_array(array) {
    let result = [];
    let i = 0;

    while (i < array.length) {
        let chunkSize = Math.floor(Math.random() * (array.length - i)) + 1;
        let chunk = array.slice(i, i + chunkSize);
        result.push(chunk);
        i += chunkSize;
    }

    return result;
}

function removeCharAtIndex(str, index) {
    if (index < 0 || index >= str.length || str[index] == " " || str[index] == "\n") {
        return "noCharRemoved";
    }

    var beforeChar = str.slice(0, index);
    var afterChar = str.slice(index + 1);

    return beforeChar + afterChar;
}