$(function () {

    /* FIREBASE SIGNUP */
    const firebaseSignUp = (email, password) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            
            // ...
        });
    }

    $('#signup').on('click', _ => {
        const email = $('#email').val();
        const password = $('#password').val();
        firebaseSignUp(email, password);

    })

    // Initialize the FirebaseUI Widget using Firebase.
    const ui = new firebaseui.auth.AuthUI(firebase.auth());

    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: (authResult, redirectUrl) => true,
            uiShown: () => document.getElementById('loader').style.display = 'none'
        },
        signInFlow: 'popup',
        signInSuccessUrl: './chat.html',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        tosUrl: '#'
    };

    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
})