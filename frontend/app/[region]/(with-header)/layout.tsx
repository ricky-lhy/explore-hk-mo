import { FloatingActionButton } from './fab'
import { Header } from './header'

const HeaderLayout = ({ children }: LayoutProps<'/[region]'>) => (
    <div className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <FloatingActionButton className="sticky bottom-4.5 z-50 mr-4.5 self-end" />
    </div>
)

export default HeaderLayout
