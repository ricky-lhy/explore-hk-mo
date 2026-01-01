import { FloatingActionButton } from './fab'
import { Header } from './header'

const HeaderLayout = ({ children }: LayoutProps<'/[region]'>) => (
    <>
        <Header />
        <FloatingActionButton />
        {children}
    </>
)

export default HeaderLayout
