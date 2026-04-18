import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            id: string;
            name: string;
            email: string;
            telephone: string;
            role: 'user' | 'admin' | 'restaurantOwner';
            createdAt: string;
            token: string;
        } & DefaultSession["user"]
    }

    interface User {
        _id: string;
        id: string;
        name: string;
        email: string;
        telephone: string;
        role: 'user' | 'admin' | 'restaurantOwner';
        createdAt: string;
        token: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        id: string;
        role: 'user' | 'admin' | 'restaurantOwner';
        telephone: string;
        createdAt: string;
        token: string;
    }
}