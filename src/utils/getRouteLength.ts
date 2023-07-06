/**
     * Get the length of a route using the osrm api
     * @param startLocation the start location of the route first element is latitude second is longitude
     * @param destinationLocation the destination location of the route first element is latitude second is longitude
     * @returns the length of the route in km
     */
export const getRouteLength = async (startLocation: [number, number], destinationLocation: [number, number]): Promise<number> => {
    const url = `http://router.project-osrm.org/route/v1/driving/${startLocation[0]},${startLocation[1]};${destinationLocation[0]},${destinationLocation[1]}?overview=false&geometries=geojson`;
    const response = await fetch(url);
    const data = (await response.json()).routes[0].distance;

    console.log(data / 1000);
    return new Promise((resolve) => resolve(data / 1000));
};