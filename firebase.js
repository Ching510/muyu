// 從 Firebase 引入需要的功能
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase 設定碼
const firebaseConfig = {
  apiKey: "AIzaSyA4FIxEfe4FKFzDqhZlOe-po-JImnldRcU",
  authDomain: "muyu-44d2d.firebaseapp.com",
  projectId: "muyu-44d2d",
  storageBucket: "muyu-44d2d.firebasestorage.app",
  messagingSenderId: "583631154526",
  appId: "1:583631154526:web:bba6c1514fcc0ae1f5f3cf"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firestore 資料庫
const db = getFirestore(app);

// 提交分數到排行榜
export async function submitScore(name, score) {
  try {
    // 在 leaderboard 集合裡新增一筆資料
    await addDoc(collection(db, "leaderboard"), {
      name: name,   // 玩家名稱
      score: score, // 功德數
      time: new Date() // 提交時間
    });
    console.log("分數提交成功！");
  } catch (e) {
    console.error("提交失敗：", e);
  }
}

// 取得排行榜前 10 名
export async function getLeaderboard() {
  // 查詢 leaderboard 集合，按 score 由高到低排序，取前 10 筆
  const q = query(
    collection(db, "leaderboard"),
    orderBy("score", "desc"),
    limit(10)
  );
  const snapshot = await getDocs(q);

  // 把資料整理成陣列回傳
  return snapshot.docs.map(doc => doc.data());
}