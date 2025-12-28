import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, fullName } = await req.json();

        if (!email || !fullName) {
            return NextResponse.json(
                { error: "Missing data" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            await prisma.user.create({
                data: {
                    email,
                    fullName,
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("USER SYNC ERROR:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
