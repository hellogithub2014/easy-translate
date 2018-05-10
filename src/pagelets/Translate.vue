<template>
  <div>
    <nav-header></nav-header>
    <trans-list></trans-list>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from '../components/NavHeader';
import NavFooter from '../components/NavFooter';
import TransList from '../components/TransList';

export default {
  components: {
    NavHeader,
    TransList,
    NavFooter,
  },
};
</script>

<style scoped>

</style>
