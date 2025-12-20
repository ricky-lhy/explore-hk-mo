import { Header } from './header'

const HeaderLayout = ({ children }: LayoutProps<'/[region]'>) => (
    <>
        <Header />
        {children}
    </>
)

export default HeaderLayout
