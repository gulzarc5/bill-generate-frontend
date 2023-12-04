<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center background">
        <!-- <div
          id="particles-js"
          :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
        ></div> -->

        <q-card class="login-form" v-bind:style="$q.platform.is.mobile ? { width: '80%' } : { width: '30%' }
          ">
          <q-card-section>
            <!-- <q-avatar
              size="74px"
              class="absolute"
              style="top: 0; right: 25px; transform: translateY(-50%)"
            >
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar> -->
            <q-img src="images/1.png"></q-img>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis log">LOGIN</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="loginHandle" class="q-gutter-md">
              <q-input filled v-model="username" label="Username" lazy-rules :rules="[
                (val) => (val && val.length > 0) || 'Please type username',
              ]" />
              <q-input type="password" filled v-model="password" label="Password" lazy-rules :rules="[
                (val) => (val && val.length > 0) || 'Please type password',
              ]" />

              <div class="login-button">
                <q-btn label="Login" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { api } from "boot/axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router"; // Import the useRouter function
import { useQuasar } from "quasar";

const store = useStore(); // Get the store instance
const router = useRouter(); // Get the router instance
const $q = useQuasar();
const username = ref(null);
const password = ref(null);

async function loginHandle() {
  $q.loading.show({
    message: "Some important process  is in progress. Hang on...",
  });
  const user_data = {
    email: username.value,
    password: password.value,
  };

  await api.get("/sanctum/csrf-cookie");
  await api
    .post("/api/admin/login", user_data)
    .then(({ data }) => {
      const token = data.access_token;
      const user = username.value;
      const user_type= data.user_type;
      store.dispatch("auth/loginDataSave", { user, token,user_type }); // Use the store instance
      router.push("/home");
    })
    .catch((error) => {
      if (error?.response?.status == 422) {
        $q.dialog({
          title: "Error",
          message: error.response.data.message,
        });
      } else {
        console.log("Error:", error.response);
      }
    })
    .finally(() => {
      $q.loading.hide();
    });
}
</script>
<style>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}

.normal_gradient {
  background: linear-gradient(145deg, rgb(74, 94, 137) 15%, #b61924 70%);
}

.dark_gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}

.login-form {
  position: absolute;
  box-shadow: 5px 5px 8px #7070702b;
  border: 1px solid #80808045;
}

.log {
  text-align: center;
  padding: 10px 0px 0px;
  color: #f44336;
  font-weight: 600;
}

.background {
  background-image: linear-gradient(#03a9f429, white);
}

.login-button {
  text-align: center;
}
</style>
