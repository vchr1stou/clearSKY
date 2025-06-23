// This is the code that runs on the server, inside the Docker container

export async function GET(req: Request) {
    const token = req.headers.get("Authorization");
    
    if (!token) {
        return new Response(JSON.stringify({ error: "No authorization token provided" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const res = await fetch("http://usermanagementservice:3001/api/userManagement/usersByInstitution", {
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