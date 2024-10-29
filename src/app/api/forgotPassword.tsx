export default async function forgotPassword(email: string) {
    try {
       console.log(email);
    } catch (error) {
        console.error("Error during forgot password:", error);
        throw error;
    }
}