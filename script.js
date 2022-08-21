{
'use strict';

  var config = {
    apiKey: "AIzaSyCMyR1NhBvUaB4RVtqfnvMublvoa5tMnxU",
    authDomain: "myfirebacechatapp-b7442.firebaseapp.com",
    projectId: "myfirebacechatapp-b7442",
    storageBucket: "myfirebacechatapp-b7442.appspot.com",
    messagingSenderId: "1024498187525",
    appId: "1:1024498187525:web:c39a25a02f5cff02348b6c",
    measurementId: "G-G10RD3XP4P"
  };
  firebase.initializeApp(config);
  
  var db = firebase.firestore();
  db.settings({
    timestampsInSnapshots: true
  });
  var collection = db.collection('bookmarks');

  const auth = firebase.auth();
  let  me = null;
  
  const message = document.getElementById('message');
  const login = document.getElementById('login');
  const logout = document.getElementById('logout');
  const form = document.querySelector('form');
  const parent = document.getElementById('parent');


  login.addEventListener('click', () =>{
    auth.signInAnonymously();
  });

  logout.addEventListener('click', () =>{
    auth.signOut();
  });

  auth.onAuthStateChanged(user => {
    if(user){
      me = user;

      while (parent.firstChild){
        parent.removeChild(parent.firstChild);
      }

      collection.orderBy('created').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type === 'added'){
            const li = document.createElement('div');
            li.id = 'child';
            const d = change.doc.data();
            li.textContent =  d.uid.substr(0, 8) + ': ' + d.message;
            const parent = document.getElementById('parent');
            parent.appendChild(li);
          }
        });
      });
      console.log(`Logged in as: ${user.uid}`);
      login.classList.add('hidden');
      [logout, form, parent].forEach(el => {
        el.classList.remove('hidden');
      });
      message.focus();
      return;
    }
    me = null;
    console.log('Nobody is logged in');
    login.classList.remove('hidden');
    [logout, form, parent].forEach(el => {
      el.classList.add('hidden');
    });
  });

  // function createArea (message) {
  //   var area = document.createElement('div');
  //   area.id = 'child';
  //   area.textContent = 'test';
  //   var parent = document.getElementById('parent');
  //   parent.appendChild(area);
  // }
  // collection.get().then(createArea(message.value));

  form.addEventListener('submit', e =>{
    e.preventDefault();

    const val = message.value.trim();
    if(val === ""){
      return;
    }

    message.value = '';
    message.focus();

    collection.add({ 
      message: val,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      uid: me ? me.uid : 'nobody'
    })
    .then(doc => {
      console.log(`${doc.id} append!`);
    })
    .catch(error => {
      console.log('document add error!');
      console.log(error);
    });
  });
}