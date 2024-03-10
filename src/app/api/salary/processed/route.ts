import { db } from "@/lib/db";

export async function GET() {
    const processedSalaries = await db.salaryProcess.findMany({
        include: {
            employee: true
        }
    })
    return Response.json(processedSalaries);
}