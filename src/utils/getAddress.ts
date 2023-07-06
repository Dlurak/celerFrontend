/**
     * Get the address of a location using nominatim
     * @param lat latitude
     * @param long longitude
     * @returns the address of the location or null if there was an error
     */
export const getAddress = async (lat: number, long: number): Promise<string | void> => {    
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`;
    const response = await fetch(url);
    const data = (await response.json()) as { [key: string]: any };

    // check if data has a error
    if (data.hasOwnProperty("error")) {
        return new Promise((resolve) => resolve());
    }

    return new Promise((resolve) => resolve(data.display_name));
};