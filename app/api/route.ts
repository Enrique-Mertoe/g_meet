import {NextResponse} from "next/server";

const users = [{id: 1, name: "Abuti Martin"}]; // Dummy database

// GET: Fetch users
export async function GET() {
    return NextResponse.json({})
}

// POST: Create a new user
export async function POST(request: Request) {
    const body = await request.json();
    const newUser = {id: users.length + 1, ...body};
    users.push(newUser);
    return NextResponse.json(newUser, {status: 201});
}

// PUT: Update user (Dummy Example, normally you fetch from DB)
export async function PUT(request: Request) {
    const body = await request.json();
    const user = users.find((u) => u.id === body.id);
    if (!user) return NextResponse.json({error: "User not found"}, {status: 404});

    user.name = body.name; // Update name
    return NextResponse.json(user, {status: 200});
}

// DELETE: Delete user
export async function DELETE(request: Request) {
    const body = await request.json();
    const index = users.findIndex((u) => u.id === body.id);
    if (index === -1) return NextResponse.json({error: "User not found"}, {status: 404});

    users.splice(index, 1); // Remove user
    return NextResponse.json({message: "User deleted"}, {status: 200});
}