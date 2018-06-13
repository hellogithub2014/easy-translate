<template>
  <div id="app">
    <nav-menu></nav-menu>
    <router-link to="hello-world"></router-link>
    <router-link to="translate"></router-link>
    <router-view/>
  </div>
</template>

<script>
import NavMenu from './components/NavMenu';

export default {
  name: 'App',
  components: {
    NavMenu,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
