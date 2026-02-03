import axios from "axios";

const fetch = id => axios.get("/api/tickets", { params: { id } });
const create = payload => axios.post("/api/tickets", payload);

export const ticketsApi = {
    fetch,
    create,
};

export default ticketsApi;
