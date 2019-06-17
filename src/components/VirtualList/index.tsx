import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import _debounce from './debounce'
// 基于vue-virtual-scroll-list改写tsx版本。原版本1.3.9不支持在ie11下正常使用 https://github.com/tangbc/vue-virtual-scroll-list
@Component
export default class VirtualList extends Vue {
  // 单条高度
  @Prop({ type: Number, required: true }) size: number;
  // 保留多少行
  @Prop({ type: Number, required: true }) remain: number;
  // 外置包裹类名
  @Prop({ type: String, default: '' }) wclass: string;
  // 是否开启pagemode
  @Prop({ type: Boolean, default: false }) pagemode: boolean;
  // 起始位置
  @Prop({ type: Number, default: 0 }) start: number;
  // 偏移量
  @Prop({ type: Number, default: 0 }) offset: number;
  @Prop({ type: Function || Boolean, default: (idx: number) => false }) variable: Function | boolean;
  @Prop({ type: Number, default: 0 }) bench: number;
  @Prop({ type: Number, default: 0 }) debounce: number;
  @Prop({ type: Function || Boolean, default: () => false }) toTop: Function;
  @Prop({ type: Function || Boolean, default: () => false }) tobottom: Function;
  @Prop({ type: Function || Boolean, default: () => false  }) onscroll: Function;
  @Prop({ type: Object || null, default: () => null }) item: object | null;
  @Prop({ type: Number, default: 0 }) itemcount: number;
  @Prop({ type: Function, default: () => {} }) itemprops: Function;
  // data
  delta: { [x: string]: any } = this.initDelta()
  changeProp: string = ''
  @Watch('size')
  onSizeChange() {
    this.changeProp = 'size'
  }
  @Watch('remain')
  onRemainChange() {
    this.changeProp = 'remain'
  }
  @Watch('bench')
  onBenchChange() {
    this.changeProp = 'bench'
    this.itemModeForceRender()
  }
  @Watch('start')
  onStartChange() {
    this.changeProp = 'start'
    this.itemModeForceRender()
  }
  @Watch('offset')
  onOffsetChange() {
    this.changeProp = 'offset'
    this.itemModeForceRender()
  }
  @Watch('itemcount')
  onItemcountChange () {
    this.changeProp = 'itemcount'
    this.itemModeForceRender()
  }

  private onScroll (event: Event) {
      const delta = this.delta,
            vsl = this.$refs.vsl,
            offset = this.pagemode
                     ? window.pageYOffset
                     : ((vsl as any).$el || vsl).scrollTop || 0

      delta.direction = offset > delta.scrollTop ? 'D' : 'U'
      delta.scrollTop = offset

      if (delta.total > delta.keeps) {
          this.updateZone(offset)
      } else {
          delta.end = delta.total - 1
      }

      const offsetAll = delta.offsetAll

      if (this.onscroll && typeof this.onscroll === 'function') this.onscroll(event, {
        offset,
        offsetAll,
        start: delta.start,
        end: delta.end
      })

      if (!offset && delta.total) this.fireEvent('totop')
      if (offset >= offsetAll) this.fireEvent('tobottom')
  }

  // update render zone by scroll offset.
  private updateZone (offset: number) {
      let delta = this.delta,
          overs = this.variable
                  ? this.getVarOvers(offset)
                  : Math.floor(offset / this.size)

      // if scroll up, we'd better decrease it's numbers.
      if (delta.direction === 'U') overs = overs - this.remain + 1

      const zone = this.getZone(overs),
            bench = this.bench || this.remain

      // for better performance, if scroll pass items within now bench, do not update.
      // and if overs is going to reach last item, we should render next zone immediately.
      const shouldRenderNextZone = Math.abs(overs - delta.start - bench) === 1
      if (
          !shouldRenderNextZone &&
          (overs - delta.start <= bench) &&
          !zone.isLast && (overs > delta.start)
      ) return

      // we'd better make sure forceRender calls as less as possible.
      if (
          shouldRenderNextZone ||
          zone.start !== delta.start ||
          zone.end !== delta.end
      ) {
          delta.end = zone.end
          delta.start = zone.start
          this.forceRender()
      }
  }

  // return the right zone info base on `start/index`.
  private getZone (index: string | number) {
      let start, end
      const delta = this.delta

      index = parseInt(`${index}`, 10)
      index = Math.max(0, index)

      const lastStart = delta.total - delta.keeps
      const isLast = (index <= delta.total && index >= lastStart) || (index > delta.total)
      if (isLast) {
        end = delta.total - 1
        start = Math.max(0, lastStart)
      } else {
        start = index
        end = start + delta.keeps - 1
      }

      return {
        end,
        start,
        isLast
      }
  }

  private forceRender () {
    window.requestAnimationFrame(() => {
        this.$forceUpdate()
    })
  }

  // return the scroll passed items count in variable.
  private getVarOvers (offset: number) {
    let low = 0
    let middle = 0
    let middleOffset = 0
    let delta = this.delta
    let high = delta.total

    while (low <= high) {
      middle = low + Math.floor((high - low) / 2)
      middleOffset = this.getVarOffset(middle, null)

      // calculate the average variable height at first binary search.
      if (!delta.varAverSize) delta.varAverSize = Math.floor(middleOffset / middle)

      if (middleOffset === offset) return middle

      if (middleOffset < offset) {
          low = middle + 1
      } else if (middleOffset > offset) {
          high = middle - 1
      }
    }

    return low > 0 ? --low : 0
  }

  // return a variable scroll offset from given index.
  private getVarOffset (index: number, nocache: any) {
      let delta = this.delta
      const cache = delta.varCache[index]

      if (!nocache && cache) {
          return cache.offset
      }

      let offset = 0
      for (let i = 0; i < index; i++) {
        const size = this.getVarSize(i, nocache)
        delta.varCache[i] = {
          size: size,
          offset: offset
        }
        offset += size
      }

      delta.varLastCalcIndex = Math.max(delta.varLastCalcIndex, index - 1)
      delta.varLastCalcIndex = Math.min(delta.varLastCalcIndex, delta.total - 1)

      return offset
  }

  // return a variable size (height) from given index.
  private getVarSize (index: number, nocache: any) {
      const cache = this.delta.varCache[index]
      if (!nocache && cache) {
          return cache.size
      }

      if (typeof this.variable === 'function') {
          return this.variable(index) || 0
      } else {
        // when using item, it can only get current components height,
        // need to be enhanced, or consider using variable-function instead
        const slot = this.item
                     ? (this.$children[index] ? this.$children[index].$vnode : null)
                     : (this.$slots as any).default[index]

        const style = slot && slot.data && slot.data.style
        if (style && style.height) {
            const shm = style.height.match(/^(.*)px$/)
            return (shm && +shm[1]) || 0
        }
      }
      return 0
  }

  // return the variable paddingTop base current zone.
  // @todo: if set a large `start` before variable was calculated,
  // here will also case too much offset calculate when list is very large,
  // consider use estimate paddingTop in this case just like `getVarPaddingBottom`.
  private getVarPaddingTop () {
      return this.getVarOffset(this.delta.start, null)
  }

  // return the variable paddingBottom base current zone.
  private getVarPaddingBottom () {
      const delta = this.delta
      const last = delta.total - 1
      if (delta.total - delta.end <= delta.keeps || delta.varLastCalcIndex === last) {
        return this.getVarOffset(last, null) - this.getVarOffset(delta.end, null)
      } else {
        // if unreached last zone or uncalculate real behind offset
        // return the estimate paddingBottom avoid too much calculate.
        return (delta.total - delta.end) * (delta.varAverSize || this.size)
      }
  }

  // retun the variable all heights use to judge reach bottom.
  private getVarAllHeight () {
      const delta = this.delta
      if (delta.total - delta.end <= delta.keeps || delta.varLastCalcIndex === delta.total - 1) {
        return this.getVarOffset(delta.total, null)
      } else {
        return this.getVarOffset(delta.start, null) + (delta.total - delta.end) * (delta.varAverSize || this.size)
      }
  }

  // public method, allow the parent update variable by index.
  private updateVariable (index: number) {
      // clear/update all the offfsets and heights ahead of index.
      this.getVarOffset(index, true)
  }

  // trigger a props event on parent.
  private fireEvent (event: string) {
    if ((this as any)[event]) (this as any)[event]()
  }

  // set manual scroll top.
  private setScrollTop (scrollTop: number) {
      if (this.pagemode) {
          window.scrollTo(0, scrollTop)
      } else {
          let vsl = this.$refs.vsl
          if (vsl) {
              ((vsl as any).$el || vsl).scrollTop = scrollTop
          }
      }
  }

  // filter the shown items base on `start` and `end`.
  private filter () {
      let delta = this.delta
      const slots = this.$slots.default || []

      // item-mode shoud judge from items prop.
      if (this.item) {
          delta.total = this.itemcount
          if (delta.keeps > delta.total) {
              delta.end = delta.total - 1
          }
      } else {
          if (!slots.length) {
              delta.start = 0
          }
          delta.total = slots.length
      }

      let paddingTop, paddingBottom, allHeight
      const hasPadding = delta.total > delta.keeps

      if (this.variable) {
          allHeight = this.getVarAllHeight()
          paddingTop = hasPadding ? this.getVarPaddingTop() : 0
          paddingBottom = hasPadding ? this.getVarPaddingBottom() : 0
      } else {
          allHeight = this.size * delta.total
          paddingTop = this.size * (hasPadding ? delta.start : 0)
          paddingBottom = this.size * (hasPadding ? delta.total - delta.keeps : 0) - paddingTop
      }

      if (paddingBottom < this.size) {
          paddingBottom = 0
      }
      if (this.pagemode && this.$el && this.$el.parentElement) {
          let bodyRect = document.body.getBoundingClientRect()
          let elemRect = this.$el.parentElement.getBoundingClientRect()
          let offset = elemRect.top - bodyRect.top
          paddingTop -= offset
          if (paddingTop < 0) paddingTop = 0
      }
      delta.paddingTop = paddingTop
      delta.paddingBottom = paddingBottom
      delta.offsetAll = allHeight - this.size * this.remain

      let renders = []
      for (let i = delta.start; i < delta.total && i <= Math.ceil(delta.end); i++) {
          let slot = null
          if (this.item) {
            const CustomRender: any = this.item
            slot = <CustomRender {...this.itemprops(i)} />
          } else {
            slot = slots[i]
          }
          renders.push(slot)
      }

      return renders
  }

  private itemModeForceRender () {
    if (this.item) this.forceRender()
  }
  // 初始化delta
  private initDelta() {
      const start = this.start >= this.remain ? this.start : 0,
            keeps = this.remain + (this.bench || this.remain)
      return {
        direction: '',
        scrollTop: 0,
        start: start,
        end: start + keeps - 1,
        keeps: keeps,
        total: 0,
        offsetAll: 0,
        paddingTop: 0,
        paddingBottom: 0,
        varCache: {},
        varAverSize: 0,
        varLastCalcIndex: 0
      }
  }
  protected mounted () {
    if (this.pagemode) {
      window.addEventListener('scroll', this.debounce ? _debounce(this.onScroll.bind(this), this.debounce, false) : this.onScroll, false)
    }
    if (this.start) {
      const start = this.getZone(this.start).start
      this.setScrollTop(this.variable ? this.getVarOffset(start, null) : start * this.size)
    } else if (this.offset) {
      this.setScrollTop(this.offset)
    }
  }

  protected beforeDestroy () {
    if (this.pagemode) {
      window.removeEventListener('scroll', this.debounce ? _debounce(this.onScroll.bind(this), this.debounce, false) : this.onScroll, false)
    }
  }

  // check if delta should update when props change.
  protected beforeUpdate () {
      let delta = this.delta
      delta.keeps = this.remain + (this.bench || this.remain)

      const calcstart = this.changeProp === 'start' ? this.start : delta.start
      const zone = this.getZone(calcstart)

      // if start, size or offset change, update scroll position.
      if (this.changeProp && ['start', 'size', 'offset'].includes(this.changeProp)) {
          const scrollTop = this.changeProp === 'offset'
                            ? this.offset : this.variable
                                ? this.getVarOffset(zone.isLast ? delta.total : zone.start, null)
                                : zone.isLast && (delta.total - calcstart <= this.remain)
                                    ? delta.total * this.size : calcstart * this.size

          this.$nextTick(this.setScrollTop.bind(this, scrollTop))
      }

      // if points out difference, force update once again.
      if (
          this.changeProp ||
          delta.end !== zone.end ||
          calcstart !== zone.start
      ) {
          this.changeProp = ''
          delta.end = zone.end
          delta.start = zone.start
          this.forceRender()
      }
  }

  protected render() {
    const dbc = this.debounce,
          { paddingTop, paddingBottom } = this.delta,
          renderList = <div
                        class={this.wclass}
                        role="group"
                        style={
                          {
                            display: 'block',
                            paddingTop: paddingTop + 'px',
                            paddingBottom: paddingBottom + 'px'
                          }
                        }>
                        {this.filter()}
                      </div>

    if (this.pagemode) return renderList

    return <div
      ref="vsl"
      onScroll={dbc ? _debounce(this.onScroll.bind(this), dbc, false) : this.onScroll}
      style={
        {
          display: 'block',
          overflowY: 'auto',
          height: `${this.size * this.remain}px`
        }
      }>
      {renderList}
    </div>
  }
}
