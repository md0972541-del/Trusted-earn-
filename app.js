// Firebase Config (সাফায়েত, এখানে তোমার নিজের কী-গুলো বসানো আছে)
const firebaseConfig = { 
    apiKey: "AIzaSyA-panokwAfLZD8em4uQ7_Thwk3DmbF_3Q", 
    databaseURL: "https://trustearn-be67f-default-rtdb.firebaseio.com/" 
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// লগইন/সাইনআপ সিস্টেম
function handleAuth(type) {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    if(type === 'signup') {
        auth.createUserWithEmailAndPassword(email, pass).then(res => {
            // নতুন ইউজারের প্রোফাইল তৈরি [cite: 2026-01-14]
            db.ref('users/' + res.user.uid).set({
                balance: 0,
                package: "None",
                refBy: document.getElementById('ref-code').value || "Direct"
            });
            alert("অ্যাকাউন্ট সফল হয়েছে!");
        });
    } else {
        auth.signInWithEmailAndPassword(email, pass);
    }
}

// প্যাকেজ কেনা ও টাকা কাটা [cite: 2026-01-14]
function buyPkg(name, price) {
    const user = auth.currentUser;
    db.ref('users/' + user.uid).once('value', s => {
        let bal = s.val().balance;
        if(bal >= price) {
            db.ref('users/' + user.uid).update({ balance: bal - price, package: name });
            alert(name + " কেনা সফল!");
        } else {
            alert("টাকা নেই! আগে ডিপোজিট করুন।");
        }
    });
}
