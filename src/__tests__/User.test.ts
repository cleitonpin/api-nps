import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe("User", () => {

    beforeAll(async () => {
        const conn = await createConnection();
        await conn.runMigrations();
    })
    
    afterAll(async () => {
        const conn = getConnection();
        await conn.dropDatabase();
        await conn.close();
    })

    it("Should be able to create a new user", async () => {
        const res = await request(app).post("/user").send({
            email: "user@example.com",
            name: "User"
        })

        expect(res.status).toBe(201);
    });

    it('Should not be able to create a user with wxists email', async () => {
        const res = await request(app).post("/user").send({
            email: "user@example.com",
            name: "User"
        })

        expect(res.status).toBe(400);
    })
})