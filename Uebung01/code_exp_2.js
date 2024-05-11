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

var words = ["apple", "banana", "orange", "mango", "pineapple", "cat", "dog", "bird", "fish", "rabbit", "house", "car", "tree", "mountain", "river", "sun", "moon", "stars", "sky", "cloud", "book", "pen", "paper", "pencil", "eraser", "chair", "table", "lamp", "sofa", "bed", "computer", "phone", "keyboard", "mouse", "monitor", "clock", "watch", "mirror", "door", "window", "flower", "grass", "rock", "beach", "ocean", "desert", "snow", "ice", "fire", "wind", "rain"];

function get_random_int(min, max) {
    return Math.floor(Math.random() * max) + min;;
}

function random_bool() {
    return document.new_random_integer(2) > 0;
}

function capitalize_first_letter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function get_CamelCase_identifier(words_num) {
    identifier = ""

    for (var i = 1; i <= words_num; i++) {
        identifier += capitalize_first_letter(words[get_random_int(0, words.length)]);
    }

    return identifier;
}

function get_SnakeCase_identifier(words_num) {
    identifier = ""

    for (var i = 1; i <= words_num; i++) {
        if (i == words_num) {
            identifier += words[get_random_int(0, words.length)];
        } else {
            identifier += words[get_random_int(0, words.length)] + "_";
        }

    }

    return identifier;
}

function get_CamelCase_task() {
    task = ""
    min_num_of_words = 0;

    word_lengths = []
    for (i = 0; i < 4; i++) {
        word_lengths.push(get_random_int(1, 9));
        task += i + 1 + ". " + get_CamelCase_identifier(word_lengths[i]) + "\n";
    }

    smallest_length = Math.min(...word_lengths);

    return { task, smallest_length }
}

function get_SnakeCase_task() {
    task = ""
    min_num_of_words = 0;

    word_lengths = []
    for (i = 0; i < 4; i++) {
        word_lengths.push(get_random_int(1, 9));
        task += i + 1 + ". " + get_SnakeCase_identifier(word_lengths[i]) + "\n";
    }

    smallest_length = Math.min(...word_lengths);

    return { task, smallest_length }
}

// Das hier ist die eigentliche Experimentdefinition
document.experiment_definition(
    {
        experiment_name: "Stefan First Trial",
        seed: "42",
        introduction_pages: ["Interessiert mich nicht.\n\nPress [Enter] to continue."],
        pre_run_instruction: "Gleich gehts los.\n\nWhen you press [Enter] the tasks directly start.",
        finish_pages: ["Thanks for nothing. When you press [Enter], the experiment's data will be downloaded."],
        layout: [
            { variable: "Format", treatments: ["CamelCase", "Snake_case"] }
        ],
        repetitions: 30,                    // Anzahl der Wiederholungen pro Treatmentcombination
        accepted_responses: ["1", "2", "3", "4", "5", "6", "7", "8", "9"], // Tasten, die vom Experiment als Eingabe akzeptiert werden
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
                const camelCaseTask = get_CamelCase_task();
                t.code = camelCaseTask.task;
                t.expected_answer = camelCaseTask.smallest_length.toString();
            } else {
                const snakeCaseTask = get_SnakeCase_task();
                t.code = snakeCaseTask.task;
                t.expected_answer = snakeCaseTask.smallest_length.toString();
            }

            // im Feld after_task_string steht eine Lambda-Funktion, die ausgeführt wird
            // wenn eine Task beantwortet wurde. Das Ergebnis der Funktion muss ein String
            // sein.
            t.after_task_string = () => "Given answer: " + t.given_answer + " - Correct answer: " + t.expected_answer;
        }
    }
);