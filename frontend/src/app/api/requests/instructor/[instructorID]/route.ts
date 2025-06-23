// This is the code that runs on the server, inside the Docker container
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ instructorID: string }> }
) {
    const token = req.headers.get("Authorization");
    
    if (!token) {
        return NextResponse.json({ error: "No authorization token provided" }, {
            status: 401,
        });
    }

    const { instructorID } = await params;
    const url = `http://gradingservice:3003/api/requests/instructor/${instructorID}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": token,
        },
    });

    const data = await res.json();
    return NextResponse.json(data, {
        status: res.status,
    });
} 