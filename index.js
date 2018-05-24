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

    // Initialize the FirebaseUI Widget using Firebase.
    const ui = new firebaseui.auth.AuthUI(firebase.auth());

    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: (authResult, redirectUrl) => true,
            uiShown: () => document.getElementById('loader').style.display = 'none'
        },
        signInFlow: 'popup',
        signInSuccessUrl: '#',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        tosUrl: '#'
    };

    // The start method will wait until the DOM is loaded.
    

    function AppViewModel() {
        const self = this;

        self.email = ko.observable('');
        self.password = ko.observable('');
        self.message = ko.observable('');
        self.isLoading = ko.observable(false);
        self.isLoggedIn = ko.observable(false);
        self.toLogin = ko.observable(false);
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

        self.register = () => {
            const email = self.email().trim();
            const password = self.password().trim();
            if (email && password) {
                firebase.auth().createUserWithEmailAndPassword(email, password).then(u => {
                    console.log(u.user.uid);
                    self.isLoggedIn(true);
                    self.email('').password('');
                }).catch(error => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                });
            }
        }

        self.toLoginForm = () => {
            const t = !self.toLogin();
            self.toLogin(t);
            ui.start('#firebaseui-auth-container', uiConfig);
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