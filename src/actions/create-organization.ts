'use server';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt'

import { CreateOrganizationValidatePayload } from "@/app/(auth)/sign-up/page";
import { db } from '@/lib/db';

export async function createOrganization(organization: CreateOrganizationValidatePayload) {
    const saltRounds = 10;
    const myPlaintextPassword = organization.name + Date.now();

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(organization.password, salt);

    const organizationObj = {
        email: organization.email,
        name: organization.name,
        hashedPassword: hash,
    }

    try {
        const user = await db.organization.create({
            data: organizationObj
        })
        return { message: `Organization created successfully` };
    } catch (e) {
        return { error: "Failed to create organization" };
    }
}