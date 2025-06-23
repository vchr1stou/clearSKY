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
    // This new endpoint will likely point to the coursesService to get courses by instructor
    const url = `http://courses-service:3002/api/courses/instructor/${instructorID}`;

    try {
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
    } catch (error) {
        return NextResponse.json({ error: "Failed to connect to courses service" }, {
            status: 500,
        });
    }
} 