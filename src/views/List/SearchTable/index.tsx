import { AsyncPage } from '@/components'

export default () => <AsyncPage key="NotFound" load={() => import('./SearchTable')} />
