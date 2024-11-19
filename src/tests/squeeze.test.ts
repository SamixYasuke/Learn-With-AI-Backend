// import request from "supertest";
// import { app } from "../app";
// import { Squeeze } from "../models/sqeeze.model";
// import { AppDataSource } from "../data-source";

// describe("SqueezeController", () => {
//   beforeAll(async () => {
//     await AppDataSource.initialize();
//   });

//   afterAll(async () => {
//     await AppDataSource.destroy();
//   });

//   it("should fetch all squeezes", async () => {
//     const response = await request(app).get("/api/squeezes");
//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Array);
//   });

//   it("should create a squeeze", async () => {
//     const newSqueeze = {
//       email: "test@example.com",
//       first_name: "John",
//       last_name: "Doe",
//       phone: "1234567890",
//       location: "Test Location",
//       job_title: "Test Job",
//       company: "Test Company",
//       interests: ["coding", "reading"],
//       referral_source: "Google",
//     };

//     const response = await request(app).post("/api/squeezes").send(newSqueeze);
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("email", newSqueeze.email);
//   });

//   it("should fetch a squeeze by id", async () => {
//     // Assuming a squeeze with ID exists in the database
//     const squeeze = await Squeeze.create({
//       email: "john.doe@example.com",
//       first_name: "John",
//       last_name: "Doe",
//       phone: "9876543210",
//       location: "New Location",
//       job_title: "Developer",
//       company: "New Company",
//       interests: ["coding"],
//       referral_source: "Facebook",
//     }).save();

//     const response = await request(app).get(`/api/squeezes/${squeeze.id}`);
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("email", squeeze.email);
//   });

//   it("should return 404 for a non-existing squeeze", async () => {
//     const response = await request(app).get("/api/squeezes/non-existing-id");
//     expect(response.status).toBe(404);
//     expect(response.body).toHaveProperty("message", "Squeeze not found");
//   });
// });
