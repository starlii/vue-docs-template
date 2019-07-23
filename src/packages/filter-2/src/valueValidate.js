export default {
  methods: {
    valueValidate(value) {
      if (this.valueType === 'number') {
        this.$set(
          this.formDataSelf,
          value,
          this.formDataSelf[value].replace(/[^\.\d]/g, '')
        )
        this.$set(
          this.formDataSelf,
          value,
          this.formDataSelf[value].replace('.', '')
        )
      } else {
        this.$set(
          this.formDataSelf,
          value,
          this.formDataSelf[value].match(/^(-|\d*)(\.?\d{0,2})/g)[0] || null
        )
      }
    }
  },
  computed: {
    maxValidate() {
      return (
        this.formDataSelf.max !== null &&
        this.formDataSelf.max !== '' &&
        Number(this.formDataSelf.max) < Number(this.formDataSelf.min)
      )
    }
  }
}
