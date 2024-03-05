import { db } from "@/lib/db";

export async function GET() {
    const employees = await db.employee.findMany()
    return Response.json(employees);
}