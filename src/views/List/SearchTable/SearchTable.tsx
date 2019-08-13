import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import styles from './index.less'
import FilterBox from './FilterBox'
import Table from './Table'

import createName from './createName'

interface data {
  name: string;
  gender: number;
  age: number;
}

type formKey = 'name' | 'gender' | 'age'

const createData = (max: number) => {
  const source = []
  for (let idx = 0; idx < max; idx++) {
    source[source.length] = {
      key: idx,
      name: createName(),
      gender: Math.random() > 0.5 ? 1 : 0,
      age: Math.ceil(Math.random() * 100)
    }
  }
  return source
}

const source = createData(376)

@Component
export default class SearchTable extends Vue {
  form: {
    name: string;
    age: string;
    gender: number
  } = {
    name: '',
    age: '',
    gender: -1
  }
  loading: boolean = false;
  pageSize: number = 10;
  currentPage: number = 1;
  // 数据
  data: Array<data> = source;
  // 筛选出来的数据
  filter: Array<data> = source;
  // 当前语言
  @State(state => state.language.current) readonly currentLanguage!: string;
  // 分页变化
  private async pageChange(page: number) {
    this.loading = true
    await new Promise(reslove => {
      setTimeout(reslove, 1500)
    })
    this.loading = false
    this.currentPage = page
  }
  // 搜索
  private async search() {
    this.loading = true
    await new Promise(reslove => {
      setTimeout(reslove, 1500)
    })
    this.filter = source.filter((item: data) => {
      let nameFlag = true
      if (!this.form.name || (this.form.name && item.name.indexOf(this.form.name) > -1)) {
        nameFlag = true
      } else {
        nameFlag = false
      }

      let ageFlag = true
      if (!this.form.age || (`${this.form.age}` === `${item.age}`)) {
        ageFlag = true
      } else {
        ageFlag = false
      }

      let genderFlag = true
      if (this.form.gender !== -1) {
        genderFlag = item.gender === this.form.gender
      }

      return nameFlag && ageFlag && genderFlag
    })
    this.loading = false
  }
  // 重置
  private async reset() {
    this.form.age = '';
    this.form.name = ''
    this.form.gender = -1;
    this.loading = true
    await new Promise(reslove => {
      setTimeout(reslove, 1500)
    })
    this.loading = false
    this.filter = source
  }
  // 筛选条件发生改变
  private formchange(data: { key: formKey, value: any }) {
    this.form[data.key] = data.value
  }
  protected render() {
    const {
      $locale,
      currentLanguage
    } = this

    return <div class={styles.wrapper}>
      <FilterBox
        formData={this.form}
        onSearch={this.search}
        onReset={this.reset}
        onFormchange={this.formchange}
        locale={$locale[currentLanguage].list.searchTable} />
      <Table
        total={this.filter.length}
        size={this.pageSize}
        loading={this.loading}
        onPagechange={this.pageChange}
        currentPage={this.currentPage}
        data={this.filter.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)}
        locale={$locale[currentLanguage].list.searchTable} />
    </div>
  }
}
