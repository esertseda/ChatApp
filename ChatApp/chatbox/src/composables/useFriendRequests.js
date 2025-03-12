import { ref } from 'vue';
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useFriendRequests() {
  const friendRequests = ref([]);
  const friendsList = ref([]); 

 
  const getUsernameById = async (userId) => {
    try {
      if (!userId) {
        return 'Unknown'; 
      }

      const userCollectionRef = collection(db, 'users'); 
      const q = query(userCollectionRef, where('uid', '==', userId)); 
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; 
        return userDoc.data().username || 'Unknown'; 
      } else {
        return 'Unknown'; 
      }
    } catch (error) {
      console.error('Error getting username:', error);
      return 'Unknown'; 
    }
  };

  // kullanıcının arkadaşlarını yükle
  const loadFriends = async (userId) => {
    try {
      const q = query(
        collection(db, 'friends'),
        where('status', '==', 'accepted'),
        where('user1', '==', userId) // Sadece kullanıcının arkadaşlarını getir
      );
      const querySnapshot = await getDocs(q);

      const friends = [];
      for (const docSnapshot of querySnapshot.docs) {
        const friend = docSnapshot.data();
        friends.push(friend.user2);
      }

      friendsList.value = friends;
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  // Arkadaşlık isteklerini yükle
  const loadRequests = async (userId) => {
    try {
      if (!userId) {
        console.error('UserId is missing');
        return; 
      }

      await loadFriends(userId); 

      const q = query(
        collection(db, 'friends'),
        where('user2', '==', userId),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);

      
      const requests = [];
      for (const docSnapshot of querySnapshot.docs) {
        const request = { id: docSnapshot.id, ...docSnapshot.data() };
        request.user1Username = await getUsernameById(request.user1); 
        requests.push(request);
      }

      friendRequests.value = requests; 
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  // Arkadaşlık isteği gönderme fonksiyonu
  const sendFriendRequest = async (receiverId, user) => {
    try {
      await loadFriends(user);

      // Eğer alıcı, zaten arkadaşsa, istek gönderme
      if (friendsList.value.includes(receiverId)) {
        console.error('Already friends, cannot send request.');
        return;
      }

      const requestRef = collection(db, 'friends');
      await addDoc(requestRef, {
        user1: user,
        user2: receiverId,
        status: 'pending',
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // istek kabul etme fonksiyonu
  const acceptRequest = async (requestId, userId) => {
    try {
      const requestRef = doc(db, 'friends', requestId);
      await updateDoc(requestRef, { status: 'accepted' });
      await loadRequests(userId); // İstekleri yeniden yükle ve kabul edilen isteği kaldır
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  // istek reddetme fonksiyonu
  const declineRequest = async (requestId, userId) => {
    try {
      const requestRef = doc(db, 'friends', requestId);
      await updateDoc(requestRef, { status: 'declined' });
      await loadRequests(userId); // İstekleri yeniden yükle ve reddedilen isteği kaldır
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  return { friendRequests, loadRequests, acceptRequest, declineRequest, sendFriendRequest };
}
