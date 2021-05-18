const StoragedNotes = {
    get() {
        return JSON.parse(localStorage.getItem("NotesApp:notes")) || [];
    },
    set(notes) {
        localStorage.setItem("NotesApp:notes", JSON.stringify(notes));
    }
};

const Notes = {
    all: StoragedNotes.get(),
    add(note) {
        Notes.all.push(note);
        App.reload();
    },
    remove(index) {
        Notes.all.splice(index, 1);
        App.reload();
    }
};

const DOM = {
    notesContainer: document.querySelector("ul"),
    addNote(note, index) {
        const li = document.createElement("li");
        li.innerHTML = DOM.innerHTMLNote(note, index);
        li.dataset.index = index;
        DOM.notesContainer.appendChild(li);
    },
    innerHTMLNote(note, index) {
        const html = `
        <div class="text-area"><p>${note.text}</p><span>${note.date}</span></div> <div class="remove-area"><button onclick="Notes.remove(${index})">X</button></div>
        `;
        return html;
    },
    clearNotes() {
        DOM.notesContainer.innerHTML = "";
    }
};

const Utils = {
    formatDate() {
        return new Date().toString().substring(0, 21);
    },
    addErrorBox() {
        Form.textInput.classList.add("error");
    },
    removeErrorBox() {
        Form.textInput.classList.remove("error");
    }
};

const Form = {
    textInput: document.querySelector("input#note"),
    getValues() {
        return {
            text: Form.textInput.value,
            date: Utils.formatDate(),
        };
    },
    validateField() {
        const { text } = Form.getValues()
        if (text.trim() === "") {
            Utils.addErrorBox();
            throw new Error("Please fill in that field");
        }
    },
    clearInputField() {
        Form.textInput.value = "";
    },
    submit(event) {
        event.preventDefault();
        try {
            Form.validateField();
            const note = Form.getValues();
            Notes.add(note)
            Form.clearInputField();
        } catch (error) {
            alert(error.message)
        }
    }
};

const App = {
    init() {
        Notes.all.forEach(DOM.addNote);
        StoragedNotes.set(Notes.all);
    },
    reload() {
        DOM.clearNotes();
        App.init();
    }
};

App.init();