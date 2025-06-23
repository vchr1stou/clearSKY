// This is the code that runs on the server, inside the Docker container

export async function POST(req: Request) {
    const body = await req.json();

    const res = await fetch("http://authservice:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}