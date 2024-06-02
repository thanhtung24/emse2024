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

// Das hier ist die eigentliche Experimentdefinition

function createTask(parameter_num, parameter_length, format) {
    animals = ["dog", "cat", "elephant", "lion", "tiger", "bear", "monkey", "giraffe", "zebra", "rabbit", "snake", "crocodile", "hippopotamus", "kangaroo", "penguin", "panda", "wolf", "fox", "deer", "rhinoceros", "cheetah", "gorilla", "koala", "buffalo", "camel", "elephant", "octopus", "polarbear", "shark", "jaguar", "dolphin", "owl", "platypus", "squirrel", "turtle", "hedgehog", "flamingo", "koala", "seal", "whale", "elephant", "zebra", "giraffe", "frog", "penguin", "panda", "peacock", "parrot", "butterfly"]
    methodPrefixes = ["create", "get", "is", "set", "generate", "find"]
    scopes = ["public", "protected", "private"]
    types = ["String", "boolean", "int", "float", "double"]
    task = ""

    // Method definition
    task += get_random_element(scopes) + " " + get_random_element(types) + " " + get_random_element(methodPrefixes)

    if (format == "CamelCase") {
        // Name
        task += capitalize_first_letter(get_random_element(animals))
        task += "("

        // Parameter
        while (parameter_num > 0) {
            task += get_random_element(types) + " "
            task += createIdentifier(parameter_length, format)
            if (parameter_num != 1) {
                task += ", "
            }
            parameter_num--
        }
        task += ")"
    } else {
        // Name
        task += "_" + get_random_element(animals)
        task += "("

        // Parameter
        while (parameter_num > 0) {
            task += get_random_element(types) + " "
            task += createIdentifier(parameter_length, format)
            if (parameter_num != 1) {
                task += ", "
            }
            parameter_num--
        }
        task += ")"
    }

    return task
}

function createIdentifier(words_num, format) {
    identifier = ""

    if (format == "CamelCase") {
        for (var i = 0; i < words_num; i++) {
            identifier += (i == 0) ? get_random_element(animals) : capitalize_first_letter(get_random_element(animals))
        }
    } else {
        for (var i = 0; i < words_num; i++) {
            identifier += (i == 0) ? get_random_element(animals) : "_" + get_random_element(animals)
        }
    }

    return identifier
}

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
        repetitions: 20,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["1", "2", "3", "4", "5", "6"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
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

            t.expected_answer = get_random_int(1, 6);
            var parameter_length = get_random_int(1, 5)

            if (t.treatment_combination[0].value == "CamelCase") {
                t.code = createTask(t.expected_answer, parameter_length, "CamelCase")
            } else {
                t.code = createTask(t.expected_answer, parameter_length, "SnakeCase")
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