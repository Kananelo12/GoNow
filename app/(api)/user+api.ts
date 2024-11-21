import { neon } from "@neondatabase/serverless";

/*
    Expo API Route for handling POST requests to insert a new user into the database.
*/

export async function POST(request: Request) {
  try {
    // Create a connection to the database using the Neon serverless driver.
    // The connection string is retrieved from the environment variable DATABASE_URL.
    const sql = neon(`${process.env.DATABASE_URL}`);
    // destructure items passed into the request
    const { name, email, clerkId } = await request.json();

    // Check if any of the required fields are missing. If so, return a 400 Bad Request response.
    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" }, // Error message indicating the issue.
        { status: 400 } // HTTP status code for client errors.
      );
    }

    // All required fields are present; proceed to insert the user into the database.
    const response = await sql`
    INSERT INTO users (
        name,
        email,
        clerk_id
    ) VALUES (
        ${name},
        ${email},
        ${clerkId} 
    )
  `;

    // Return a success response with the inserted data.
    return new Response(JSON.stringify({ data: response }), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    // Return a 500 Internal Server Error response with the error details.
    return Response.json({ error: error }, { status: 500 });
  }
}

// See https://neon.tech/docs/serverless/serverless-driver
// for more information
