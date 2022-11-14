import {NavigationContainer} from '@react-navigation/native'
import { useAuth } from '../hooks/auth'
import { SignIn } from '../screens/SignIn'
import { UserStackRoutes } from './user.stack.routes'
import { UserTabRoutes } from './user.tab.routes'

export function Routes() {
    const {user} = useAuth()
    return (
        <NavigationContainer>
            {/* <UserStackRoutes></UserStackRoutes> */}
            {user ? <UserStackRoutes></UserStackRoutes> : <SignIn></SignIn>}
        </NavigationContainer>
    )
}