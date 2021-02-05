import { beginRequest, endRequest } from './notifications.js';
import API from './api.js';

const endpoints = {
    DESTINATIONS: 'data/destinations',
    DESTINATIONS_BY_ID: 'data/destinations/',
};

const api = new API(
    '69A8A1FD-DE88-4C7B-FF99-6624F3BB4400',
    'C2432C51-D0B0-4A80-BDD4-DCA232A90455',
    beginRequest,
    endRequest
);

export const login = api.login.bind(api);
export const register = api.register.bind(api);
export const logout = api.logout.bind(api);

// getAll() create() getDetailsById() editById() deleteById() likeById()

export async function getAll() {
    return api.get(endpoints.DESTINATIONS);
}

export async function createDestination(destination) {
    return api.post(endpoints.DESTINATIONS, destination);
}

export async function getDestinationById(id) {
    return api.get(endpoints.DESTINATIONS_BY_ID + id);
}

export async function editDestination(id, updatedDestination) {
    return api.put(endpoints.DESTINATIONS_BY_ID + id, updatedDestination);
}

export async function deleteDestination(id) {
    return api.delete(endpoints.DESTINATIONS_BY_ID + id);
}

export function checkResult(result) {
    if (result.hasOwnProperty('errorData')) {
        const error = new Error();
        Object.assign(error, result);
        throw error;
    }
}