// This is the code that runs on the server, inside the Docker container

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ requestID: string }> }
) {
    const token = req.headers.get("Authorization");
    
    if (!token) {
        return new Response(JSON.stringify({ error: "No authorization token provided" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { requestID } = await params;
    const body = await req.json();
    const url = `http://gradingservice:3003/api/requests/${requestID}`;

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
} 