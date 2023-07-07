export type geoJSONrideRequests = {
    "type": "FeatureCollection";
    "features": {
        "type": "Feature";
        "geometry": {
            "type": "Point";
            "coordinates": [number, number];
        };
        "properties": {
            "id": string | number;
            "weight": number;
            "volume": number;
        };
    }[];
}