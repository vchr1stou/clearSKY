// This is the code that runs on the server, inside the Docker container

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseID: string; institutionID: string; examPeriod: string }> }
) {
    const token = req.headers.get("Authorization");
    
    if (!token) {
        return new Response(JSON.stringify({ error: "No authorization token provided" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { courseID, institutionID, examPeriod } = await params;
    const url = `http://statisticsservice:3004/api/stats/courseStats/${courseID}/${institutionID}/${examPeriod}`;

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