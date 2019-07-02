import firebase from 'firebase/app';
import 'firebase/firestore';

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
    static get app()
    {
        if(!_app)
        {
            _app = firebase.initializeApp(firebaseConfig);
        }
        return _app;
    }

    static get store()
    {
        if(!_store)
        {
            _store = Firebase.app.firestore();
        }
        return _store;
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
                return Firebase.store.collection(path).doc().set(obj);
            }
            return Firebase.store.doc(path).set(obj);
        }
        return Firebase.store.collection('root').add(obj);
    }

    /** @returns {Promise<{id, data}|Array<{id, data}>>} */
    static Get(path)
    {
        if(path && path.length > 0)
        {
            const segments = path.split('/');
            if(segments.length % 2 === 1)
            {
                return Firebase.store.collection(path).get()
                .then(query => Promise.resolve(query.docs.map(doc => { 
                    return {id: doc.id, data: doc.data()};
                })));
            }
            return Firebase.store.doc(path).get()
            .then(snapshot => Promise.resolve({id: snapshot.id, data: snapshot.data()}));
        }

        return new Promise( (resolve, reject) => reject('Invalid path') );
    }
}