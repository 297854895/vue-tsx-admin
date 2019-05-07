import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const appModule = namespace('app')

@Component
export default class About extends Vue {
  number = 0
  @appModule.Action('testAction') testAction !: Function;
  @appModule.State('state') numbers !: number;
  protected render() {
    return <div>
      <div>number from vuex: {this.numbers}</div>
      <button onClick={this.testAction}>number + 1</button>
      <div style={{ height: '1500px' }}>
        About
        {this.number}
        <button onClick={() => this.number += 1}>++++</button>
      </div>
    </div>
  }
}
