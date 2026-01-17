const firebaseConfig = {
  apiKey: "AIzaSyA-panokwAfLZD8em4uQ7_Thwk3DmbF_3Q",
  authDomain: "trustearn-be67f.firebaseapp.com",
  databaseURL: "https://trustearn-be67f-default-rtdb.firebaseio.com/",
  projectId: "trustearn-be67f",
  storageBucket: "trustearn-be67f.firebasestorage.app",
  messagingSenderId: "809402864977",
  appId: "1:809402864977:web:c6c4941608d73cdbbfef70"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// উইথড্র ফাংশন (১০% ফি ও 200 টাকা লিমিট)
function submitWithdraw(amount, number, method) {
    if(amount < 50) return alert("মিনিমাম ৫০ টাকা লাগবে");
    let fee = amount * 0.10; [cite: 2026-01-14]
    let final = amount - fee;
    db.ref('withdraws').push({
        user: auth.currentUser.email,
        amount: amount,
        finalAmount: final,
        number: number,
        method: method,
        status: "Pending"
    });
    alert("সফল! ১০% ফি বাদে পাবেন " + final + " টাকা।");
}
