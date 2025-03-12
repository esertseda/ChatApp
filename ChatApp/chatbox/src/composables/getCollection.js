import { ref } from 'vue';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const getCollection = (collectionName) => {
  const documents = ref([]);
  const hata = ref(null);

  // Koleksiyon referansı
  const collectionRef = collection(db, collectionName);

  // Sorgu
  const q = query(collectionRef, orderBy('creationDate'));

  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    let results = [];
    snapshot.docs.forEach(doc => {
      if (doc.data().creationDate) {
        results.push({ ...doc.data(), id: doc.id });
      }
    });
    documents.value = results;
    hata.value = null;
  }, (error) => {
    documents.value = [];
    hata.value = 'Data could not be pulled: ' + error.message;
  });

  return { hata, documents, unsubscribe };
};

export default getCollection;
