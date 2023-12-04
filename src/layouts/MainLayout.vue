<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="q-header-print" v-model="headerVisible" :model-value="headerVisible">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          ADMINPANEL
        </q-toolbar-title>

        <div style="background-color: red">
          <q-item clickable v-on:click="logoutUser">
            <q-item-section avatar>
              <q-icon name="exit_to_app" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Logout</q-item-label>
              <q-item-label caption></q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="print-hide" v-print-hide="isPrinting">
      <q-list>
        <!-- <q-item-label
          header
        > -->
        <div class="row">
          <div class="col-md-10" style="padding-left: 57px">
            <q-img src="/images/icon.png"></q-img>
          </div>
        </div>
        <!-- </q-item-label> -->

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />

        <q-item clickable v-on:click="logoutUser">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label caption></q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent, ref, provide } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useStore } from 'vuex'; // Import the useStore function
import { useRouter } from 'vue-router'; // Import the useRouter function

import { api } from "boot/axios";


const store = useStore(); // Get the store instance
const linksList = [
  {
    title: 'Dashboard',
    caption: null,
    icon: 'dashboard',
    link: '/home'
  },
  {
    title: 'Glass MM List',
    caption: null,
    icon: 'list',
    link: '/glass_mm/list/'
  },
  {
    title: 'Brand List',
    caption: null,
    icon: 'branding_watermark',
    link: '/brand/list/'
  },
  {
    title: 'Category List',
    caption: null,
    icon: 'category',
    link: '/category/list/'
  },
  {
    title: 'Material List',
    caption: null,
    icon: 'list',
    link: '/material/list/'
  },
  {
    title: 'Price Map',
    caption: null,
    icon: 'currency_rupee',
    link: '/price_list/list/'
  },
  {
    title: 'Product List',
    caption: null,
    icon: 'inventory',
    link: '/product/list/'
  },
  {
    title: 'Client List',
    caption: null,
    icon: 'people',
    link: '/client/list/'
  },
  {
    title: 'Sub Admin List',
    caption: null,
    icon: 'admin_panel_settings',
    link: '/sub_admin/list/'
  },
  {
    title: 'Quotation List',
    caption: null,
    icon: 'list',
    link: '/quotation/list'
  },
  {
    title: 'Bill List',
    caption: null,
    icon: 'receipt_long',
    link: '/bill/list'
  },
  {
    title: 'Generate Report',
    caption: null,
    icon: 'summarize',
    link: '/report'
  },
  {
    title: 'Transactions Report',
    caption: null,
    icon: 'point_of_sale',
    link: '/transaction'
  },
  {
    title: 'Change Password',
    caption: null,
    icon: 'key',
    link: '/change_password'
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup() {
    const leftDrawerOpen = ref(true)
    const store = useStore(); // Get the store instance
    const router = useRouter(); // Get the router instance
    const headerVisible = ref(true);

    provide('leftDrawerOpen', leftDrawerOpen);
    provide('headerVisible', headerVisible);
    const token = store.getters['auth/getToken'];

    const logoutUser = async () => {
      try {
        // Call your logout API here
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await api
          .post("/api/admin/logout")
          .then(() => {
            store.dispatch('auth/logout');
            
            // Clear the local store state
            // store.commit('auth/clearAuthState');
            // Redirect to the login page or any desired route
            router.push('/'); // Make sure to adjust the route
          })
          .catch((error) => {

            console.log("Error:", error);
          })

      } catch (error) {
        console.error('Error logging out:', error);
        // Handle error if needed
      }
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      headerVisible,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logoutUser
    }
  },

  methods: {
    // logoutUser() {
    //   this.$store.commit('auth/clearAuthState');
    //   this.$store.dispatch('auth/logout'); // Clear persisted state
    //   // Redirect to the login page or any desired route
    //   this.$router.push('/'); // Make sure to adjust the route
    // },
  }
})
</script>
