import { useState, useEffect, useMemo } from 'react';
import MapView from '../components/Map/MapView';
import type { MapFilters, MapLocation } from '../types/map';
import { StaticLocationRepository } from '../services/staticLocationRepository';
import { filterLocations } from '../utils/mapFilters';

    const defaultFilters: MapFilters = {
    searchText: '',
    category: undefined,
    type: undefined,
    id: undefined,
    lat: undefined,
    lng: undefined,
    city: '',
    description: '',
};

export default function MapPage() {

    const[selectedLocationId, setSelectedLocationId] = useState<string | undefined>(undefined);
    const[allLocations, setAllLocations] = useState<MapLocation[]>([]);
    const[filters, setFilters] = useState<MapFilters>(defaultFilters);
    const[isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const repository = new StaticLocationRepository();

        async function loadLocations() {
            try {
                const locations = await repository.getAllLocations();
                setAllLocations(locations);
            } catch (error) {
                console.error('Error loading locations:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadLocations();
    }, []);

    const visibleLocations = useMemo(() => {
        return filterLocations(allLocations, filters);
    }, [allLocations, filters]);

    const selectedLocation = useMemo(() => {
        if(!selectedLocationId){ return null};
        
    return allLocations.find((location) => location.id === selectedLocationId) ?? null;
}, [selectedLocationId, allLocations]);
    if(isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
            }}>
                <div>
                    <h1>Loading...</h1>
                    <p>Please wait while we load the map...</p>
                </div>
            </div>
        )
    }

    return (
    <div style= {{display: 'grid', gridTemplateColumns: '320px 1fr', height: '100vh'}}>
        <aside style={{borderRight: '1px solid #2a2a2a', padding: '16px', overflowY: 'auto'}}>
           <h2>Interactive Filters</h2>

           <input style={{ width: '100%', marginBottom: '16px'}} type="text" placeholder="Search locations" value={filters.searchText} 
             onChange={(e) => setFilters((previousFilters: MapFilters) => ({
                    ...previousFilters,
                    searchText: e.target.value,
                     }))} 
            />
           <p>Total locations: {allLocations.length}</p>
           <p>Visible locations: {visibleLocations.length}</p>

           {selectedLocation ? (
            <div style={{marginTop: '16px'}}>
                <h3>{selectedLocation.city}</h3>
                <p>{selectedLocation.description}</p>
               
            </div>
           ) : ( <p style={{marginTop: '16px'}}>Select a location to view details</p> 
           )}
        </aside>
<main>
    <MapView locations={visibleLocations} selectedLocation={selectedLocation} onLocationSelect={setSelectedLocationId} />
</main>
    </div>
    )
}
