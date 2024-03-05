import { db } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const employees = await db.employee.findFirst(
        {
            where: {
                id: params.id
            }
        }
    )
    return Response.json(employees);
}