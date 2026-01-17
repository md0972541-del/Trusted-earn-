// তোমার Firebase Config
const firebaseConfig = { 
    apiKey: "AIzaSyA-panokwAfLZD8em4uQ7_Thwk3DmbF_3Q", 
    authDomain: "trustearn-be67f.firebaseapp.com",
    databaseURL: "https://trustearn-be67f-default-rtdb.firebaseio.com/",
    projectId: "trustearn-be67f",
    appId: "1:809402864977:web:c6c4941608d73cdbbfef70" 
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.database();

console.log("Firebase Initialized for Hacker Safait"); [cite: 2026-01-09]

// মেইন অথেন্টিকেশন ফাংশন
function handleAuth(type) {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    
    if(!email || !pass) return alert("ইমেইল ও পাসওয়ার্ড দিন!");

    if(type === 'signup') {
        auth.createUserWithEmailAndPassword(email, pass)
        .then(res => {
            console.log("Signup Success");
            db.ref('users/' + res.user.uid).set({
                balance: 0,
                package: "None",
                refBy: document.getElementById('ref-by').value || "Direct",
                time: Date.now()
            }).then(() => {
                alert("আইডি খোলা সফল হয়েছে!");
                window.location.href = 'index.html';
            });
        })
        .catch(err => alert("এরর: " + err.message));
    } else {
        auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            console.log("Login Success");
            window.location.href = 'index.html';
        })
        .catch(err => alert("এরর: " + err.message));
    }
}
