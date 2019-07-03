//import firebase from 'firebase/app';
//import 'firebase/firestore';

function dynamicLoad(url, loadCheck)
{
    return new Promise( (resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
        const iid = setInterval( () => {
            if(loadCheck && loadCheck())
            {
                clearInterval(iid);
                resolve();
            }
        }, 200);
    });
}

const firebaseConfig = {
    apiKey: "AIzaSyClSpwsS-gJDhLihV0M1klrAMEIjwfd7rs",
    authDomain: "designhubz.firebaseapp.com",
    databaseURL: "https://designhubz.firebaseio.com",
    projectId: "designhubz",
    storageBucket: "",
    messagingSenderId: "120137957333",
    appId: "1:120137957333:web:e0ffb63b94838b13"
  };

/** @type {firebase.app.App} */
let _app;
/** @type {firebase.firestore.Firestore} */
let _store;

export default class Firebase
{
    /** @return {Promise<firebase.app.App>} */
    static get app()
    {
        return new Promise( (resolve, reject) => {
            if(!_app)
            {
                // _app = firebase.initializeApp(firebaseConfig);
                dynamicLoad('https://www.gstatic.com/firebasejs/6.2.4/firebase-app.js', () => window['firebase'])
                .then( () => {
                    _app = firebase.initializeApp(firebaseConfig);
                    resolve(_app);
                });
            }
            else
            {
                resolve(_app);
            }
        });
    }

    /** @return {Promise<firebase.firestore.Firestore>} */
    static get store()
    {
        return new Promise( (resolve, reject) => {
            if(!_store)
            {
                Firebase.app
                .then( () => dynamicLoad('https://www.gstatic.com/firebasejs/6.2.4/firebase-firestore.js', () => firebase.firestore) )
                .then( () => {
                    _store = _app.firestore();
                    resolve(_store);
                });
            }
            else
            {
                resolve(_store);
            }
        });
    }

    /**
     * @param {string} path ie: 'presets/default'
     * @param {any} obj 
     */
    static Add(path, obj)
    {
        if(path && path.length > 0)
        {
            const segments = path.split('/');
            if(segments.length % 2 === 1)
            {
                return Firebase.store.then( store => store.collection(path).doc().set(obj));
            }
            return Firebase.store.then( store => store.doc(path).set(obj));
        }
        return Firebase.store.then( store => store.collection('root').add(obj));
    }

    /** @returns {Promise<{id, data}|Array<{id, data}>>} */
    static Get(path)
    {
        if(path && path.length > 0)
        {
            const segments = path.split('/');
            if(segments.length % 2 === 1)
            {
                return Firebase.store.then( store => store.collection(path).get())
                .then(query => Promise.resolve(query.docs.map(doc => { 
                    return {id: doc.id, data: doc.data()};
                })));
            }
            return Firebase.store.then( store => store.doc(path).get())
            .then(snapshot => Promise.resolve({id: snapshot.id, data: snapshot.data()}));
        }

        return new Promise( (resolve, reject) => reject('Invalid path') );
    }
}