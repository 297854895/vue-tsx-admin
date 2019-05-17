import { AsyncPage } from '@/components'

export default () => <AsyncPage load={() => import('./Home')} />
