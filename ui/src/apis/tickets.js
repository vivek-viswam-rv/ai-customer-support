import axios from "axios";

const fetch = id => axios.get(`/tickets/${id}`);
const create = payload => axios.post("/tickets", payload);

export const ticketsApi = {
    fetch,
    create,
};

export default ticketsApi;
