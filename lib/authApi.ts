type Credentials = {
    username: string;
    password: string;
};
 
export const login = async (credentials: Credentials): Promise<boolean> => {
    // Mocking a successful login for username: "test" and password: "test"
    if (credentials.username === "test" && credentials.password === "test") {
        return true;
    }
    return false;
};