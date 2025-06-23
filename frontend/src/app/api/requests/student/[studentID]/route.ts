// This is the code that runs on the server, inside the Docker container

export async function GET(
    req: Request,
    { params }: { params: Promise<{ studentID: string }> }
) {
    const token = req.headers.get("Authorization");
    
    if (!token) {
        return new Response(JSON.stringify({ error: "No authorization token provided" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { studentID } = await params;
    const url = `http://gradingservice:3003/api/requests/student/${studentID}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": token,
        },
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
} 