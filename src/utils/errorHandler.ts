import { NextApiResponse } from "next";
import { z } from "zod";

export const handleError = (res: NextApiResponse, error: any) => {
    console.error(error);

    let errorMessage = "An unknown error occurred.";
    
    if (error instanceof z.ZodError) {
        const issue = error.issues[0];
        errorMessage = issue.message;
    } else if (error.message) {
        errorMessage = error.message;
    }

    return res.status(400).json({ status: 'error', message: errorMessage });
};
