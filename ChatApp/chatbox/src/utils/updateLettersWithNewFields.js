export const updateLettersWithNewFields = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'letters'));
  
      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(db, 'letters', docSnapshot.id);
        await updateDoc(docRef, {
          receiverId: 'defaultReceiverId',
          letterType: 'personal' 
        });
      });
  
      console.log('All letters updated successfully!');
    } catch (error) {
      console.error('Error updating letters:', error);
    }
  };
  