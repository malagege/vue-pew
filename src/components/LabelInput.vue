<template>
  <div class="label_input">
    <input
      v-if="is_edit"
      type="text"
      :value="value"
      @input="chgText($event.target.value)"
      v-on:keyup.enter="is_edit=false"
    >
    <span v-else @dblclick="is_edit=true">{{value}}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: String
  },
  data() {
    return {
      is_edit: false
    };
  },
  methods: {
    chgText(value) {
      this.$emit("input", value);
    }
  }
};
</script>

<style scoped>
.label_input {
  display: inline-block;
}
</style>
