$(function () {
    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyDTIIuq2IGX0DiC0vlXRXhMIlkqR9SiaMM",
        authDomain: "kojs-5d4b5.firebaseapp.com",
        databaseURL: "https://kojs-5d4b5.firebaseio.com",
        projectId: "kojs-5d4b5",
        storageBucket: "",
        messagingSenderId: "330502810409"
    };
    firebase.initializeApp(config);
    const db = firebase.database();
    const ref = db.ref('CHAT');

    /* add to firebase */
    const addToFirebase = text => {
        const key = ref.push().key;
        const todo = {
            created: firebase.database.ServerValue.TIMESTAMP,
            text,
            key
        };
        ref.child(key).set(todo);
    };

    /* remove from firebase */
    const removeFromFirebase = key => {
        ref.child(key).remove();
    }

    /* update firebase */
    const updateFirebase = (key, todo) => {
        ref.child(key).update(todo);
    }


    function AppViewModel() {
        const self = this;

        self.message = ko.observable('');
        self.isLoading = ko.observable(false);

        self.messages = ko.observableArray([]);

        ref.on('value', async snapshot => {
            self.isLoading(true);
            self.messages([]);
            await snapshot.forEach(c => {
                const d = c.val();
                d.created = new Date(d.created);
                self.messages.push(d);
            });
            self.isLoading(false);
        });

        self.add = () => {
            const m = self.message().trim();
            if (m) {
                addToFirebase(m);
                self.message('');
            }
        }

        /*  self.toggle = todo => {
             const todoToUpdate = {
                 ...todo,
                 isDone: !todo.isDone
             };
             updateFirebase(todo.key, todoToUpdate);
         }

         self.remove = todo => {
             removeFromFirebase(todo.key);
         }

         self.getTodo = todo => {
             console.log(todo);
             
         }

         self.todoFilter = param => {
             self.filterState(param);
         } */
    }

    ko.bindingHandlers.enterKey = {
        init: (element, valueAccessor, allBindings, viewModel) => {
            var callback = valueAccessor();
            $(element).keypress(event => {
                var keyCode = (event.which ? event.which : event.keyCode);
                if (keyCode === 13) {
                    callback.call(viewModel);
                    return false;
                }
                return true;
            });
        }
    };
    ko.applyBindings(new AppViewModel());
})