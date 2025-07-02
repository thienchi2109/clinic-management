import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';

// This function checks if a collection is empty, and if so, seeds it with mock data.
// It then returns all documents from the collection.
export async function seedAndFetchCollection<T extends { id: string }>(
  collectionName: string,
  mockData: T[]
): Promise<T[]> {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);

  if (snapshot.empty && mockData.length > 0) {
    try {
      const batch = writeBatch(db);
      mockData.forEach((item) => {
        // Use the item's own ID from mock data for the document ID
        const docRef = doc(collectionRef, item.id);
        batch.set(docRef, item);
      });
      await batch.commit();
      console.log(`Seeded '${collectionName}' collection.`);
      return mockData;
    } catch (error) {
      console.error(`Error seeding ${collectionName}:`, error);
      return []; // Return empty array on seeding error
    }
  } else {
    return snapshot.docs.map((doc) => ({ ...(doc.data() as T), id: doc.id }));
  }
}
