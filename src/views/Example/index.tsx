import { Component, Vue } from 'vue-property-decorator'
import VirtualList from '@/components/VirtualList'

@Component
export default class Example extends Vue {
  checkChange(data: any) {
    console.log(data)
  }
  protected render() {
    const arr: any = [
      { key: 'first', label: 'first' }
    ];
    for (let num = 0; num < 999; num++) {
      arr.push({
        key: num,
        label: Math.random()
      })
    }
    return <div>
      <div style={{ width: '500px', margin: '50px', background: '#fff', padding: '24px' }}>
        <VirtualList
          size={32}
          remain={5}>
          {
            arr.map((item: any) => <div key={item.key} style={{ height: '32px' }}>
              {item.label}
            </div>)
          }
        </VirtualList>
      </div>
    </div>
  }
}
