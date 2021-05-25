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
    edit(titleContentNote, textContentNote, index, color) {
        const note = CreateNote.getValues(titleContentNote, textContentNote, color);
        Notes.all.splice(index, 1, note);
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
        li.setAttribute("style", `background-color: ${note.color}`);
        DOM.notesContainer.appendChild(li);
        const textTitle = document.querySelector("#text-title");
        textTitle.textContent = note.title;
        const textBody = document.querySelector("#text-body");
        textBody.textContent = note.text;
    },
    innerHTMLNote(note, index) {
        const html = `
        <div class="note-topbar">
            <span>Last edited: ${note.date}</span>
            <div>
                <label for="note-color${index}"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><g><g><g><path d="M12,22C6.49,22,2,17.51,2,12S6.49,2,12,2s10,4.04,10,9c0,3.31-2.69,6-6,6h-1.77c-0.28,0-0.5,0.22-0.5,0.5 c0,0.12,0.05,0.23,0.13,0.33c0.41,0.47,0.64,1.06,0.64,1.67C14.5,20.88,13.38,22,12,22z M12,4c-4.41,0-8,3.59-8,8s3.59,8,8,8 c0.28,0,0.5-0.22,0.5-0.5c0-0.16-0.08-0.28-0.14-0.35c-0.41-0.46-0.63-1.05-0.63-1.65c0-1.38,1.12-2.5,2.5-2.5H16 c2.21,0,4-1.79,4-4C20,7.14,16.41,4,12,4z"/><circle cx="6.5" cy="11.5" r="1.5"/><circle cx="9.5" cy="7.5" r="1.5"/><circle cx="14.5" cy="7.5" r="1.5"/><circle cx="17.5" cy="11.5" r="1.5"/></g></g></g></g></svg></label>
                <input id="note-color${index}" type="color" name="note-color" class="note-color" value="${note.color}" onchange="Notes.edit('${note.title}', '${note.text}', ${index}, this.value)">
                <button onclick="Notes.remove(${index})"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg></button>
            </div>
        </div>
        <div class="text-area">
            <h1 id="text-title" contenteditable="true" onfocusout="Notes.edit(this.textContent, '${note.text}', ${index}, '${note.color}')"></h1>
            <p id="text-body" contenteditable="true" onfocusout="Notes.edit('${note.title}', this.textContent, ${index}, '${note.color}')"></p>
        </div>
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
    }
};

const CreateNote = {
    getValues(titleContentNote, textContentNote, color) {
        return {
            title: titleContentNote,
            text: textContentNote,
            date: Utils.formatDate(),
            color: color
        };
    },
    render() {
        const note = CreateNote.getValues("Click to edit title", "Click to edit body", "#ffffff");
        Notes.add(note)
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