import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  protected render() {
    return <div>
      <button onClick={() => this.$router.push({ name: 'home' })}>click</button>
    </div>
  }
}
