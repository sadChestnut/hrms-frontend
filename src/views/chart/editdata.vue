<template lang="pug">
el-dialog(title="编辑表格数据", :visible="dialogFormVisible", :before-close="closeDialog")
  el-form.edit-data-style(label-width="100px")
    el-form-item(:label-width="formLabelWidth", v-for="item in column", :label="item.label", :key="item.prop")
      el-input.chart-input-style(v-model="formdata[item.prop]",:disabled="item.prop==='index'")
  div(slot="footer")
    el-button(@click="closeDialog") 取 消
    el-button(type="primary", @click="submitData") 确 定
</template>
<script>
export default {
  name: 'edit-data',
  props: {
    isshow: {
      type: Boolean,
      required: true
    },
    column: {
      type: Array,
      required: true
    },
    currentRow: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      formLabelWidth: '120px',
      dialogFormVisible: this.isshow
    }
  },
  computed: {
    formdata: function () {
      return this.currentRow === null ? {} : { ...this.currentRow }
    }
  },
  methods: {
    closeDialog () {
      this.dialogFormVisible = false
      this.$emit('click', this.dialogFormVisible)
    },
    submitData () {
      this.$emit('updateData', this.formdata)
      this.closeDialog()
    }
  },
  watch: {
    isshow: {
      handler: function (newVal, oldVal) {
        this.dialogFormVisible = newVal
      },
      deep: true
    },
    currentRow: {
      handler: function (newVal, oldVal) {
        this.formdata = {...newVal}
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
.edit-data-style {
  .chart-input-style {
    width: 300px;
  }
}

</style>
