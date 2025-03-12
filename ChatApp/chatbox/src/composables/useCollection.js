

import { ref, onUnmounted } from 'vue';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const useCollection = (collectionName) => {
  const documents = ref([]);
  const hata = ref(null);

  
  const unsubscribe = onSnapshot(
    collection(db, collectionName),
    (snapshot) => {
      documents.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    (error) => {
      console.error('Error fetching documents:', error);
      hata.value = "Could not fetch documents.";
    }
  );

  // Veriyi koleksiyona ekleme
  const addDocument = async (document) => {
    hata.value = null;

    try {
      const colRef = collection(db, collectionName);
      await addDoc(colRef, document);
    } catch (error) {
      console.error('Error adding document:', error);
      hata.value = "The document could not be added.";
    }
  };

  // temizleme işlemi
  onUnmounted(() => {
    unsubscribe();
  });

  return { documents, hata, addDocument };
};

export default useCollection;
