import {ReactNode, createContext, useContext, useState, useEffect } from "react";
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Alert } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage' 

type User = {
    id: string;
    name: string;
    isAdmin: boolean;
}

type AuthContextData = {
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    isLoging:boolean;
    user: User | null;
}

type AuthProviderProps = {
    children: ReactNode;
}

const USER_COLLECTION = '@gopizza:users'

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({children} : AuthProviderProps) {

    const [user, setUser] = useState<User | null>(null)
    const [isLoging, setIsLoging] = useState(false);

    async function signIn(email:string, password: string) {
        if(!email || !password) {
            return Alert.alert('Login', 'Informe o e-mail e a senha')
        }

        setIsLoging(true)

        auth().signInWithEmailAndPassword(email, password)
        .then(account => {
            firestore().collection('users').doc(account.user.uid).get()
            .then(async (profile) => {
                const {name, isAdmin} = profile.data() as User;

                if(profile.exists) {
                    const userData = {
                        id: account.user.uid,
                        name,
                        isAdmin
                    };
                    await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(userData))
                    setUser(userData)
                }
            })
            .catch((err) => Alert.alert('Login', 'Não foi possível buscar os dadso de perfil do usuário:' + err) )
        })
        .catch(err => {
            const {code} = err;

            if (code === 'auth/user-not-found') {
                return Alert.alert('Login','Email não encontrado')
            }
            else if (code === 'auth/wrong-password') {
                return Alert.alert('Login','Senha incorreta')
            }
            else {
                return Alert.alert('Login', code)
            }
        })
        .finally(() => setIsLoging(false))
    }

    async function loadUserStorageData() {
        setIsLoging(true)  
        
        const storedUser = await AsyncStorage.getItem(USER_COLLECTION);
        if(storedUser) {
            const userData = JSON.parse(storedUser) as User;
            setUser(userData)
        }

        setIsLoging(false);
    }

    async function signOut() {
        await auth().signOut();
        await AsyncStorage.removeItem(USER_COLLECTION)
        setUser(null)
    }

    async function forgotPassword(email:string) {
        if(!email) {
            return Alert.alert('Redefinir senha', 'Informe o e-mail')
        }

        auth().sendPasswordResetEmail(email)
        .then(() => Alert.alert('Redefinir senha', 'Enviamos um link ao seu e-mail para redefinir sua senha'))
        .catch(err => Alert.alert('Erro ao redefinir senha', err))
    }

    useEffect(() => {
        loadUserStorageData()
    }, [])

    return (
        <AuthContext.Provider value={{signIn, signOut, forgotPassword, isLoging, user}}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)

    return context;
}

export {AuthProvider, useAuth}