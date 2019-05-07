import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
  protected render() {
    return <div>Home</div>
  }
}
