/* Initialize Firebase */
if(!window.__FIREBASE_CONFIG__){
  document.body.innerHTML = '<div style="padding:20px;font-family:system-ui">Missing <b>firebase-config.js</b>. Copy <code>firebase-config.sample.js</code> → <code>firebase-config.js</code> and fill your keys.</div>';
  throw new Error('Missing Firebase config');
}
firebase.initializeApp(window.__FIREBASE_CONFIG__);
const auth = firebase.auth();
const db = firebase.firestore();

const $ = (sel)=>document.querySelector(sel);
const appRoot = document.getElementById('app');

/* -------- Views -------- */
function renderLogin(){
  appRoot.innerHTML = `
    <div class="auth">
      <div class="card" style="width:360px">
        <div class="topbar">
          <img src="./logo.png" style="height:28px" onerror="this.style.display='none'"/>
          <b>Admin Login</b>
        </div>
        <label>Email</label>
        <input id="email" class="input" type="email" placeholder="admin@example.com"/>
        <label>Password</label>
        <input id="password" class="input" type="password" placeholder="••••••••"/>
        <button id="loginBtn" class="btn" style="margin-top:12px">Sign in</button>
        <div class="muted" style="margin-top:10px">Tip: Firebase Auth → Email/Password enable karke admin user banaiye.</div>
        <div id="err" style="color:crimson; margin-top:8px; display:none"></div>
      </div>
    </div>`;
  $("#loginBtn").onclick = async ()=>{
    $("#err").style.display='none';
    try{
      await auth.signInWithEmailAndPassword($("#email").value, $("#password").value);
    }catch(e){
      $("#err").textContent = e.message;
      $("#err").style.display = 'block';
    }
  }
}

function renderDashboard(user){
  appRoot.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="topbar">
          <b>Welcome, ${user.email}</b>
          <span class="spacer"></span>
          <button id="logoutBtn" class="btn">Logout</button>
        </div>
        <div class="muted">Manage menu items below (Firestore collection: <code>menu_items</code>)</div>
      </div>

      <div class="card">
        <h3 style="margin-top:0">Add Menu Item</h3>
        <label>Name</label>
        <input id="name" class="input" placeholder="Paneer Tikka"/>
        <label>Price (₹)</label>
        <input id="price" class="input" type="number" placeholder="199"/>
        <button id="addBtn" class="btn" style="margin-top:10px">Add Item</button>
      </div>

      <div class="card">
        <h3 style="margin-top:0">Menu Items</h3>
        <table class="table">
          <thead><tr><th>Name</th><th>Price</th><th></th></tr></thead>
          <tbody id="itemsBody"><tr><td colspan="3" class="muted">Loading…</td></tr></tbody>
        </table>
      </div>
    </div>`;

  $("#logoutBtn").onclick = ()=> auth.signOut();
  $("#addBtn").onclick = async ()=>{
    const name = $("#name").value.trim();
    const price = Number($("#price").value);
    if(!name || !price) return;
    await db.collection('menu_items').add({
      name, price, active:true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    $("#name").value=''; $("#price").value='';
    loadItems();
  }
  loadItems();
}

async function loadItems(){
  const body = $("#itemsBody");
  body.innerHTML = '<tr><td colspan="3" class="muted">Loading…</td></tr>';
  const snap = await db.collection('menu_items').get();
  const rows = [];
  snap.forEach(doc => {
    const d = doc.data();
    rows.push(`<tr>
      <td>${d.name}</td>
      <td>₹${d.price}</td>
      <td><button class="btn" data-del="${doc.id}">Delete</button></td>
    </tr>`);
  });
  body.innerHTML = rows.join('') || '<tr><td colspan="3" class="muted">No items yet.</td></tr>';
  body.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener('click', async (ev)=>{
      const id = ev.currentTarget.getAttribute('data-del');
      await db.collection('menu_items').doc(id).delete();
      loadItems();
    });
  });
}

/* -------- Auth listener -------- */
auth.onAuthStateChanged(u=>{
  if(u) renderDashboard(u);
  else renderLogin();
});
