// No-op server shim for @clerk/nextjs/server
export const auth = async () => ({ userId: null });
export const currentUser = async () => null;
export const clerkMiddleware = (fn?: any) => {
    return async (req: any) => {
        const { NextResponse } = await import('next/server');
        if (fn) return fn({ userId: null }, req);
        return NextResponse.next();
    };
};
