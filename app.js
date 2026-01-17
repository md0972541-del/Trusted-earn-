const firebaseConfig = { 
    apiKey: "AIzaSyA-panokwAfLZD8em4uQ7_Thwk3DmbF_3Q", 
    authDomain: "trustearn-be67f.firebaseapp.com",
    databaseURL: "https://trustearn-be67f-default-rtdb.firebaseio.com/",
    projectId: "trustearn-be67f",
    appId: "1:809402864977:web:c6c4941608d73cdbbfef70" 
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// লগইন চেক ও ড্যাশবোর্ড আপডেট
auth.onAuthStateChanged(user => {
    if (!user && !window.location.href.includes('auth.html')) {
        window.location.href = 'auth.html';
    } else if (user) {
        db.ref('users/' + user.uid).on('value', s => {
            let data = s.val() || {};
            if(document.getElementById('balance')){
                document.getElementById('balance').innerText = data.balance || 0;
                document.getElementById('pkg').innerText = data.package || "None";
                document.getElementById('user-uid').innerText = user.uid;
                
                // ১৫ দিন মেয়াদ চেক লজিক [cite: 2026-01-14]
                if (data.expiry) {
                    let timeLeft = data.expiry - Date.now();
                    if (timeLeft <= 0) {
                        document.getElementById('days-left').innerText = "মেয়াদ শেষ!";
                        db.ref('users/' + user.uid).update({ package: "None", expiry: null });
                    } else {
                        let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                        document.getElementById('days-left').innerText = days + " দিন বাকি";
                    }
                } else {
                    document.getElementById('days-left').innerText = "প্যাকেজ কিনুন";
                }
            }
        });
    }
});

// প্যাকেজ কেনা (মেয়াদ ১৫ দিন) [cite: 2026-01-14]
function buyPkg(name, price) {
    const user = auth.currentUser;
    db.ref('users/' + user.uid).once('value', s => {
        let bal = s.val().balance || 0;
        if(bal >= price) {
            let limits = { 'Bronze': 5, 'Silver': 15, 'Gold': 25, 'Diamond': 50, 'Vip1': 100, 'Vip2': 150, 'Vip3': 250 };
            let expiryDate = Date.now() + (15 * 24 * 60 * 60 * 1000); 
            db.ref('users/' + user.uid).update({ 
                balance: bal - price, package: name, dailyLimit: limits[name], tasksDone: 0, expiry: expiryDate 
            });
            alert(name + " কেনা সফল! মেয়াদ ১৫ দিন।");
            window.location.href = "index.html";
        } else { alert("ব্যালেন্স নেই!"); }
    });
}

// অথেন্টিকেশন
function handleAuth(type) {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    if(type === 'signup') {
        auth.createUserWithEmailAndPassword(email, pass).then(res => {
            db.ref('users/' + res.user.uid).set({ balance: 0, package: "None" });
            window.location.href = 'index.html';
        });
    } else {
        auth.signInWithEmailAndPassword(email, pass).then(() => { window.location.href = 'index.html'; });
    }
}
function logout() { auth.signOut(); }
