<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10">
        <span>{{fromLocale}}</span>
        ===
        <i class="el-icon-d-arrow-right"></i>
        <el-select :value="toLocale"  @change="updateToLocale" filterable placeholder="请选择">
          <!-- 禁用与来源相同的语言？ -->
          <el-option
            v-for="locale in validToLocaleList"
            :key="locale"
            :label="locale"
            :value="locale"
            :disabled="locale === fromLocale">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6" :offset="8">
        <add-text-entry></add-text-entry>
        <publish-transtion></publish-transtion>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import TYPES from '../store/mutation-types';
import PublishTranstion from './PublishTranstion';
import AddTextEntry from './AddTextEntry';

export default {
  name: 'trans-header',
  components: {
    PublishTranstion,
    AddTextEntry,
  },
  computed: {
    ...mapState({
      fromLocale: 'fromLocale',
      toLocale: 'toLocale',
    }),
    ...mapGetters(['validToLocaleList']),
  },
  methods: {
    ...mapActions({
      updateToLocale: TYPES.UPDATE_TO_LOCALE,
    }),
  },
};
</script>

<style scoped>

</style>
