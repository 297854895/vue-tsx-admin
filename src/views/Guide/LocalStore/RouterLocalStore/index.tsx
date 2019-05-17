import { AsyncPage } from '@/components'

export default () => <AsyncPage key="RouterLocalStore" load={() => import('./RouterLocalStore')} />
