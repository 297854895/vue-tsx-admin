import { AsyncPage } from '@/components'

export default () => <AsyncPage key="SystemLocalStore" load={() => import('./SystemLocalStore')} />
