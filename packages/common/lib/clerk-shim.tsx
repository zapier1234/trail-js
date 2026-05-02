'use client';

import React from 'react';

// No-op shim for @clerk/nextjs - removes all authentication
export const ClerkProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SignInButton = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const UserButton = () => null;
export const SignedIn = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const SignedOut = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const AuthenticateWithRedirectCallback = () => null;

export const useUser = () => ({ user: null, isLoaded: true, isSignedIn: false });
export const useAuth = () => ({ userId: null, isLoaded: true, isSignedIn: false, getToken: async () => null });
export const useClerk = () => ({ signOut: async () => {}, openSignIn: () => {} });
export const useSignIn = () => ({ signIn: null, setActive: async () => {}, isLoaded: true });
export const useSignUp = () => ({ signUp: null, setActive: async () => {}, isLoaded: true });
