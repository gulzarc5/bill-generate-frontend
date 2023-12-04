import { reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { api } from 'boot/axios';

const store = useStore(); 

const CategoryList = {
    async fetchCategories() {
      try {
        const token = store.getters['auth/getToken'];
        console.log(token);
        // Add the token to the headers
        const response = await api.get('/api/admin/category/list', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
            throw new Error('Error fetching categories');
      }
    }
  };
  
export default CategoryList;