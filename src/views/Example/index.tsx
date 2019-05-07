import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Example extends Vue {
  protected render() {
    return <div>
      Example
      <div>
        {this.$route.path}
      </div>
    </div>
  }
}
