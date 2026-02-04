import axios from "axios";

const create = payload => axios.post("/users", payload);
const signin = credentials => axios.post("/users/signin", credentials);

export const usersApi = {
    create,
    signin,
};

export default usersApi;
