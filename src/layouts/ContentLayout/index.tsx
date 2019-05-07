import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ContentLayout extends Vue {
  render() {
    return <div>
      <router-view></router-view>
    </div>
  }
}
