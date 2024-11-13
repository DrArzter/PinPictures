// Ensure the function returns ApiResponse<null>
import { ApiResponse } from "@/app/types/global";


export default async function forgotPassword(email: string): Promise<ApiResponse<null>> {
  try {
    console.log(email);
    
    // Simulate successful response
    return {
      status: "success",
      message: "Password reset email sent",
      data: null
    };
  } catch (error) {
    console.error("Error during forgot password:", error);
    
    // Return an error response or rethrow the error if needed
    return {
      status: "error",
      message: "Failed to send password reset email",
      data: null
    };
  }
}
