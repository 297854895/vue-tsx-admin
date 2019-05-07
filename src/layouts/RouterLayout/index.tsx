import { Component, Vue } from 'vue-property-decorator'

@Component
export default class RouterLayout extends Vue {
  render() {
    return <transition name="router-fade">
      <router-view></router-view>
    </transition>
  }
}
