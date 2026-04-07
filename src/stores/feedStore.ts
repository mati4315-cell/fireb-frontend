import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  startAfter,
  getDocs,
  addDoc,
  type Unsubscribe 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuthStore } from './authStore';

export const useFeedStore = defineStore('feed', () => {
  const authStore = useAuthStore();

  const allItems = ref<any[]>([]);
  const currentTab = ref('todo');
  const loading = ref(false);
  const hasMore = ref(true);
  const unsubscribe = ref<Unsubscribe | null>(null);

  // COMPUTED: Filtros por tipo
  const todoItems = computed(() => allItems.value);
  const noticiasItems = computed(() =>
    allItems.value.filter(item => item.type === 'news')
  );
  const comunidadItems = computed(() =>
    allItems.value.filter(item => item.type === 'post')
  );

  // Inicializar real-time listener
  const initFeed = () => {
    if (unsubscribe.value) {
      unsubscribe.value(); // Limpiar listener anterior
    }

    loading.value = true;

    try {
      const q = query(
        collection(db, 'content'),
        where('deletedAt', '==', null),         // Excluir borrados
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      // Real-time listener
      unsubscribe.value = onSnapshot(q, (snapshot) => {
        const items: any[] = [];

        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data()
          });
        });

        allItems.value = items;
        loading.value = false;
        hasMore.value = items.length >= 20; 
      });
    } catch (error) {
      console.error('Error initializing feed:', error);
      loading.value = false;
    }
  };

  // Cargar más items
  const loadMore = async () => {
    if (!hasMore.value || loading.value || allItems.value.length === 0) return;

    loading.value = true;

    try {
      const lastItem = allItems.value[allItems.value.length - 1];

      const q = query(
        collection(db, 'content'),
        where('deletedAt', '==', null),
        orderBy('createdAt', 'desc'),
        startAfter(lastItem.createdAt),  // Cursor-based
        limit(20)
      );

      const snapshot = await getDocs(q);
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Deduplicar
      const newItemsFiltered = newItems.filter(
        newItem => !allItems.value.some(existing => existing.id === newItem.id)
      );

      allItems.value.push(...newItemsFiltered);
      hasMore.value = newItems.length >= 20;
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      loading.value = false;
    }
  };

  // Crear nuevo post
  const createPost = async (titulo: string, descripcion: string, images: string[] = []) => {
    if (!authStore.user || !authStore.userProfile) {
      throw new Error('No autenticado');
    }

    try {
      const newPost = {
        type: 'post',
        titulo,
        descripcion,
        images: images || [],
        userId: authStore.user.uid,
        userName: authStore.userProfile.nombre,  // DENORMAL
        userProfilePicUrl: authStore.userProfile.profilePictureUrl,
        stats: {
          likesCount: 0,
          commentsCount: 0,
          viewsCount: 0
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };

      const docRef = await addDoc(collection(db, 'content'), newPost);
      return { id: docRef.id, ...newPost };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  // Cleanup
  const cleanup = () => {
    if (unsubscribe.value) {
      unsubscribe.value();
    }
  };

  return {
    allItems,
    todoItems,
    noticiasItems,
    comunidadItems,
    currentTab,
    loading,
    hasMore,
    initFeed,
    loadMore,
    createPost,
    cleanup
  };
});
