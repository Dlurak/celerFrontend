/**
     * Get the address of a location using nominatim
     * @param lat latitude
     * @param long longitude
     * @returns the address of the location or null if there was an error
     */
export const getAddress = async (lat: number, long: number): Promise<string | void> => {
    let cache = JSON.parse(localStorage.getItem('addressCache') || '{}');


    if (cache.hasOwnProperty(`${lat}|${long}`)) {
        return new Promise((resolve) => resolve(cache[`${lat}|${long}`]));
    } else {
        const url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`
        const response = await fetch(url);

        switch (response.status) {
            case 429:
                return new Promise((resolve) => resolve("You have exceeded the rate limit of 2 requests per second. In the future I will make sure that this does not happen again"));
            case 503:
                return new Promise((resolve) => resolve("The server is currently unavailable, please try again later"));
        }
        const data = (await response.json()) as { [key: string]: any };

        let address: string;

        if (data.hasOwnProperty("error")) {
            const message = 'The address could not be found ¯\\_(ツ)_/¯';
            address = message;
        } else {
            address = data.display_name;
        }

        localStorage.setItem('addressCache', JSON.stringify({ ...cache, [`${lat}|${long}`]: address }));

        return new Promise((resolve) => resolve(address));
    }
};